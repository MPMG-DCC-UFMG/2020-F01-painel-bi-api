module.exports = (app) => {
  const service = app.services.licitacao;
  const controller = {};

  controller.getLicitacoes = (req, res) => {
    const licitacoes = service.getLicitacoes(req.query);
    console.debug(licitacoes);
    return res.status(200).json(licitacoes);
  };

  return controller;
};
