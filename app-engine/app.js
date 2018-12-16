const express = require('express');
const bodyParser = require('body-parser');
const { lineWebhook } = require('./src/actions/line-webhook');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (request, response) => {
  response.status(200).send('Hello, world!');
});

app.get('/add-group-wrapper', (request, response) => {
  const { groupId } = request.query;
  response.render('./add-group-wrapper/index.ejs', { groupId, clientId: 1629647599 });
});

app.get('/add-group', (request, response) => {
  const { groupId } = request.query;
  response.render('./add-group/index.ejs', { groupId });
});

app.get('/invite-group', (request, response) => {
  const { groupId, name } = request.query;
  response.render('./invite-group/index.ejs', { groupId, name });
});

app.post('/', (request, response) => {
  const { events } = request.body;
  lineWebhook(events);
  response.sendStatus(200);
});

if (module === require.main) {
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}

module.exports = app;
