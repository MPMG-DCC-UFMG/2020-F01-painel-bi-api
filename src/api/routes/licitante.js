module.exports = (app) => {
    const controller = app.controllers.licitante;
  
    app.route("/api/v1/licitante/:idLicitante").get(controller.getLicitanteById);
  };
  