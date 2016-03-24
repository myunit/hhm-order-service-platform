/**
 * @author qianqing
 * @create by 16-3-24
 * @description
 */
var util = require('util');
var shoppingObj = require('./object/shoppingObj');

var ShoppingIFS = function (app) {
  this.DS = app.datasources.ShoppingSoap;
  Object.call(this);
};
util.inherits(ShoppingIFS, Object);
exports = module.exports = ShoppingIFS;

ShoppingIFS.prototype.createPayment = function (obj, callback) {
  var Shopping = this.DS.models.Shopping;
  var xml = shoppingObj.createPaymentXML(obj);
  Shopping.CreatePayment(xml, function (err, response) {
    try {
      callback(err, JSON.parse(response.CreatePaymentResult));
    } catch (e) {
      console.error('ShoppingIFS createPayment Exception: ' + e);
      callback(err, {IsSuccess: false, ErrorDescription:'服务异常'});
    }
  });
};
