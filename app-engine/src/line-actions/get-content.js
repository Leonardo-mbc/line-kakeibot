const ENDPOINTS = require("../constants/endpoints");
const { CHANNEL_ACCESS_TOKEN } = require("../constants/secret");

module.exports = {
  getContent: async (messageId) => {
    try {
      const response = await fetch(
        `${ENDPOINTS.LINE_MESSAGE_V2}/${messageId}/content`,
        {
          headers: {
            Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,
          },
        }
      );

      if (response.ok) {
        const contentType = response.headers.get("Content-Type");
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return { contentType, buffer };
      } else {
        const error = await response.text();
        console.error("%%%% Error in getContent/!response.ok", error);
        console.error("%%%% messageId:", messageId);
        throw {
          message: error,
          status: response.status,
        };
      }
    } catch (error) {
      console.error("%%%% Error in getContent/fetch", error);
      throw {
        message: error,
        status: 500,
      };
    }
  },
};
