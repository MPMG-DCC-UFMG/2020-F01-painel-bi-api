module.exports = (app) => {
    const licitantes = app.data.amostra_cnpj;
    const licitante_detalhe = app.data.amostra_detalhamento_licitacao;
    const licitacoes = app.data.amostra_info_gerais;

    const getLicitanteById = (id) => {

        var lics = licitante_detalhe.filter(v=>v.num_documento==id);

        lics.forEach(l=>{
            geral = licitacoes.find(v=>v.seq_dim_licitacao ==l.seq_dim_licitacao );

            l.vlr_latitude = geral.vlr_latitude;
            l.vlr_longitude = geral.vlr_longitude;
            l.nom_entidade = geral.nom_entidade;
            l.ranking_irregularidades = geral.ranking_irregularidades;

        });

        return {
            infos: licitantes.find(v=>v.num_documento==id),
            licitacoes: lics
        };
    };

    return {getLicitanteById};
}