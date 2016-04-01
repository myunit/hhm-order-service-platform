/**
 * @author qianqing
 * @create by 16-3-24
 * @description
 */
var xml = require('xml');

exports.createPaymentXML = function (obj) {
  console.log(JSON.stringify(obj));
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
        tradeNO: obj.tradeId
      },
      {
        paymentType: obj.type
      }
    ]
  }];

  return xml(xmlObj, true);
};
