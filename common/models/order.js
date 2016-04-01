/**
 * @author qianqing
 * @create by 16-3-3
 * @description
 */
var loopback = require('loopback');
var async = require('async');
var OrderIFS = require('../../server/cloud-soap-interface/order-ifs');
var ShoppingIFS = require('../../server/cloud-soap-interface/shopping-ifs');

module.exports = function (Order) {
  Order.getApp(function (err, app) {

    var orderIFS = new OrderIFS(app);
    var shoppingIFS = new ShoppingIFS(app);

    //获取订单列表
    Order.getOrderList = function (data, cb) {
      orderIFS.getOrderList(data, function (err, res) {
        if (err) {
          console.log('getOrderList err: ' + err);
          cb(null, {status: 0, msg: '操作异常'});
          return;
        }

        if (!res.IsSuccess) {
          console.error('getOrderList result err: ' + res.ErrorInfo);
          cb(null, {status: 0, msg: res.ErrorInfo});
        } else {
          var order = JSON.parse(res.ResultStr);
          cb(null, {status: 1, count: order.Counts, order: order.Datas, msg: ''});
        }
      });
    };

    Order.remoteMethod(
      'getOrderList',
      {
        description: [
          '获取订单列表.返回结果-status:操作结果 0 失败 1 成功, count:总数, order:订单信息, msg:附带信息'
        ],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '获取订单列表 {"userId":int, "pageId":int, "pageSize":int, "type":int, "orderStatus":int}',
              'type:时间分类(0一个月以内, 1一个月以前), orderStatus:订单状态(0全部,1历史,2待审核,3待发货,4缺货,5已发货,6取消,',
              '7取消失败,8已审核,9部分发货,99已付款，100未付款,101部分付款)'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/get-order-list', verb: 'post'}
      }
    );

    //获取订单详情
    Order.getOrderDetail = function (data, cb) {
      orderIFS.getOrderDetail(data, function (err, res) {
        if (err) {
          console.log('getOrderDetail err: ' + err);
          cb(null, {status: 0, msg: '操作异常'});
          return;
        }

        if (!res.IsSuccess) {
          console.error('getOrderDetail result err: ' + res.ErrorDescription);
          cb(null, {status: 0, msg: res.ErrorDescription});
        } else {
          delete res.IsSuccess;
          delete res.ErrorDescription;
          if (res.PayMent !== '货到付款') {
            res.PayMent = '在线付款';
          }
          cb(null, {status: 1, order: res, msg: ''});
        }
      });
    };

    Order.remoteMethod(
      'getOrderDetail',
      {
        description: [
          '获取订单详情.返回结果-status:操作结果 0 失败 1 成功, order:订单信息, msg:附带信息'
        ],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '获取订单详情 {"userId":int, "orderId":int}'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/get-order-detail', verb: 'post'}
      }
    );

    //取消订单
    Order.cancelOrder = function (data, cb) {
      orderIFS.cancelOrder(data, function (err, res) {
        if (err) {
          console.log('cancelOrder err: ' + err);
          cb(null, {status: 0, msg: '操作异常'});
          return;
        }

        if (!res.IsSuccess) {
          console.error('cancelOrder result err: ' + res.ErrorInfo);
          cb(null, {status: 0, msg: res.ErrorInfo});
        } else {
          if (res.ResultStr === 'True') {
            cb(null, {status: 1, msg: '取消成功'});
          } else {
            cb(null, {status: 0, msg: '取消失败'});
          }
        }
      });
    };

    Order.remoteMethod(
      'cancelOrder',
      {
        description: [
          '取消订单.返回结果-status:操作结果 0 失败 1 成功, msg:附带信息'
        ],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '取消订单 {"userId":int, "orderId":int}'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/cancel-order', verb: 'post'}
      }
    );

    //根据订单号再次购买
    Order.reBuyByOrderId = function (data, cb) {
      orderIFS.reBuyByOrderId(data, function (err, res) {
        if (err) {
          console.log('reBuyByOrderId err: ' + err);
          cb(null, {status: 0, msg: '操作异常'});
          return;
        }

        if (!res.IsSuccess) {
          console.error('reBuyByOrderId result err: ' + res.ErrorInfo);
          cb(null, {status: 0, msg: res.ErrorInfo});
        } else {
          cb(null, {status: 1, msg: '购买成功'});
        }
      });
    };

    Order.remoteMethod(
      'reBuyByOrderId',
      {
        description: [
          '根据订单号再次购买.返回结果-status:操作结果 0 失败 1 成功, msg:附带信息'
        ],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '根据订单号再次购买 {"userId":int, "orderId":int}'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/rebuy-by-orderId', verb: 'post'}
      }
    );

    //创建支付记录
    Order.createPaymentRecord = function (data, callback) {
      async.waterfall(
        [
          function (cb) {
            shoppingIFS.createPayment(data, function (err, res) {
              if (err) {
                console.log('createPayment err: ' + err);
                cb({status: 0, msg: '操作异常'});
                return;
              }

              if (!res.IsSuccess) {
                console.error('createPayment result err: ' + res.ErrorDescription);
                cb({status: 0, msg: '创建支付记录失败'});
              } else {
                cb(null,{status: 1, msg: ''});
              }
            });
          },
          function (status, cb) {
            orderIFS.setOrderPaymentType(data, function (err, res) {
              if (err) {
                console.log('setOrderPaymentType err: ' + err);
                cb({status: 0, msg: '操作异常'});
                return;
              }

              if (!res) {
                cb({status: 0, msg: '设置订单状态失败'});
              } else {
                cb(null, {status: 1, msg: ''});
              }
            });
          },
          function (status, cb) {
            if (data.note !== '货到付款') {
              orderIFS.auditOrder(data, function (err, res) {
                if (err) {
                  console.log('auditOrder err: ' + err);
                  cb({status: 0, msg: '操作异常'});
                  return;
                }

                if (!res) {
                  cb({status: 0, msg: '审核订单状态'});
                } else {
                  cb(null, {status: 1, msg: ''});
                }
              });
            } else {
              cb(null, {status: 1, msg: ''});
            }
          }
        ],
        function (err, msg) {
          if (err) {
            callback(null, err);
          } else {
            callback(null, msg);
          }
        }
      );

    };

    Order.remoteMethod(
      'createPaymentRecord',
      {
        description: [
          '创建支付记录.返回结果-status:操作结果 0 失败 1 成功, msg:附带信息'
        ],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '设置订单支付状态 {"userId":int, "orderId":int, "note":"string", "buyer":"string", "seller":"string"',
              ' "total":double, "tradeId":"string", "type":int}',
              'note:支付描述(13微信支付or1支付宝支付), buyer:购买者昵称, total:金额, trade:订单流水号, type:支付类型(微信13,支付宝14)'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/create-payment-record', verb: 'post'}
      }
    );

    //设置订单支付状态(只在货到付款时使用)
    Order.setOrderPaymentType = function (data, cb) {
      orderIFS.setOrderPaymentType(data, function (err, res) {
        if (err) {
          console.log('setOrderPaymentType err: ' + err);
          cb(null, {status: 0, msg: '操作异常'});
          return;
        }

        if (!res) {
          cb(null, {status: 0, msg: '设置订单状态失败'});
        } else {
          cb(null, {status: 1, msg: ''});
        }
      });
    };

    Order.remoteMethod(
      'setOrderPaymentType',
      {
        description: [
          '设置订单支付状态(只在货到付款时使用).返回结果-status:操作结果 0 失败 1 成功, msg:附带信息'
        ],
        accepts: [
          {
            arg: 'data', type: 'object', required: true, http: {source: 'body'},
            description: [
              '设置订单支付状态 {"userId":int, "orderId":int, "note":"string"}',
              'note:货到付款'
            ]
          }
        ],
        returns: {arg: 'repData', type: 'string'},
        http: {path: '/set-order-payment', verb: 'post'}
      }
    );

  });
};
