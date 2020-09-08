module.exports = (app) => {
  const getLicitacaoById = (id) => {};

  const getLicitacoesPorLicitante = (idLicitante) => {};

  const getLicitacoes = (query) => {
    const licitacoes = app.data.licitacoes;
    // TODO: Validar os parâmetros
    // Retornar a consulta
    // Fazer consulta paginada
    const filtros = [
        'licitacao',
        'processoLicitorio',
        'modalidade', // validar
        'ano',
        'funcoes',
        'municipios',
        'comarca',
        'regional',
        'trilhas',
        'objeto',
        'fonteRecursos',
        'licitantes',
        'vencedores',
        'valorInicial',
        'valorFinal'
    ];
    const pagina = query.p || 1;
    const tamanhoPagina = query.tp || 20;
    return licitacoes;
  };

  const getSumarioLicitacoes = (query) => {
    // TODO: Validar os parâmetros (como em getLicitacoes)
    // Retornar a consulta
  };

  const getLicitantesPorLicitacao = (idLicitacao) => {};

  const getVencedoresLicitacao = (idLicitacao) => {
    // Tem que trazer CNPJ do vencedor e mais detalhes:
    // cursos alocados e itens alocados por vencedor.
    // Avaliar se faz tudo no mesmo método (pelo retorno ser alguns registros apenas)
    // ou se faz métodos separados.
  };

  const getLicitacoesComIrregularidadesParaLicitante = (
    idLicitante
  ) => {};

  const getLicitacoesPorComarcaParaLicitante = (idLicitante) => {

  };

  const getResumoLicitacaoPorLicitante = (idLicitante) => {
      //usado para mostrar a tooltip
  }

  return {
    getLicitacaoById,
    getLicitacoesPorLicitante,
    getLicitacoes,
    getSumarioLicitacoes,
    getLicitantesPorLicitacao,
    getVencedoresLicitacao,
    getLicitacoesComIrregularidadesParaLicitante,
    getLicitacoesPorComarcaParaLicitante,
  };
};
