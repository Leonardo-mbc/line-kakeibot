window.onload = function(e) {
  liff.init(function(data) {
    initializeApp(data);
  });
};

function initializeApp(data) {
  const clientId = 1629647599;
  const redirectUri = encodeURIComponent('https://line-kakeibot.firebaseapp.com/setting/');
  const state = '12345abcdef';
  location.href = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=profile`;
}
