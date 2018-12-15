const { lineReply } = require('./line-reply');

module.exports = {
  paymentDetailReply: async ({ payment, monthPayments, replyToken }) => {
    try {
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
                      type: 'icon',
                      url: 'https://scdn.line-apps.com/n/channel_devcenter/img/fx/restaurant_regular_32.png'
                    },
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
                  text: '今月の累計（あなた）',
                  wrap: true,
                  color: '#aaaaaa',
                  size: 'xxs'
                },
                {
                  type: 'text',
                  text: `${monthPayments
                    .filter((mPayment) => {
                      return mPayment.who === payment.who;
                    })
                    .reduce((pre, cur) => {
                      return parseInt(`${pre}`) + parseInt(`${cur.price}`);
                    }, 0)
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
                  text: `今月の累計（${payment.group}）`,
                  wrap: true,
                  color: '#aaaaaa',
                  size: 'xxs'
                },
                {
                  type: 'text',
                  text: `${monthPayments
                    .filter((mPayment) => {
                      return mPayment.group === payment.group;
                    })
                    .reduce((pre, cur) => {
                      return parseInt(`${pre}`) + parseInt(`${cur.price}`);
                    }, 0)
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
              type: 'spacer',
              size: 'xxl'
            },
            {
              type: 'button',
              style: 'secondary',
              action: {
                type: 'uri',
                label: '家計簿を見る',
                uri: 'line://app/1525303758-MxkqXypp'
              }
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
