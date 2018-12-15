const moment = require('moment-timezone');
const EXPIRE_MINUTES = 1;

module.exports = {
  expiredCheck: (datetime) => {
    const expireTime = moment(datetime).add(EXPIRE_MINUTES, 'minutes');
    const nowTime = moment().tz('Asia/Tokyo');

    return expireTime.isBefore(nowTime);
  }
};
