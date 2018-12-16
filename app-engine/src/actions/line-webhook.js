const { postPicture } = require('../actions/post-picture');
const { getState, setState } = require('../actions/state-action');
const { makePayment } = require('../actions/make-payment');
const { setPaymentPartial } = require('../actions/set-payment-partial');
const { deletePayment } = require('../actions/delete-payment');
const { getGruops } = require('../actions/get-groups');
const { getPayment } = require('../actions/get-payment');
const { getReceipts } = require('../actions/get-receipts');
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
    events.map(async ({ type, message, replyToken, source }) => {
      let isExpired, state, groups;
      try {
        if (type === 'message') {
          const { userId } = source;

          switch (message.type) {
            case 'image':
              state = await getState();
              isExpired = expiredCheck(state.datetime);

              if (state.phase === '' || isExpired) {
                // フェーズなし || 期限切れ

                try {
                  const [{ contentType, buffer }, { paymentId, datetime }] = await Promise.all([getContent(message.id), makePayment()]);

                  await setState({
                    paymentId,
                    datetime,
                    lineId: userId,
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
                      setPaymentPartial(paymentId, datetime, {
                        who: userId,
                        imageUrl: `${ENDPOINTS.STORAGE}/receipts/${filename}`
                      }),
                      postPicture({ buffer, contentType, filepath }),
                      isExpired
                        ? deletePayment({
                            paymentId: state.paymentId,
                            datetime: state.datetime
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
                    messages: ['ちょっとまってね'],
                    replyToken
                  });
                } catch ({ status, message }) {
                  throw {
                    messages,
                    status
                  };
                }
              }
              break;

            case 'text':
              state = (await getState(userId)) || { datetime: '', lineId: '', paymentId: '', phase: '' };
              isExpired = expiredCheck(state.datetime);

              if (state.phase !== '') {
                // 会計処理が進行中かチェック

                if (!isExpired) {
                  // 期限内かチェック
                  if (state.lineId === userId) {
                    // 対応中の人かチェック

                    const textValue = message.text; // 入力されたテキスト

                    switch (state.phase) {
                      case PHASE.WAITING_PLACE:
                        try {
                          await Promise.all([
                            setPaymentPartial(state.paymentId, state.datetime, {
                              place: textValue
                            }),
                            setState({
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
                                          text: '金額は？'
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
                                            label: 'タップで入力',
                                            uri: 'line://app/1525303758-Em6xedAA'
                                          },
                                          color: '#00B900',
                                          height: 'sm'
                                        }
                                      ]
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
                            throw {
                              message: '数字を入力してください',
                              status: 400
                            };
                          }

                          groups = await getGruops();

                          await Promise.all([
                            setPaymentPartial(state.paymentId, state.datetime, {
                              price: numberPrice
                            }),
                            setState({
                              ...state,
                              phase: PHASE.WAITING_GROUP
                            }),
                            quickReply({
                              replyToken,
                              messages: ['どこにつける？'],
                              replies: groups
                            })
                          ]);
                        } catch ({ status, message }) {
                          throw {
                            message,
                            status
                          };
                        }
                        break;

                      case PHASE.WAITING_GROUP:
                        try {
                          groups = await getGruops();
                          if (0 <= groups.indexOf(textValue)) {
                            await setPaymentPartial(state.paymentId, state.datetime, {
                              group: textValue
                            });

                            const [payment, receipts] = await Promise.all([
                              getPayment({
                                paymentId: state.paymentId,
                                datetime: state.datetime
                              }),
                              getReceipts(state.datetime)
                            ]);

                            await Promise.all([
                              paymentDetailReply({
                                payment,
                                monthPayments: receipts,
                                replyToken
                              }),
                              setState({
                                datetime: '',
                                lineId: '',
                                paymentId: '',
                                phase: ''
                              })
                            ]);
                          } else {
                            await quickReply({
                              messages: ['そんなグループないです', 'どこにつける？'],
                              replies: groups,
                              replyToken
                            });
                          }
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
                    // 関係ない人の発言、無視
                  }
                } else {
                  // 時間切れ
                  try {
                    await Promise.all([
                      setState({
                        datetime: '',
                        lineId: '',
                        paymentId: '',
                        phase: ''
                      }),
                      deletePayment({
                        paymentId: state.paymentId,
                        datetime: state.datetime
                      }),
                      textReply({
                        messages: ['時間切れになってしまいました。最初からやり直してください'],
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
