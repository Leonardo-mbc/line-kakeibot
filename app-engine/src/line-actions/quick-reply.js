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
                items: replies.map((replyItem) => {
                  const item = {
                    type: 'action',
                    action: {
                      type: 'postback',
                      label: replyItem.text,
                      displayText: replyItem.text,
                      data: replyItem.data
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
