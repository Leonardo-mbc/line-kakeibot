const { lineReply } = require('./line-reply');

module.exports = {
  textReply: async function ({ messages, replyToken }) {
    try {
      await lineReply({
        replyToken,
        messages: messages.map((text) => {
          const item = {
            type: 'text',
            text: text,
          };

          return item;
        }),
      });
    } catch ({ status, message }) {
      console.error('%%%% Error in textReply', error);
      throw {
        message,
        status,
      };
    }
  },
};
