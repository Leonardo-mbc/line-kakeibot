const groupName = document.getElementById('group-name');
const closeButton = document.getElementById('close-button');

window.onload = function(e) {
  const query = parseSearch(location.search);
  if (query.code) {
    fetch(`https://us-central1-line-kakeibot.cloudfunctions.net/linkGroup?code=${query.code}&groupId=${query.groupId}`)
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
      .then(({ name }) => {
        groupName.textContent = name;
        clearLoader();
      });
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

function clearLoader() {
  loader.classList.add('transparent');
  setTimeout(() => {
    loader.classList.add('hide');
  }, 200);
}

closeButton.addEventListener('click', () => {
  window.open('about:blank', '_self').close();
});
