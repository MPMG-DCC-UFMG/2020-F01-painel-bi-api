module.exports = (app) => {
  const controller = app.controllers.totalizacaoLicitacoes;

  app.route("/api/v1/totais/licitacoes").get(controller.getTotalizacaoLicitacoes);
};
