module.exports = (app) => {
  const getLicitacaoById = async (id) => {};

  const getLicitacoesPorLicitante = async (idLicitante) => {};

  const getLicitacoes = async (query) => {
    // TODO: Validar os parâmetros
    // Retornar a consulta
    // Fazer consulta paginada
    const pagina = query.p || 1;
    const tamanhoPagina = query.tp || 20;
  };

  const getSumarioLicitacoes = async (query) => {
    // TODO: Validar os parâmetros (como em getLicitacoes)
    // Retornar a consulta
  };

  const getLicitantesPorLicitacao = async (idLicitacao) => {};

  const getVencedoresLicitacao = async (idLicitacao) => {
    // Tem que trazer CNPJ do vencedor e mais detalhes:
    // cursos alocados e itens alocados por vencedor.
    // Avaliar se faz tudo no mesmo método (pelo retorno ser alguns registros apenas)
    // ou se faz métodos separados.
  };

  const getLicitacoesComIrregularidadesParaLicitante = async (
    idLicitante
  ) => {};

  const getLicitacoesPorComarcaParaLicitante = async (idLicitante) => {

  };

  const getResumoLicitacaoPorLicitante = async (idLicitante){
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
