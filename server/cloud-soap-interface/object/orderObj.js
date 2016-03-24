/**
 * @author qianqing
 * @create by 16-3-4
 * @description
 */
var xml = require('xml');

exports.getOrderListXML = function (obj) {
  var xmlObj = [{
    SearchOrders: [
      {
        _attr: {
          xmlns: 'http://tempuri.org/'
        }
      },
      {
        customerSysNo: obj.userId
      },
      {
        currentPage: obj.pageId
      },
      {
        pageSize: obj.pageSize
      },
      {
        searchType: obj.type
      },
      {
        orderStatus: obj.orderStatus
      }
    ]
  }];

  return xml(xmlObj, true);
};

exports.getOrderDetailXML = function (obj) {
  var xmlObj = [{
    OrderForDetail: [
      {
        _attr: {
          xmlns: 'http://tempuri.org/'
        }
      },
      {
        uId: obj.userId
      },
      {
        orderId: obj.orderId
      }
    ]
  }];

  return xml(xmlObj, true);
};

exports.cancelOrderXML = function (obj) {
  var xmlObj = [{
    CancelOrder: [
      {
        _attr: {
          xmlns: 'http://tempuri.org/'
        }
      },
      {
        customerSysNo: obj.userId
      },
      {
        orderSysNo: obj.orderId
      }
    ]
  }];

  return xml(xmlObj, true);
};

exports.reBuyByOrderIdXML = function (obj) {
  var xmlObj = [{
    ReBuyByOrderSysNo: [
      {
        _attr: {
          xmlns: 'http://tempuri.org/'
        }
      },
      {
        customerSysNo: obj.userId
      },
      {
        orderId: obj.orderId
      }
    ]
  }];

  return xml(xmlObj, true);
};

exports.setOrderPaymentTypeXML = function (obj) {
  var xmlObj = [{
    SetOrderPaymentType: [
      {
        _attr: {
          xmlns: 'http://tempuri.org/'
        }
      },
      {
        customerSysNo: obj.userId
      },
      {
        orderSysNo: obj.orderId
      },
      {
        paymentType: obj.note
      }
    ]
  }];

  return xml(xmlObj, true);
};
