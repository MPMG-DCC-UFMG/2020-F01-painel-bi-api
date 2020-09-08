module.exports = (app) => {
  const controller = app.controllers.totalizacaoLicitacoes;

  app.route("/api/v1/totais/licitacao").get(controller.getTotalizacaoLicitacoes);
};
