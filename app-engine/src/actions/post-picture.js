const fetch = require('node-fetch');
const ENDPOINTS = require('../constants/endpoints');

module.exports = {
  postPicture: async ({ buffer, contentType, filepath }) => {
    try {
      const response = await fetch(`${ENDPOINTS.FUNCTIONS}/postPicture?filepath=${filepath}`, {
        method: 'POST',
        headers: {
          'Content-Type': contentType,
        },
        body: buffer,
      });

      if (response.ok) {
        return;
      } else {
        const { message } = await response.text();
        console.error('%%%% Error in postPicture/!response.ok', error);
        throw {
          message,
          status: response.status,
        };
      }
    } catch ({ status, message }) {
      console.error('%%%% Error in postPicture', error);
      throw {
        message,
        status,
      };
    }
  },
};
