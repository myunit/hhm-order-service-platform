/**
 * @author qianqing
 * @create by 16-3-3
 * @description
 */
var loopback = require('loopback');
var OrderIFS = require('../../server/cloud-soap-interface/order-ifs');

module.exports = function (Order) {
  Order.getApp(function (err, app) {

    var orderIFS = new OrderIFS(app);

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
              'type:时间分类(0一个月以前, 1一个月以内), orderStatus:订单状态(0全部,1历史,2待审核,3待发货,4缺货,5已发货,6取消,',
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

  });
};
