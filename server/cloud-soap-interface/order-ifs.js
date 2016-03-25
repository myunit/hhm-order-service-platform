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

OrderIFS.prototype.getOrderDetail = function (obj, callback) {
  var Order = this.DS.models.Order;
  var xml = orderObj.getOrderDetailXML(obj);
  Order.OrderForDetail(xml, function (err, response) {
    try {
      callback(err, JSON.parse(response.OrderForDetailResult));
    } catch (e) {
      console.error('OrderIFS getOrderDetail Exception: ' + e);
      callback(err, {IsSuccess: false, ErrorDescription:'服务异常'});
    }
  });
};

OrderIFS.prototype.cancelOrder = function (obj, callback) {
  var Order = this.DS.models.Order;
  var xml = orderObj.cancelOrderXML(obj);
  Order.CancelOrder(xml, function (err, response) {
    try {
      callback(err, JSON.parse(response.CancelOrderResult));
    } catch (e) {
      console.error('OrderIFS cancelOrder Exception: ' + e);
      callback(err, {IsSuccess: false, ErrorDescription:'服务异常'});
    }
  });
};

OrderIFS.prototype.reBuyByOrderId = function (obj, callback) {
  var Order = this.DS.models.Order;
  var xml = orderObj.reBuyByOrderIdXML(obj);
  Order.ReBuyByOrderSysNo(xml, function (err, response) {
    try {
      callback(err, JSON.parse(response.ReBuyByOrderSysNoResult));
    } catch (e) {
      console.error('OrderIFS reBuyByOrderId Exception: ' + e);
      callback(err, {IsSuccess: false, ErrorDescription:'服务异常'});
    }
  });
};

OrderIFS.prototype.setOrderPaymentType = function (obj, callback) {
  var Order = this.DS.models.Order;
  var xml = orderObj.setOrderPaymentTypeXML(obj);
  Order.SetOrderPaymentType(xml, function (err, response) {
    try {
      callback(err, JSON.parse(response.SetOrderPaymentTypeResult));
    } catch (e) {
      console.error('OrderIFS setOrderPaymentType Exception: ' + e);
      callback(err, {IsSuccess: false, ErrorDescription:'服务异常'});
    }
  });
};

OrderIFS.prototype.auditOrder = function (obj, callback) {
  var Order = this.DS.models.Order;
  var xml = orderObj.auditOrderXML(obj);
  Order.AuditOrder(xml, function (err, response) {
    try {
      callback(err, JSON.parse(response.AuditOrderResult));
    } catch (e) {
      console.error('OrderIFS AuditOrder Exception: ' + e);
      callback(err, {IsSuccess: false, ErrorDescription:'服务异常'});
    }
  });
};
