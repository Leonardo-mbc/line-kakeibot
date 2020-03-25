const { postPicture } = require('../actions/post-picture');
const { getState, setState } = require('../actions/state-action');
const { makePayment } = require('../actions/make-payment');
const { setPaymentPartial } = require('../actions/set-payment-partial');
const { deletePayment } = require('../actions/delete-payment');
const { getGroups } = require('../actions/get-groups');
const { getReceipts } = require('../actions/get-receipts');
const { movePayment } = require('../actions/move-payment');
const { textReply } = require('../line-actions/text-reply');
const { getContent } = require('../line-actions/get-content');
const { lineReply } = require('../line-actions/line-reply');
const { quickReply } = require('../line-actions/quick-reply');
const { paymentDetailReply } = require('../line-actions/payment-detail-reply');
const { getImageInfo } = require('../utilities/get-image-info');
const { expiredCheck } = require('../utilities/expired-check');

const ENDPOINTS = require('../constants/endpoints');
const PHASE = require('../constants/phase');

module.exports = {
  lineWebhook: function(events) {
    events.map(async ({ type, message, postback, replyToken, source }) => {
      let isExpired, state, groups;
      const { userId } = source;

      try {
        switch (type) {
          case 'message':
            switch (message.type) {
              case 'image':
                groups = await getGroups(userId);
                if (0 < Object.keys(groups).length) {
                  state = (await getState(userId)) || { datetime: '', paymentId: '', phase: '' };
                  isExpired = expiredCheck(state.datetime);

                  if (state.phase === '' || isExpired) {
                    // フェーズなし || 期限切れ

                    try {
                      const [{ contentType, buffer }, { paymentId, datetime }] = await Promise.all([
                        getContent(message.id),
                        makePayment()
                      ]);

                      await setState(userId, {
                        paymentId,
                        datetime,
                        phase: PHASE.WAITING_PLACE
                      });

                      await textReply({
                        messages: ['おけ', '場所は？'],
                        replyToken
                      });

                      try {
                        const { extension } = getImageInfo(contentType);
                        const filename = `${paymentId}${extension}`;
                        const filepath = `receipts/${filename}`;

                        await Promise.all([
                          setPaymentPartial(paymentId, {
                            who: userId,
                            imageUrl: `${ENDPOINTS.STORAGE}/receipts/${filename}`
                          }),
                          postPicture({ buffer, contentType, filepath }),
                          isExpired
                            ? deletePayment({
                                paymentId: state.paymentId
                              })
                            : null
                        ]);
                      } catch (error) {
                        throw {
                          messages: error,
                          state: 500
                        };
                      }
                    } catch (error) {
                      throw {
                        messages: error,
                        state: 500
                      };
                    }
                  } else {
                    // 期限内の会計がある
                    try {
                      await textReply({
                        messages: ['入力中の買い物があります'],
                        replyToken
                      });
                    } catch ({ status, message }) {
                      throw {
                        messages,
                        status
                      };
                    }
                  }
                } else {
                  lineReply({
                    messages: [
                      {
                        type: 'flex',
                        altText: '家計簿がありません',
                        contents: {
                          type: 'bubble',
                          direction: 'ltr',
                          body: {
                            type: 'box',
                            layout: 'vertical',
                            contents: [
                              {
                                type: 'text',
                                text:
                                  '家計簿がありません！\nまずは設定から作成するか、誰かの家計簿に招待してもらいましょう',
                                color: '#000000',
                                wrap: true
                              }
                            ]
                          },
                          footer: {
                            type: 'box',
                            layout: 'horizontal',
                            contents: [
                              {
                                type: 'button',
                                action: {
                                  type: 'uri',
                                  label: '設定を開く',
                                  uri: 'https://liff.line.me/1629647443-Nq46aLqj'
                                },
                                color: '#00C239',
                                style: 'primary'
                              }
                            ]
                          }
                        }
                      }
                    ],
                    replyToken
                  });
                }
                break;

              case 'text':
                state = (await getState(userId)) || { datetime: '', paymentId: '', phase: '' };
                isExpired = expiredCheck(state.datetime);

                if (state.phase !== '') {
                  // 会計処理が進行中かチェック

                  if (!isExpired) {
                    // 期限内かチェック

                    const textValue = message.text; // 入力されたテキスト

                    switch (state.phase) {
                      case PHASE.WAITING_PLACE:
                        try {
                          await Promise.all([
                            setPaymentPartial(state.paymentId, {
                              place: textValue
                            }),
                            setState(userId, {
                              ...state,
                              phase: PHASE.WAITING_PRICE
                            }),
                            lineReply({
                              messages: [
                                {
                                  type: 'text',
                                  text: 'おけ'
                                },
                                {
                                  type: 'flex',
                                  altText: '金額は？',
                                  contents: {
                                    type: 'bubble',
                                    direction: 'ltr',
                                    body: {
                                      type: 'box',
                                      layout: 'vertical',
                                      contents: [
                                        {
                                          type: 'text',
                                          text: '金額は？',
                                          color: '#000000'
                                        }
                                      ]
                                    },
                                    footer: {
                                      type: 'box',
                                      layout: 'horizontal',
                                      contents: [
                                        {
                                          type: 'button',
                                          action: {
                                            type: 'uri',
                                            label: 'タップでも入力できます',
                                            uri: 'https://liff.line.me/1629647443-N651dkoD'
                                          },
                                          color: '#00c239',
                                          height: 'sm'
                                        }
                                      ]
                                    },
                                    styles: {
                                      footer: {
                                        separator: true
                                      }
                                    }
                                  }
                                }
                              ],
                              replyToken
                            })
                          ]);
                        } catch ({ status, message }) {
                          throw {
                            message,
                            status
                          };
                        }
                        break;

                      case PHASE.WAITING_PRICE:
                        try {
                          const numberPrice = parseInt(textValue);
                          if (isNaN(numberPrice)) {
                            await textReply({
                              messages: ['数字を入力してください'],
                              replyToken
                            });

                            throw {
                              message: '数字を入力してください',
                              status: 400
                            };
                          }

                          groups = await getGroups(userId);
                          groupReplies = Object.keys(groups).map((key) => {
                            return {
                              text: groups[key].name,
                              data: `groupId=${key}`
                            };
                          });

                          await Promise.all([
                            setPaymentPartial(state.paymentId, {
                              price: numberPrice
                            }),
                            setState(userId, {
                              ...state,
                              phase: PHASE.WAITING_GROUP
                            }),
                            quickReply({
                              replyToken,
                              messages: ['どこにつける？'],
                              replies: groupReplies
                            })
                          ]);
                        } catch ({ status, message }) {
                          throw {
                            message,
                            status
                          };
                        }
                        break;

                      default:
                      // あてはまる phase がない
                    }
                  } else {
                    // 時間切れ
                    try {
                      await Promise.all([
                        setState(userId, {
                          datetime: '',
                          paymentId: '',
                          phase: ''
                        }),
                        deletePayment({
                          paymentId: state.paymentId
                        }),
                        textReply({
                          messages: [
                            '時間切れになってしまいました。画像を送信するところからやり直してください'
                          ],
                          replyToken
                        })
                      ]);
                    } catch ({ status, message }) {
                      throw {
                        message,
                        status
                      };
                    }
                  }
                } else {
                  // ただの発言、無視
                }
                break;
            }
            break;

          case 'postback':
            state = (await getState(userId)) || { datetime: '', paymentId: '', phase: '' };
            isExpired = expiredCheck(state.datetime);

            if (state.phase !== '') {
              // 会計処理が進行中かチェック

              if (!isExpired) {
                // 期限内かチェック

                const { groupId } = parseSearch(postback.data);

                switch (state.phase) {
                  case PHASE.WAITING_GROUP:
                    try {
                      const payment = await movePayment({
                        groupId,
                        paymentId: state.paymentId,
                        datetime: state.datetime
                      });
                      const monthPayments = await getReceipts({ userId, datetime: state.datetime });

                      await Promise.all([
                        paymentDetailReply({
                          groupId,
                          payment,
                          monthPayments,
                          replyToken
                        }),
                        setState(userId, {
                          datetime: '',
                          paymentId: '',
                          phase: ''
                        })
                      ]);
                    } catch ({ status, message }) {
                      throw {
                        message,
                        status
                      };
                    }
                    break;
                }
              } else {
                // 時間切れ
                try {
                  await Promise.all([
                    setState(userId, {
                      datetime: '',
                      paymentId: '',
                      phase: ''
                    }),
                    deletePayment({
                      paymentId: state.paymentId
                    }),
                    textReply({
                      messages: [
                        '時間切れになってしまいました。画像を送信するところからやり直してください'
                      ],
                      replyToken
                    })
                  ]);
                } catch ({ status, message }) {
                  throw {
                    message,
                    status
                  };
                }
              }
            } else {
              // ただの発言、無視
            }
            break;
        }
      } catch (error) {
        console.error('####', error);

        try {
          await textReply({
            messages: [JSON.stringify(error)],
            replyToken
          });
        } catch (error) {
          console.error('%%%%', error);
        }
      }
    });
  }
};

function parseSearch(qs) {
  let query = {};
  qs.split(/[?&]/)
    .filter((v) => !!v)
    .map((v) => {
      const [key, value] = v.split('=');
      query = {
        ...query,
        [key]: value
      };
    });

  return query;
}
