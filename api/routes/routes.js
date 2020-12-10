module.exports = (app) => {

    const licitacao = app.controllers.licitacao;
    const licitante = app.controllers.licitante;
    const busca = app.controllers.busca;

    app.route("/api/v1/filters").get(licitacao.getFilters);
    app.route("/api/v1/search").get(busca.buscar);
    app.route("/api/v1/licitacao/:idLicitacao").get(licitacao.getLicitacao);
    app.route("/api/v1/licitacao").post(licitacao.getLicitacoes);
    app.route("/api/v1/licitante/:idLicitante").get(licitante.getLicitanteById);

  };
  