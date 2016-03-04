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
