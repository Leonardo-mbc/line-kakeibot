const loader = document.getElementById('loader');
const nameInput = document.getElementById('name');
const groupList = document.getElementById('group-list');
const showArchives = document.getElementById('show-archives');
const showArchivesText = document.getElementById('show-archives-text');
const groupListArchived = document.getElementById('group-list-archived');
const addButton = document.getElementById('add-button');
const saveButton = document.getElementById('save-button');
const adaptButton = document.getElementById('adapt-button');
const noGroupsText = document.getElementById('no-groups-text');
const groupAddContainer = document.getElementById('group-add-container');
const groupEnddateButton = document.getElementById('group-enddate-button');
const groupEnddateInput = document.getElementById('group-enddate-input');
const groupAddButton = document.getElementById('group-add-button');
const groupName = document.getElementById('group-name');
const needCoop = document.getElementById('need-coop');
const sendLoginId = document.getElementById('send-login-id');
const saveNameButton = document.getElementById('save-name-button');
const outGroup = document.getElementById('out-group');
const groupOutConfirm = document.getElementById('group-out-confirm');
const outGroupName = document.getElementById('out-group-name');
const outYes = document.getElementById('out-yes');
const groupChangeEnddateContainer = document.getElementById('group-change-enddate-container');
const groupChangeEnddate = document.getElementById('group-change-enddate');
const groupChangeEnddateInput = document.getElementById('group-change-enddate-input');
const groupChangeNodate = document.getElementById('group-change-nodate');
const groupChangeButton = document.getElementById('group-change-button');
const menuContainer = document.getElementById('menu-container');
const changeEnddate = document.getElementById('change-enddate');
const tutorialContainer = document.getElementById('tutorial-container');
const tutorialPager = document.getElementById('tutorial-pager');
const nextPage = document.getElementById('next-page');
const beforePage = document.getElementById('before-page');
const letsStart = document.getElementById('lets-start');
const tutorialSkip = document.getElementById('tutorial-skip');
const helpGroup = document.getElementById('help-group');
const help = document.getElementById('help');
const inquiryBlock = document.getElementById('inquiry-block');

const ERROR_GET_PROFILE = 'プロフィール取得に失敗しました。\n再度開き直してみてください。';
const ERROR_POST_GROUP = 'グループ作成に失敗しました。\n再度開き直してみてください。';
const ERROR_EDIT_GROUP = 'グループ修正に失敗しました。\n再度開き直してみてください。';
const ERROR_OUT_GROUP = 'グループ退出に失敗しました。\n再度開き直してみてください。';
const ERROR_CHANGE_NAME = '名前の変更に失敗しました。\n再度開き直してみてください。';

const TEXT_SHOW_ARCHIVES = '期限切れの家計簿を表示';
const TEXT_HIDE_ARCHIVES = 'とじる';

let userId = null;
let selectedGroupId = '';
let joiningGroups = [];
let pagerTouchstartX = null;
let pagerPageNum = 0;
const PAGER_DIST = 80;
const MAX_PAGE = document.getElementsByClassName('tutorial-page').length;

