window.onload = (e) => {
  liff.init({ liffId: '1629647599-9R71R42e' }).then(() => {
    if (!liff.isLoggedIn() && !liff.isInClient()) {
      liff.login({ redirectUri: location.href });
    } else {
      initializeApp();
    }
  });
};

function initializeApp() {
  let price = 0;
  const inputElement = document.getElementById('input');
  inputElement.addEventListener('input', function (event) {
    if (event.target.value) {
      price = parseInt(event.target.value.replace(/,|[^0-9]/g, ''));
      inputElement.value = price.toLocaleString();
    } else {
      price = 0;
      inputElement.value = 0;
    }
  });

  Array.prototype.slice.call(document.getElementsByName('add-button')).map((item) => {
    item.addEventListener('click', function (event) {
      price += parseInt(event.target.value);
      inputElement.value = price.toLocaleString();
    });
  });

  document.getElementById('clear').addEventListener('click', function (event) {
    price = 0;
    inputElement.value = 0;
  });

  document.getElementById('send-button').addEventListener('click', function () {
    liff
      .sendMessages([
        {
          type: 'text',
          text: `${price}`,
        },
      ])
      .then(function () {
        liff.closeWindow();
      })
      .catch(function (error) {
        window.alert('メッセージの送信に失敗しました、トーク画面で開いていますか？: ' + error);
      });
  });
}
