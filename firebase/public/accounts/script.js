const ENDPOINT = 'https://us-central1-line-kakeibot.cloudfunctions.net';

const loader = document.getElementById('loader');
const currentMonth = document.getElementById('current-month');
const beforeMonth = document.getElementById('before-month');
const nextMonth = document.getElementById('next-month');
const groupsElement = document.getElementById('groups');
const usersElement = document.getElementById('users');
const detailsElement = document.getElementById('details');
const menuContainer = document.getElementById('menu-container');
const moveAccountElement = document.getElementById('move-account');
const accountSelect = document.getElementById('account-select');
const accountList = document.getElementById('account-list');
const deletePayment = document.getElementById('delete-payment');
const deleteConfirm = document.getElementById('delete-confirm');
const deleteYes = document.getElementById('delete-yes');

const now = moment();
let currentGroupId = null;
let selectedPaymentId = null;
let userId = null;
let currentTarget = `${now.format('YYYY-MM')}`;

window.onload = function(e) {
  // TODO デバッグ用
  // initializeApp({ context: { userId: 'Ubd1328317076c27b7d24fad4f5ab3d3c' } });

  liff.init(function(data) {
    initializeApp(data);
  });
};

function initializeApp(data) {
  currentMonth.innerText = `${currentTarget.split('-')[1]}月`;

  userId = data.context.userId;
  getReceiptsData(userId, currentTarget).then(({ receipts, users, groups }) => {
    update({ receipts, users, groups });

    beforeMonth.addEventListener('click', () => {
      currentTarget = moment(currentTarget)
        .add(-1, 'month')
        .format('YYYY-MM');
      currentMonth.innerText = `${currentTarget.split('-')[1]}月`;
      getReceiptsData(userId, currentTarget).then(({ receipts, users, groups }) => {
        update({ receipts, users, groups });
      });
    });

    nextMonth.addEventListener('click', () => {
      currentTarget = moment(currentTarget)
        .add(1, 'month')
        .format('YYYY-MM');
      currentMonth.innerText = `${currentTarget.split('-')[1]}月`;
      getReceiptsData(userId, currentTarget).then(({ receipts, users, groups }) => {
        update({ receipts, users, groups });
      });
    });
  });
}

