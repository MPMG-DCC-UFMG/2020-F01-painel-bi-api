module.exports = (app) => {
  const getLicitacaoById = (id) => {};

  const getLicitacoesPorLicitante = (idLicitante) => {};

  const getLicitacoes = (query) => {
    let licitacoes = app.data.amostra_info_gerais;
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
    const pagina = query.p-1 || 0;
    const tamanhoPagina = query.tp || 20;

    if(query.municipio) {
      licitacoes = licitacoes.filter(v=>v.nom_entidade==query.municipio);
    }

    return licitacoes.slice(pagina*tamanhoPagina, pagina*tamanhoPagina+tamanhoPagina);
  };


  const getLicitacao = (req) => {
    const licitacao = app.data.amostra_info_gerais;
    const licitante = app.data.amostra_detalhamento_licitante;
    const cnpj = app.data.amostra_cnpj;
    const licitante_detalhe = app.data.amostra_detalhamento_licitacao;

    var licitantes = licitante.filter(v=>v.seq_dim_licitacao==req.params.idLicitacao);

    for(i=0; i<licitantes.length; i++){
      licitantes[i].detalhes = licitante_detalhe.filter(v=> v.num_documento==licitantes[i].num_documento && v.seq_dim_licitacao==req.params.idLicitacao );
      licitantes[i].cnpj = cnpj.find(v=> v.num_documento==licitantes[i].num_documento );
    }

    return {
      licitacao: licitacao.find(v=>v.seq_dim_licitacao==req.params.idLicitacao),
      licitantes: licitantes
    };
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
    getLicitacao,
    getSumarioLicitacoes,
    getLicitantesPorLicitacao,
    getVencedoresLicitacao,
    getLicitacoesComIrregularidadesParaLicitante,
    getLicitacoesPorComarcaParaLicitante,
  };
};
