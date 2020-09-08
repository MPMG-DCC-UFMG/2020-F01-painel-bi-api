module.exports = (app) => {
  const controller = app.controllers.licitacoes;

  /**
   * @swagger
   * /tasks:
   *  get:
   *    description: Use to request all customers
   *    responses:
   *      '200':
   *        description: A successful response
   */
  app.route("/api/v1/licitacoes").get(controller.listLicitacoes);
};
