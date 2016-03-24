/**
 * @author qianqing
 * @create by 16-3-24
 * @description
 */
var xml = require('xml');

exports.createPaymentXML = function (obj) {
  var xmlObj = [{
    CreatePayment: [
      {
        _attr: {
          xmlns: 'http://tempuri.org/'
        }
      },
      {
        uId: obj.userId
      },
      {
        buyer: obj.buyer
      },
      {
        orderId: obj.orderId
      },
      {
        seller: ''
      },
      {
        totalFee: obj.total
      },
      {
        tradeNo: obj.tradeId
      },
      {
        paymentType: obj.paymentType
      }
    ]
  }];

  return xml(xmlObj, true);
};
