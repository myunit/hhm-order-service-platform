/**
 * @author qianqing
 * @create by 16-3-1
 * @description
 */
module.exports = function (app) {
  app.datasources.OrderSoap.once('connected', function () {
    console.log('Order interface is connected');
    app.datasources.OrderSoap.createModel('Order', {});
  });
};
