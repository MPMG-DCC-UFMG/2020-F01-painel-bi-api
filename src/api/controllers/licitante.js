module.exports = (app) => {

  const druid = app.services.druid;
  const controller = {};

  controller.getLicitanteById = async (req, res) => {

    const idLic = req.params.idLicitante;
    const licDataSource = "painel_bi_info_gerais_licitacoes";
    const bidderDataSource = "painel_bi_detalhamento_licitante";
    const licDetDataSource = "painel_bi_detalhamento_licitacao";
    const cnpjDataSource = "painel_bi_detalhamento_cnpj";
    
    let socios = [];

    let interval = await druid.timeBoundary(licDataSource);
    let intervalBidder = await druid.timeBoundary(bidderDataSource);
    let intervalLicDet = await druid.timeBoundary(licDetDataSource);
    let intervalCnpj = await druid.timeBoundary(cnpjDataSource);


    let infos = (await druid.scan(cnpjDataSource, intervalCnpj, {
      filter: {
        "type": "selector",
        "dimension": "num_documento",
        "value": idLic,
      }
    }))[0];

    let licitacoes = await druid.scan(licDetDataSource, intervalLicDet, {
      filter: {
        "type": "selector",
        "dimension": "num_documento",
        "value": idLic
      }
    });

    let filterLics = [];
    let filterLicsFinal;

    licitacoes.forEach(l=>{
      filterLics.push({
        "type": "selector",
        "dimension": "seq_dim_licitacao",
        "value": l.seq_dim_licitacao,
        "extractionFn": null
      });
    });

    if(filterLics.length>1){
      filterLicsFinal = {
        "type": "or",
        "fields": filterLics
      };
    } else {
      filterLicsFinal = filterLics;
    }

    let infoGerais = await druid.scan(licDataSource, interval, {
      filter: filterLicsFinal
    });

    licitacoes.forEach(l=>{
      geral = infoGerais.find(v=>v.seq_dim_licitacao ==l.seq_dim_licitacao );

      l.vlr_latitude = geral.vlr_latitude;
      l.vlr_longitude = geral.vlr_longitude;
      l.nom_entidade = geral.nom_entidade;
      l.ranking_irregularidades = geral.ranking_irregularidades;

    });

    if(licitacoes.length>0 && licitacoes[0].nome_socio) {
      var nomes = licitacoes[0].nome_socio.split(";");
      var cpf = licitacoes[0].cpf_cnpj_socio.split(";");

      for(i=0; i<nomes.length; i++){
          socios.push({
              nome: nomes[i].trim(),
              cpf_cnpj: cpf[i].trim()
          });
      }
  }

    return res.status(200).json({
      infos: infos,
      licitacoes: licitacoes,
      socios: socios,
    });

  };

  return controller;
};
