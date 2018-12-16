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
const saveNameButton = document.getElementById('save-name-button');

const ERROR_GET_PROFILE = 'プロフィール取得に失敗しました。\n再度開き直してみてください。';
const ERROR_POST_GROUP = 'グループ作成に失敗しました。\n再度開き直してみてください。';
const ERROR_CHANGE_NAME = '名前の変更に失敗しました。\n再度開き直してみてください。';

let userId = null;

window.onload = function(e) {
  liff.init(function(data) {
    initializeApp(data);
  });
};

function initializeApp(data) {
  userId = data.context.userId;

  fetch(`https://us-central1-line-kakeibot.cloudfunctions.net/getProfile?userId=${userId}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        window.alert(ERROR_GET_PROFILE);
      }
    })
    .then((profile) => {
      liff
        .getProfile()
        .then(function(liffProfile) {
          setProfile({
            name: liffProfile.displayName,
            ...profile
          });
          clearLoader();

          if (!profile.name) {
            fetch('https://us-central1-line-kakeibot.cloudfunctions.net/postName', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: liffProfile.displayName,
                userId
              })
            });
          }
        })
        .catch((e) => {
          window.alert(ERROR_GET_PROFILE);
          clearLoader();
        });
    })
    .catch((e) => {
      window.alert(ERROR_GET_PROFILE);
      clearLoader();
    });
}

function setProfile(profile) {
  nameInput.value = profile.name;
  setGroupList(profile.groups);
}

function setGroupList(groups) {
  const groupItems =
    Object.keys(groups).length !== 0 &&
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

function changeButtonMode(mode, button, input) {
  switch (mode) {
    case 'loading':
      button.disabled = true;
      button.classList.add('loading');
      break;
    case 'default':
    default:
      button.disabled = false;
      button.classList.remove('loading');
      input.value = '';
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
    changeButtonMode('loading', groupAddButton, groupName);
    const name = groupName.value;

    fetch('https://us-central1-line-kakeibot.cloudfunctions.net/postGroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        userId
      })
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          window.alert(ERROR_POST_GROUP);
        }
      })
      .then(({ groups }) => {
        setGroupList(groups);
        changeGroupAddMode('none');
        changeButtonMode('default', groupAddButton, groupName);
      })
      .catch((e) => {
        window.alert(ERROR_POST_GROUP);
      });
  }
});

saveNameButton.addEventListener('click', () => {
  if (nameInput.value) {
    changeButtonMode('loading', saveNameButton, nameInput);
    const name = nameInput.value;

    fetch('https://us-central1-line-kakeibot.cloudfunctions.net/postName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        userId
      })
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          window.alert(ERROR_CHANGE_NAME);
        }
      })
      .then(({ name }) => {
        changeButtonMode('default', saveNameButton, nameInput);
        nameInput.value = name;
      })
      .catch((e) => {
        window.alert(ERROR_CHANGE_NAME);
      });
  }
});
