const ENDPOINT = 'https://us-central1-line-kakeibot.cloudfunctions.net';

const loader = document.getElementById('loader');
const currentMonth = document.getElementById('current-month');
const beforeMonth = document.getElementById('before-month');
const nextMonth = document.getElementById('next-month');
const groupsElement = document.getElementById('groups');
const usersElement = document.getElementById('users');
const detailsElement = document.getElementById('details');

const now = moment();
let currentGroupId = null;
let currentTarget = `${now.format('YYYY-MM')}`;

window.onload = function(e) {
  // TODO デバッグ用
  initializeApp({ context: { userId: 'U319dd80e522591556e7ecf188db5e30c' } });

  liff.init(function(data) {
    initializeApp(data);
  });
};

function initializeApp(data) {
  currentMonth.innerText = `${currentTarget.split('-')[1]}月`;

  const userId = data.context.userId;
  getReceiptsData(userId, currentTarget).then(({ receipts, users, groups }) => {
    update({ receipts, users, groups });
    beforeMonth.addEventListener('click', () => {
      showLoader();

      currentTarget = moment(currentTarget)
        .add(-1, 'month')
        .format('YYYY-MM');
      currentMonth.innerText = `${currentTarget.split('-')[1]}月`;
      getReceiptsData(userId, currentTarget).then(({ receipts }) => {
        update({ receipts, users, groups });
      });
    });

    nextMonth.addEventListener('click', () => {
      showLoader();

      currentTarget = moment(currentTarget)
        .add(1, 'month')
        .format('YYYY-MM');
      currentMonth.innerText = `${currentTarget.split('-')[1]}月`;
      getReceiptsData(userId, currentTarget).then(({ receipts }) => {
        update({ receipts, users, groups });
      });
    });
  });
}

function getReceiptsData(userId, currentTarget) {
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

    let costs = {};
    userIds.map((userId) => (costs[userId] = 0));

    receipts[currentGroupId].map((item) => {
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

    if (receipts[currentGroupId].length === 0) {
      detailsElement.innerHTML = '<span class="no-data">データなし</span>';
    } else {
      detailsElement.innerHTML = receipts[currentGroupId]
        .sort(compareReceipts)
        .map((item) => {
          if (item.price !== '' && item.who !== '') {
            return `
          <div class="detail">
            <div class="top">
              <span>${item.place}</span>
              <span>${item.price.toLocaleString()}</span>
            </div>
            <div class="bottom">
              <span>${users[item.who]}</span>
              <span>${item.boughtAt}</span>
            </div>
          </div>
        `;
          }
        })
        .join('');
    }
  }

  clearLoader();
}

function compareReceipts(a, b) {
  const dateA = moment(a.boughtAt);
  const dateB = moment(b.boughtAt);

  if (dateA.isBefore(dateB)) {
    return 1;
  } else if (dateB.isBefore(dateA)) {
    return -1;
  } else {
    return 0;
  }
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
