module.exports = (app) => {
    const licitantes = app.data.amostra_cnpj;
    const licitante_detalhe = app.data.amostra_detalhamento_licitacao;
    const licitacoes = app.data.amostra_info_gerais;

    const getLicitanteById = (id) => {

        var lics = licitante_detalhe.filter(v=>v.num_documento==id);
        var socios = [];

        lics.forEach(l=>{
            geral = licitacoes.find(v=>v.seq_dim_licitacao ==l.seq_dim_licitacao );

            l.vlr_latitude = geral.vlr_latitude;
            l.vlr_longitude = geral.vlr_longitude;
            l.nom_entidade = geral.nom_entidade;
            l.ranking_irregularidades = geral.ranking_irregularidades;

        });

        if(lics.length>0) {
            var nomes = lics[0].nome_socio.split(";");
            var cpf = lics[0].cpf_cnpj_socio.split(";");

            for(i=0; i<nomes.length; i++){
                socios.push({
                    nome: nomes[i].trim(),
                    cpf_cnpj: cpf[i].trim()
                });
            }
        }

        return {
            infos: licitantes.find(v=>v.num_documento==id),
            socios: socios,
            licitacoes: lics
        };
    };

    return {getLicitanteById};
}