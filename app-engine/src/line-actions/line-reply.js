const ENDPOINTS = require("../constants/endpoints");
const { CHANNEL_ACCESS_TOKEN } = require("../constants/secret");

module.exports = {
  lineReply: async function ({ messages, replyToken }) {
    try {
      const response = await fetch(ENDPOINTS.LINE_REPLY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
        body: JSON.stringify({
          replyToken,
          messages,
        }),
      });

      if (response.ok) {
        return;
      } else {
        const error = await response.text();
        throw {
          message: error,
          status: response.status,
        };
      }
    } catch ({ status, message }) {
      throw {
        message,
        status,
      };
    }
  },
};
