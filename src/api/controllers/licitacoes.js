module.exports = (app) => {
  const licitacoes = app.data.licitacoes;
  const controller = {};

  controller.listLicitacoes = (req, res) => res.status(200).json(licitacoes);

  return controller;
};
