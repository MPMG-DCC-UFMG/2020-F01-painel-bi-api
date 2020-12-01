module.exports = (app) => {
  const controller = app.controllers.totalizacaoLicitacoes;
  const teste = app.controllers.teste;

  app.route("/api/v1/totais/licitacao").get(controller.getTotalizacaoLicitacoes);

  app.route("/api/v1/teste").get(teste.getTeste);
};
