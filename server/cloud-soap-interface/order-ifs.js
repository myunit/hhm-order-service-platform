/**
 * @author qianqing
 * @create by 16-3-4
 * @description
 */
var util = require('util');
var orderObj = require('./object/orderObj');

var OrderIFS = function (app) {
  this.DS = app.datasources.OrderSoap;
  Object.call(this);
};
util.inherits(OrderIFS, Object);
exports = module.exports = OrderIFS;

OrderIFS.prototype.getOrderList = function (obj, callback) {
  var Order = this.DS.models.Order;
  var xml = orderObj.getOrderListXML(obj);
  Order.SearchOrders(xml, function (err, response) {
    try {
      callback(err, JSON.parse(response.SearchOrdersResult));
    } catch (e) {
      console.error('OrderIFS getOrderList Exception: ' + e);
      callback(err, {IsSuccess: false, ErrorDescription:'服务异常'});
    }
  });
};