window.onload = function (e) {
  // デバッグ用
  // clearLoader();
  // initializeApp({ context: { userId: 'Ubd1328317076c27b7d24fad4f5ab3d3c' } });

  liff.init(function (data) {
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
        .then(function (liffProfile) {
          setProfile({
            name: liffProfile.displayName,
            ...profile,
          });
          clearLoader();

          if (!profile.name) {
            showTutorial();
            fetch('https://us-central1-line-kakeibot.cloudfunctions.net/postName', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: liffProfile.displayName,
                userId,
              }),
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
  joiningGroups = groups;
  const currentDate = new Date().getTime();
  const groupItems =
    Object.keys(groups).length !== 0 &&
    Object.keys(groups).map((key) => {
      const div = document.createElement('div');
      div.id = `group-${key}`;
      div.className = 'group-item';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'group-name';
      nameSpan.textContent = groups[key].name;

      const dateSpan = document.createElement('span');
      dateSpan.className = 'group-enddate';
      dateSpan.textContent = `期限：${groups[key].enddate || 'なし'}`;

      const groupNameDate = document.createElement('div');
      groupNameDate.className = 'group-namedate';
      groupNameDate.appendChild(nameSpan);
      groupNameDate.appendChild(dateSpan);

      const buttons = document.createElement('div');
      buttons.className = 'group-buttons';

      const invite = document.createElement('button');
      invite.id = 'group-invite';
      invite.className = 'group-button invite';
      invite.textContent = '招待';
      invite.onclick = () => {
        const name = encodeURIComponent(groups[key].name);
        liff.openWindow({
          url: `https://line-kakeibot.appspot.com/invite-group?groupId=${key}&name=${name}`,
        });
      };
      const setting = document.createElement('img');
      setting.id = 'group-setting';
      setting.className = 'group-setting';
      setting.src = 'images/setting.svg';
      setting.onclick = () => {
        showMenu(key);
      };

      buttons.appendChild(invite);
      buttons.appendChild(setting);

      div.appendChild(groupNameDate);
      div.appendChild(buttons);

      return {
        active: !groups[key].enddate || currentDate <= new Date(groups[key].enddate).getTime(),
        element: div,
      };
    });
  if (groupItems) {
    groupList.innerHTML = '';
    groupListArchived.innerHTML = '';
    groupItems.map(({ active, element }) => {
      if (active) {
        groupList.appendChild(element);
      } else {
        groupListArchived.appendChild(element);
      }
    });

    if (groupListArchived.innerHTML !== '') {
      showArchives.classList.remove('hide');
    } else {
      showArchives.classList.add('hide');
    }
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

function changeButtonMode(mode, button, inputs) {
  switch (mode) {
    case 'loading':
      button.disabled = true;
      button.classList.add('loading');
      break;
    case 'default':
    default:
      button.disabled = false;
      button.classList.remove('loading');
      inputs.forEach((input) => (input.value = ''));
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
    selectedGroupId = '';
  }, 200);
}

function clearChangeEnddate() {
  groupChangeEnddateContainer.classList.add('transparent');
  setTimeout(() => {
    groupChangeEnddateContainer.classList.add('hide');
    groupChangeEnddateInput.value = '';
  }, 200);
}

function changeGroup(group) {
  const groupId = selectedGroupId;

  showLoader();
  clearChangeEnddate();
  clearMenu();

  fetch('https://us-central1-line-kakeibot.cloudfunctions.net/editGroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      groupId,
      group,
      userId,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        window.alert(ERROR_EDIT_GROUP);
      }
    })
    .then(({ groups }) => {
      setGroupList(groups);
      clearLoader();
    })
    .catch((e) => {
      window.alert(ERROR_EDIT_GROUP);
    });
}

function showMenu(groupId) {
  selectedGroupId = groupId;
  document.getElementById(`group-${groupId}`).classList.add('selected');
  menuContainer.classList.remove('hide');
  setTimeout(() => {
    menuContainer.classList.remove('transparent');
  }, 10);
}

function clearMenu() {
  const groupDOM = document.getElementById(`group-${selectedGroupId}`);
  if (groupDOM) {
    groupDOM.classList.remove('selected');
  }
  selectedGroupId = null;
  menuContainer.classList.add('transparent');
  setTimeout(() => {
    menuContainer.classList.add('hide');
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
showArchives.addEventListener('click', () => {
  groupListArchived.classList.toggle('hide');
  showArchives.classList.toggle('open');
});

addButton.addEventListener('click', () => {
  changeGroupAddMode('add');
});

groupEnddateButton.addEventListener('click', () => {
  groupEnddateButton.classList.add('hide');
  groupEnddateInput.classList.remove('hide');
});

groupAddButton.addEventListener('click', () => {
  if (groupName.value) {
    changeButtonMode('loading', groupAddButton, [groupName, groupEnddateInput]);
    const name = groupName.value;
    const enddate = groupEnddateInput.value;

    fetch('https://us-central1-line-kakeibot.cloudfunctions.net/postGroup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        enddate,
        userId,
      }),
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
        changeButtonMode('default', groupAddButton, [groupName, groupEnddateInput]);
      })
      .catch((e) => {
        window.alert(ERROR_POST_GROUP);
      });
  }
});

saveNameButton.addEventListener('click', () => {
  if (nameInput.value) {
    changeButtonMode('loading', saveNameButton, [nameInput]);
    const name = nameInput.value;

    fetch('https://us-central1-line-kakeibot.cloudfunctions.net/postName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        userId,
      }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          window.alert(ERROR_CHANGE_NAME);
        }
      })
      .then(({ name }) => {
        changeButtonMode('default', saveNameButton, [nameInput]);
        nameInput.value = name;
      })
      .catch((e) => {
        window.alert(ERROR_CHANGE_NAME);
      });
  }
});

outGroup.addEventListener('click', (e) => {
  e.stopPropagation();
  const name = joiningGroups[selectedGroupId].name;
  outGroupName.innerText = name;
  groupOutConfirm.classList.remove('hide');
  setTimeout(() => {
    groupOutConfirm.classList.remove('transparent');
  }, 10);
});

groupOutConfirm.addEventListener('click', () => {
  clearOutConfirm();
  clearMenu();
});

outYes.addEventListener('click', (e) => {
  e.stopPropagation();
  const groupId = selectedGroupId;

  showLoader();
  clearOutConfirm();
  clearMenu();

  fetch('https://us-central1-line-kakeibot.cloudfunctions.net/outGroup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      groupId,
    }),
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

changeEnddate.addEventListener('click', (e) => {
  e.stopPropagation();
  groupChangeEnddateContainer.classList.remove('hide');
  setTimeout(() => {
    groupChangeEnddateContainer.classList.remove('transparent');
  }, 10);
});

groupChangeEnddateContainer.addEventListener('click', () => {
  clearChangeEnddate();
  clearMenu();
});

groupChangeEnddate.addEventListener('click', (e) => {
  e.stopPropagation();
});

groupChangeNodate.addEventListener('click', (e) => {
  e.stopPropagation();
  changeGroup({ enddate: '' });
});

groupChangeButton.addEventListener('click', (e) => {
  e.stopPropagation();
  const enddate = groupChangeEnddateInput.value;
  changeGroup({ enddate });
});

menuContainer.addEventListener('click', () => {
  clearMenu();
});

inquiryBlock.addEventListener('click', () => {
  liff.openWindow({
    url: `https://docs.google.com/forms/d/e/1FAIpQLSeBu603ocQR4f08xhl1wQ0fRmNke813FvODiKs4hiuefO0K5w/viewform?usp=pp_url&entry.1546140386=${userId}`,
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
