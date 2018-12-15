const loader = document.getElementById('loader');
const nameInput = document.getElementById('name');
const groupList = document.getElementById('group-list');
const addButton = document.getElementById('add-button');
const saveButton = document.getElementById('save-button');
const adaptButton = document.getElementById('adapt-button');
const noGroupsText = document.getElementById('no-groups-text');
const groupAddContainer = document.getElementById('group-add-container');
const groupAddButton = document.getElementById('group-add-button');
const groupName = document.getElementById('group-name');
const needCoop = document.getElementById('need-coop');
const sendLoginId = document.getElementById('send-login-id');

let loginId = null;

window.onload = function(e) {
  liff.init();
  const query = parseSearch(location.search);
  if (query.code) {
    fetch(`https://us-central1-line-kakeibot.cloudfunctions.net/lineLoginAuth?code=${query.code}`)
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
      .then((auth) => {
        fetch('https://us-central1-line-kakeibot.cloudfunctions.net/getProfile', {
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${auth.access_token}`
          }
        })
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
          .then((profile) => {
            loginId = profile.loginId;
            setProfile(profile);
            clearLoader();
          })
          .catch((error) => {
            clearLoader();
          });
      })
      .catch((error) => {
        clearLoader();
      });
  } else {
    setProfile({
      userId: 'dummy-login-id',
      name: 'dummy-name',
      groups: {
        'dummy-group-id-a': {
          name: 'group-name-a',
          users: ['user-id-a']
        },
        'dummy-group-id-b': {
          name: 'group-name-b',
          users: ['user-id-a']
        }
      }
    });
    clearLoader();
  }
};

function parseSearch(qs) {
  let query = {};
  qs.split(/[?&]/)
    .filter((v) => !!v)
    .map((v) => {
      const [key, value] = v.split('=');
      query = {
        ...query,
        [key]: value
      };
    });

  return query;
}

function setProfile(profile) {
  nameInput.value = profile.name;
  setGroupList(profile.groups);
}

function setGroupList(groups) {
  const groupItems =
    groups &&
    Object.keys(groups).map((key) => {
      const div = document.createElement('div');
      div.className = 'group-item';
      const span = document.createElement('span');
      span.className = 'group-name';
      span.textContent = groups[key].name;
      const button = document.createElement('button');
      button.id = 'group-invite';
      button.className = 'group-invite';
      button.textContent = '招待する';

      div.appendChild(span);
      div.appendChild(button);
      return div;
    });
  if (groupItems) {
    groupList.innerHTML = '';
    groupItems.map((item) => {
      groupList.appendChild(item);
    });
  }
}

function changeGroupAddMode(mode) {
  switch (mode) {
    case 'add':
      noGroupsText.classList.add('hide');
      addButton.classList.add('hide');
      groupAddContainer.classList.remove('hide');
      break;
    case 'none':
      noGroupsText.classList.remove('hide');
      addButton.classList.remove('hide');
      groupAddContainer.classList.add('hide');
      break;
  }
}

function changeAddButtonMode(mode) {
  switch (mode) {
    case 'loading':
      groupAddButton.disabled = true;
      groupAddButton.classList.add('loading');
      break;
    case 'default':
    default:
      groupAddButton.disabled = false;
      groupAddButton.classList.remove('loading');
      groupName.value = '';
  }
}

function clearLoader() {
  loader.classList.add('transparent');
  setTimeout(() => {
    loader.classList.add('hide');
  }, 200);
}

// EventListener
addButton.addEventListener('click', () => {
  changeGroupAddMode('add');
});

groupAddButton.addEventListener('click', () => {
  if (groupName.value) {
    changeAddButtonMode('loading');
    const name = encodeURIComponent(groupName.value);

    fetch(`https://us-central1-line-kakeibot.cloudfunctions.net/postGroup?name=${name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        loginId
      })
    })
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
      .then(({ groups }) => {
        setGroupList(groups);
        changeGroupAddMode('none');
        changeAddButtonMode('default');
      });
  }
});
