module.exports = function (app) {
  app.route('/api/pedido')
    .post(() => {
      console.log('novo pedido')
    })
}