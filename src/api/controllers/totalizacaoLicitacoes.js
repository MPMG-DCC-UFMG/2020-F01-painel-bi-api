module.exports = (app) => {
    const licitacoes = app.data.totalizacaoLicitacoes;
    const controller = {};
  
    controller.getTotalizacaoLicitacoes = (req, res) => {
        console.debug(req.query);
        res.status(200).json(licitacoes)
    };
    
    return controller;
  };
  