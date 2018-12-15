const fetch = require('node-fetch');
const ENDPOINTS = require('../constants/endpoints');
const { CHANNEL_ACCESS_TOKEN } = require('../constants/secret');

module.exports = {
  getContent: async (messageId) => {
    const response = await fetch(`${ENDPOINTS.LINE_MESSAGE_V2}/${messageId}/content`, {
      headers: {
        Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`
      }
    });

    if (response.ok) {
      const contentType = response.headers.get('Content-Type');
      const buffer = await response.buffer();
      return { contentType, buffer };
    } else {
      const error = await response.text();
      console.error(error);
      throw {
        message: error,
        status: response.status
      };
    }
  }
};
