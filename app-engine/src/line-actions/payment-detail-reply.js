const { lineReply } = require('./line-reply');
const { getUserName } = require('../actions/get-user-name');

module.exports = {
  paymentDetailReply: async ({ payment, groupId, monthPayments, replyToken }) => {
    try {
      const userName = await getUserName(payment.who);
      const container = {
        type: 'bubble',
        hero: {
          type: 'image',
          url: payment.imageUrl,
          size: 'full',
          aspectRatio: '1.51:1',
          aspectMode: 'cover',
          action: {
            type: 'uri',
            label: '【画像】',
            uri: payment.imageUrl
          }
        },
        body: {
          type: 'box',
          layout: 'vertical',
          spacing: 'md',
          action: {
            type: 'uri',
            label: 'label',
            uri: 'line://app/1525303758-MxkqXypp'
          },
          contents: [
            {
              type: 'text',
              text: payment.place,
              size: 'xl',
              weight: 'bold'
            },
            {
              type: 'box',
              layout: 'vertical',
              spacing: 'sm',
              contents: [
                {
                  type: 'box',
                  layout: 'baseline',
                  contents: [
                    {
                      type: 'text',
                      text: `${payment.price.toLocaleString()}円`,
                      weight: 'bold',
                      margin: 'sm',
                      flex: 0
                    }
                  ]
                }
              ]
            },
            {
              type: 'separator',
              color: '#aaaaaa'
            },
            {
              type: 'box',
              layout: 'horizontal',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: `今月の累計（${userName}）`,
                  wrap: true,
                  color: '#aaaaaa',
                  size: 'xxs'
                },
                {
                  type: 'text',
                  text: `${monthPayments
                    .map((group) => {
                      return group.receipts
                        .filter((mPayment) => {
                          return mPayment.who === payment.who;
                        })
                        .reduce((pre, cur) => {
                          return parseInt(`${pre}`) + parseInt(`${cur.price}`);
                        }, 0);
                    })
                    .reduce((pre, cur) => pre + cur, 0)
                    .toLocaleString()}円`,
                  wrap: true,
                  color: '#aaaaaa',
                  size: 'xxs'
                }
              ]
            },
            {
              type: 'box',
              layout: 'horizontal',
              spacing: 'sm',
              contents: [
                {
                  type: 'text',
                  text: `今月の累計（${monthPayments
                    .filter((group) => groupId === group.groupId)
                    .map(({ groupName }) => groupName)
                    .join('')}）`,
                  wrap: true,
                  color: '#aaaaaa',
                  size: 'xxs'
                },
                {
                  type: 'text',
                  text: `${monthPayments
                    .filter((group) => groupId === group.groupId)
                    .map((group) => group.receipts.reduce((pre, cur) => parseInt(`${pre}`) + parseInt(`${cur.price}`), 0))
                    .reduce((pre, cur) => pre + cur, 0)
                    .toLocaleString()}円`,
                  wrap: true,
                  color: '#aaaaaa',
                  size: 'xxs'
                }
              ]
            }
          ]
        },
        footer: {
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'button',
              action: {
                type: 'uri',
                label: '設定を開く',
                uri: 'line://app/1629647443-Nq46aLqj'
              },
              color: '#636363',
              style: 'link'
            },
            {
              type: 'button',
              action: {
                type: 'uri',
                label: '家計簿を見る',
                uri: 'line://app/1629647443-xvO1GPY5'
              },
              color: '#00C239',
              style: 'primary'
            }
          ]
        }
      };

      await lineReply({
        replyToken,
        messages: [
          {
            type: 'flex',
            altText: '【レシート】',
            contents: container
          }
        ]
      });
    } catch ({ status, message }) {
      throw {
        message,
        status
      };
    }
  }
};
