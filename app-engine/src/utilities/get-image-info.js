module.exports = {
  getImageInfo: (contentType) => {
    switch (contentType) {
      case 'image/png':
        return {
          extension: '.png'
        };
      case 'image/jpeg':
        return {
          extension: '.jpg'
        };
      default:
        throw {
          message: '画像の形式は png, jpeg のいずれかにしてください',
          status: 400
        };
    }
  }
};
