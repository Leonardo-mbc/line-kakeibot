const ENDPOINT = 'https://us-central1-lema-cloud.cloudfunctions.net';
let currentGroup = null;
const now = moment();
let currentTarget = `${now.format('YYYY-MM')}`;

window.onload = function(e) {
  const currentMonthElement = document.getElementById('current-month');
  currentMonthElement.innerText = `${currentTarget.split('-')[1]}月`;

  fetch(`${ENDPOINT}/getUsers`)
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
    .then(({ users }) => {
      getReceiptsData(currentTarget).then(({ receipts }) => {
        update({ receipts, users });
      });

      document.getElementById('before-month').addEventListener('click', () => {
        currentTarget = moment(currentTarget)
          .add(-1, 'month')
          .format('YYYY-MM');
        currentMonthElement.innerText = `${currentTarget.split('-')[1]}月`;
        getReceiptsData(currentTarget).then(({ receipts }) => {
          update({ receipts, users });
        });
      });

      document.getElementById('next-month').addEventListener('click', () => {
        currentTarget = moment(currentTarget)
          .add(1, 'month')
          .format('YYYY-MM');
        currentMonthElement.innerText = `${currentTarget.split('-')[1]}月`;
        getReceiptsData(currentTarget).then(({ receipts }) => {
          update({ receipts, users });
        });
      });
    });

  liff.init(function(data) {
    initializeApp(data);
  });
};

function initializeApp(data) {}

function getReceiptsData(currentTarget) {
  return fetch(`${ENDPOINT}/getReceipts?target=${currentTarget}`)
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
    .then(({ receipts }) => {
      return { receipts };
    });
}

function update({ receipts, users }) {
  document.getElementById('loading').className = 'loading hide';

  if (receipts.length === 0) {
    document.getElementById('groups').innerHTML = '<span class="no-data">データなし</span>';
    document.getElementById('users').innerHTML = '<span class="no-data">データなし</span>';
    document.getElementById('details').innerHTML = '<span class="no-data">データなし</span>';
  } else {
    const groupsElement = document.getElementById('groups');
    const groups = receipts.map((item) => item.group).filter((x, i, self) => self.indexOf(x) === i && x !== '');
    if (currentGroup === null) {
      currentGroup = groups[0];
    }
    groupsElement.innerHTML = groups
      .map((group, idx) => {
        return `<span id="${idx}-${group}" class="group-name${currentGroup === group ? ' selected' : ''}">${group}</span>`;
      })
      .join('');
    groups.map((group, idx) => {
      document.getElementById(`${idx}-${group}`).addEventListener('click', () => {
        currentGroup = group;
        update({ receipts, users });
      });
    });

    const usersElement = document.getElementById('users');
    const userIds = receipts.map((item) => item.who).filter((x, i, self) => self.indexOf(x) === i && x !== '');

    let costs = {};
    userIds.map((user) => (costs[user] = 0));

    receipts.map((item) => {
      if (item.group === currentGroup && item.price !== '' && item.who !== '') {
        costs[item.who] += parseInt(item.price);
      }
    });
    usersElement.innerHTML = Object.keys(costs)
      .map((userId) => {
        return `
        <div class="user">
          <span class="name">${users[userId].name}</span>
          <span class="price">${costs[userId].toLocaleString()}</span>
        </div>
      `;
      })
      .join('');

    const detailsElement = document.getElementById('details');
    detailsElement.innerHTML = receipts
      .sort(compareReceipts)
      .map((item) => {
        if (item.group === currentGroup && item.price !== '' && item.who !== '') {
          return `
          <div class="detail">
            <div class="top">
              <span>${item.place}</span>
              <span>${item.price.toLocaleString()}</span>
            </div>
            <div class="bottom">
              <span>${users[item.who].name}</span>
              <span>${item.boughtAt}</span>
            </div>
          </div>
        `;
        }
      })
      .join('');
  }
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
