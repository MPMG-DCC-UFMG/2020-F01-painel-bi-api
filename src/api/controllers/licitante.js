module.exports = (app) => {
    const service = app.services.licitante;
    const controller = {};
  
    controller.getLicitanteById = (req, res) => {
      return res.status(200).json(
          service.getLicitanteById(req.params.idLicitante));
    };
  
    return controller;
  };
  