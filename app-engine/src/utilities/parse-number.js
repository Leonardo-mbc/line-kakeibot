module.exports = {
  parseNumber: (number) => {
    return parseInt(
      number
        .replace(/[,，]/, '')
        .replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0))
    );
  },
};
