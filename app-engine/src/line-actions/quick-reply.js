const { lineReply } = require('./line-reply');

module.exports = {
  quickReply: async ({ messages, replies, replyToken }) => {
    try {
      const replyMessages = messages.map((text, index) => {
        return index === messages.length - 1
          ? {
              type: 'text',
              text,
              quickReply: {
                items: replies.map((itemText) => {
                  const item = {
                    type: 'action',
                    action: {
                      type: 'message',
                      label: itemText,
                      text: itemText
                    }
                  };

                  return item;
                })
              }
            }
          : {
              type: 'text',
              text
            };
      });

      await lineReply({
        replyToken,
        messages: replyMessages
      });
    } catch ({ status, message }) {
      throw {
        message,
        status
      };
    }
  }
};
