var coffee = require('coffee-script');

module.exports = {
  process: function(src, path) {
    var stage = process.env.BABEL_JEST_STAGE || 2;

    if (coffee.helpers.isCoffee(path)) {
        return coffee.compile(src, {'bare': true});
    }
    return src;
  }
};