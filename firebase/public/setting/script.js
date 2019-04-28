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
const groupOutConfirm = document.getElementById('group-out-confirm');
const outGroupName = document.getElementById('out-group-name');
const outYes = document.getElementById('out-yes');
const tutorialContainer = document.getElementById('tutorial-container');
const tutorialPager = document.getElementById('tutorial-pager');
const nextPage = document.getElementById('next-page');
const beforePage = document.getElementById('before-page');
const letsStart = document.getElementById('lets-start');
const tutorialSkip = document.getElementById('tutorial-skip');
const helpGroup = document.getElementById('help-group');
const help = document.getElementById('help');

const ERROR_GET_PROFILE = 'プロフィール取得に失敗しました。\n再度開き直してみてください。';
const ERROR_POST_GROUP = 'グループ作成に失敗しました。\n再度開き直してみてください。';
const ERROR_OUT_GROUP = 'グループ退出に失敗しました。\n再度開き直してみてください。';
const ERROR_CHANGE_NAME = '名前の変更に失敗しました。\n再度開き直してみてください。';

let userId = null;
let outGroupId = '';
let pagerTouchstartX = null;
let pagerPageNum = 0;
const PAGER_DIST = 80;
const MAX_PAGE = document.getElementsByClassName('tutorial-page').length;

window.onload = function(e) {
  // デバッグ用
  // clearLoader();
  // initializeApp({ context: { userId: 'Ubd1328317076c27b7d24fad4f5ab3d3c' } });

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
            showTutorial();
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
      //   clearLoader();
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

      const buttons = document.createElement('div');
      const invite = document.createElement('button');
      invite.id = 'group-invite';
      invite.className = 'group-button invite';
      invite.textContent = '招待';
      invite.onclick = () => {
        const name = encodeURIComponent(groups[key].name);
        liff.openWindow({
          url: `https://line-kakeibot.appspot.com/invite-group?groupId=${key}&name=${name}`
        });
      };
      const out = document.createElement('button');
      out.id = 'group-out';
      out.className = 'group-button out';
      out.textContent = '退出';
      out.onclick = () => {
        const name = groups[key].name;
        outGroupName.innerText = name;
        outGroupId = key;
        groupOutConfirm.classList.remove('hide');
        setTimeout(() => {
          groupOutConfirm.classList.remove('transparent');
        }, 10);
      };

      buttons.appendChild(out);
      buttons.appendChild(invite);

      div.appendChild(span);
      div.appendChild(buttons);
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

function showLoader() {
  loader.classList.remove('hide');
  setTimeout(() => {
    loader.classList.remove('transparent');
  }, 10);
}

function clearLoader() {
  loader.classList.add('transparent');
  setTimeout(() => {
    loader.classList.add('hide');
  }, 200);
}

function clearOutConfirm() {
  groupOutConfirm.classList.add('transparent');
  setTimeout(() => {
    groupOutConfirm.classList.add('hide');
    outGroupName.innerText = '';
    outGroupId = '';
  }, 200);
}

function showTutorial(startPage = 0) {
  setPageNum(startPage);
  tutorialPager.style.transform = `translate3d(-${pagerPageNum * 100}%, 0px, 0px)`;
  tutorialContainer.classList.remove('hide');
  setTimeout(() => {
    tutorialContainer.classList.remove('transparent');
  }, 1);
}

function hideTutorial() {
  tutorialContainer.classList.add('transparent');
  setTimeout(() => {
    tutorialContainer.classList.add('hide');
  }, 200);
}

function setPageNum(page) {
  pagerPageNum = page;
  if (page === 0) {
    beforePage.classList.add('hide');
    letsStart.classList.add('hide');
    nextPage.classList.remove('hide');
  } else if (page === MAX_PAGE - 1) {
    nextPage.classList.add('hide');
    letsStart.classList.remove('hide');
  } else {
    nextPage.classList.remove('hide');
    beforePage.classList.remove('hide');
    letsStart.classList.add('hide');
  }
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

groupOutConfirm.addEventListener('click', () => {
  clearOutConfirm();
});

outYes.addEventListener('click', (e) => {
  e.stopPropagation();
  const groupId = outGroupId;

  showLoader();
  clearOutConfirm();

  fetch('https://us-central1-line-kakeibot.cloudfunctions.net/outGroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId,
      groupId
    })
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        window.alert(ERROR_OUT_GROUP);
      }
    })
    .then(({ groups }) => {
      setGroupList(groups);
      clearLoader();
    })
    .catch((e) => {
      window.alert(ERROR_OUT_GROUP);
    });
});

// tutorialPager.addEventListener('touchstart', (e) => {
//   pagerTouchstartX = e.touches[0].clientX;
// });

// tutorialPager.addEventListener('touchmove', (e) => {
//   if (pagerTouchstartX !== null) {
//     const moveX = e.touches[0].clientX - pagerTouchstartX;
//     if (moveX < -PAGER_DIST && pagerPageNum < MAX_PAGE - 1) {
//       setPageNum(pagerPageNum + 1);
//       tutorialPager.style.transform = `translate3d(-${pagerPageNum * 100}%, 0px, 0px)`;
//       pagerTouchstartX = null;
//     } else if (PAGER_DIST < moveX && 0 < pagerPageNum) {
//       setPageNum(pagerPageNum - 1);
//       tutorialPager.style.transform = `translate3d(-${pagerPageNum * 100}%, 0px, 0px)`;
//       pagerTouchstartX = null;
//     } else {
//       tutorialPager.style.transform = `translate3d(calc(${moveX}px - ${pagerPageNum * 100}%), 0px, 0px)`;
//     }
//   }
// });

// tutorialPager.addEventListener('touchend', () => {
//   tutorialPager.style.transform = `translate3d(-${pagerPageNum * 100}%, 0px, 0px)`;
//   pagerTouchstartX = null;
// });

nextPage.addEventListener('click', () => {
  setPageNum(pagerPageNum + 1);
  tutorialPager.style.transform = `translate3d(-${pagerPageNum * 100}%, 0px, 0px)`;
});

beforePage.addEventListener('click', () => {
  setPageNum(pagerPageNum - 1);
  tutorialPager.style.transform = `translate3d(-${pagerPageNum * 100}%, 0px, 0px)`;
});

letsStart.addEventListener('click', () => {
  hideTutorial();
});

tutorialSkip.addEventListener('click', () => {
  hideTutorial();
});

helpGroup.addEventListener('click', () => {
  showTutorial(4);
});

help.addEventListener('click', () => {
  showTutorial();
});