function getReceiptsData(userId, currentTarget) {
  showLoader();

  return fetch(`${ENDPOINT}/getReceipts?userId=${userId}&target=${currentTarget}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw {
          message: 'fetch error',
          status: response.status
        };
      }
    })
    .then((receipts) => {
      return receipts;
    });
}

function update({ receipts, users, groups }) {
  if (receipts.length === 0) {
    groupsElement.innerHTML = '<span class="no-data">データなし</span>';
    usersElement.innerHTML = '<span class="no-data">データなし</span>';
    detailsElement.innerHTML = '<span class="no-data">データなし</span>';
  } else {
    const groupIds = Object.keys(groups);
    const userIds = Object.keys(users);

    if (currentGroupId === null) {
      currentGroupId = groupIds[0];
    }
    groupsElement.innerHTML = groupIds
      .map((groupId) => {
        return `<span id="group-${groupId}" class="group-name${currentGroupId === groupId ? ' selected' : ''}">${groups[groupId].name}</span>`;
      })
      .join('');
    groupIds.map((groupId) => {
      document.getElementById(`group-${groupId}`).addEventListener('click', () => {
        currentGroupId = groupId;
        update({ receipts, users, groups });
      });
    });

    if (userIds.length === 0) {
      usersElement.innerHTML = '<span class="no-data">データなし</span>';
    } else {
      let costs = {};
      userIds.map((userId) => (costs[userId] = 0));

      Object.keys(receipts[currentGroupId]).map((paymentId) => {
        const item = receipts[currentGroupId][paymentId];
        if (item.price !== '' && item.who !== '') {
          costs[item.who] += parseInt(item.price);
        }
      });

      usersElement.innerHTML = userIds
        .map((userId) => {
          return `
        <div class="user">
          <span class="name">${users[userId]}</span>
          <span class="price">${costs[userId].toLocaleString()}</span>
        </div>
      `;
        })
        .join('');
    }

    if (Object.keys(receipts[currentGroupId]).length === 0) {
      detailsElement.innerHTML = '<span class="no-data">データなし</span>';
    } else {
      detailsElement.innerHTML = Object.keys(receipts[currentGroupId])
        .sort((a, b) => {
          const dateA = moment(receipts[currentGroupId][a].boughtAt);
          const dateB = moment(receipts[currentGroupId][b].boughtAt);
          if (dateA.isBefore(dateB)) {
            return 1;
          } else if (dateB.isBefore(dateA)) {
            return -1;
          } else {
            return 0;
          }
        })
        .map((paymentId) => {
          const item = receipts[currentGroupId][paymentId];
          if (item.price !== '' && item.who !== '') {
            return `
              <div id="payment-${paymentId}" class="detail">
                <div class="image-container">
                  <img onClick="showReceiptImage('${item.imageUrl}')" class="receipt-image" src="${item.imageUrl}" />
                </div>
                <div class="detail-item">
                  <div class="top">
                    <span>${item.place}</span>
                    <span>${item.price.toLocaleString()}</span>
                  </div>
                  <div class="bottom">
                    <span>${users[item.who]}</span>
                    <span>${moment(item.boughtAt).format('MM/DD')}</span>
                  </div>
                </div>
                <img onClick="showMenu('${paymentId}')" class="${userId === item.who ? '' : 'hide'}" src="images/menu-dot.png" />
              </div>
            `;
          }
        })
        .join('');
    }
  }

  clearLoader();
}

function clearLoader() {
  loader.classList.add('transparent');
  setTimeout(() => {
    loader.classList.add('hide');
  }, 200);
}

function showLoader() {
  loader.classList.remove('hide');
  setTimeout(() => {
    loader.classList.remove('transparent');
  }, 1);
}

function showMenu(paymentId) {
  selectedPaymentId = paymentId;
  document.getElementById(`payment-${paymentId}`).classList.add('selected');
  menuContainer.classList.remove('hide');
  setTimeout(() => {
    menuContainer.classList.remove('transparent');
  }, 10);
}

function clearMenu() {
  document.getElementById(`payment-${selectedPaymentId}`).classList.remove('selected');
  selectedPaymentId = null;
  menuContainer.classList.add('transparent');
  setTimeout(() => {
    menuContainer.classList.add('hide');
    deleteConfirm.classList.add('hide');
    accountSelect.classList.add('hide');
    accountSelect.classList.add('loading');
    accountList.innerHTML = '';
  }, 200);
}

function showReceiptImage(url) {
  liff.openWindow({ url });
}

function moveAccount({ groupId }) {
  fetch(`${ENDPOINT}/movePayment?currentGroupId=${currentGroupId}&targetGroupId=${groupId}&currentMonth=${currentTarget}&paymentId=${selectedPaymentId}`).then((response) => {
    if (response.ok) {
      clearMenu();
      getReceiptsData(userId, currentTarget).then(({ receipts, users, groups }) => {
        update({ receipts, users, groups });
      });
    } else {
      throw {
        message: 'fetch error',
        status: response.status
      };
    }
  });
}

// EventListener

menuContainer.addEventListener('click', () => {
  clearMenu();
});

moveAccountElement.addEventListener('click', (e) => {
  e.stopPropagation();
  accountSelect.classList.remove('hide');

  fetch(`${ENDPOINT}/getGroups?userId=${userId}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw {
          message: 'fetch error',
          status: response.status
        };
      }
    })
    .then((groups) => {
      accountSelect.classList.remove('loading');
      accountList.innerHTML = Object.keys(groups)
        .filter((id) => id !== currentGroupId)
        .map((id) => {
          return `<span id="account-${id}" class="target-account">${groups[id].name}</span>`;
        })
        .join('');

      Object.keys(groups)
        .filter((id) => id !== currentGroupId)
        .map((id) => {
          document.getElementById(`account-${id}`).addEventListener('click', (e) => {
            accountList.innerHTML = '';
            accountSelect.classList.add('loading');
            e.stopPropagation();
            moveAccount({ groupId: id });
          });
        });
    });
});

deletePayment.addEventListener('click', (e) => {
  e.stopPropagation();
  deleteConfirm.classList.remove('hide');
});

deleteYes.addEventListener('click', (e) => {
  e.stopPropagation();
  showLoader();
  fetch(`${ENDPOINT}/deletePayment?userId=${userId}&groupId=${currentGroupId}&currentMonth=${currentTarget}&paymentId=${selectedPaymentId}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw {
          message: 'fetch error',
          status: response.status
        };
      }
    })
    .then((data) => {
      clearMenu();
      getReceiptsData(userId, currentTarget).then(({ receipts, users, groups }) => {
        update({ receipts, users, groups });
        clearLoader();
      });
    });
});
