module.exports = (app) => {
  const service = app.services.licitacao;
  const druid = app.services.druid;

  const controller = {};

  controller.getFilters = async (req, res) => {

    let dataSource = "painel_bi_info_gerais_licitacoes";
    let interval = await druid.timeBoundary(dataSource);

    return res.status(200).json({
      municipios: await druid.topN("nom_entidade", dataSource, interval),
      mesorregiao: await druid.topN("nom_meso_regiao", dataSource, interval),
      microrregiao: await druid.topN("nom_micro_regiao", dataSource, interval),
      modalidades: await druid.topN("nom_modalidade", dataSource, interval),
      comarca: await druid.topN("nom_comarca", dataSource, interval),
      ano: await druid.timeSeries(dataSource, interval, {
        aggregations: [{
          "type": "floatMin",
          "fieldName": "num_exercicio_licitacao",
          "name": "min"
        },
        {
          "type": "floatMax",
          "fieldName": "num_exercicio_licitacao",
          "name": "max"
        }]
      }),
      valor: await druid.timeSeries(dataSource, interval, {
        aggregations: [{
          "type": "floatMin",
          "fieldName": "vlr_licitacao",
          "name": "min"
        },
        {
          "type": "floatMax",
          "fieldName": "vlr_licitacao",
          "name": "max"
        }]
      }),
    });

  }

  controller.getLicitacoes = async (req, res) => {

    let per_page = parseInt(req.query.per_page) || 25;
    let page = parseInt(req.query.page) || 1;

    let dataSource = "painel_bi_info_gerais_licitacoes";
    let interval = await druid.timeBoundary(dataSource);

    let count = (await druid.timeSeries(dataSource, interval, {
      aggregations: [{
        "type": "count",
        "name": "count"
      }]
    }));

    let heatmapMax = (await druid.timeSeries(dataSource, interval, {
      aggregations: [
        { "type": "count", "name": "count" },
        { "type": "floatMax", "fieldName": "ranking_irregularidades", "name": "ranking_irregularidades" },
        { "type": "floatMax", "fieldName": "qtde_de_cnpjs_envolvidos_emails", "name": "qtde_de_cnpjs_envolvidos_emails" },
        { "type": "floatMax", "fieldName": "qtd_lograd_nro_compl_comum", "name": "qtd_lograd_nro_compl_comum" },
        { "type": "floatMax", "fieldName": "qtd_lograd_nro_comum", "name": "qtd_lograd_nro_comum" },
        { "type": "floatMax", "fieldName": "qtde_licitantes_nao_ativos", "name": "qtde_licitantes_nao_ativos" },
        { "type": "floatMax", "fieldName": "qtde_licitantes_nao_ativos_vencedores", "name": "qtde_licitantes_nao_ativos_vencedores" },
        { "type": "floatMax", "fieldName": "flag_lict_unic_com_venc", "name": "flag_lict_unic_com_venc" },
        { "type": "floatMax", "fieldName": "flag_socios_comum", "name": "flag_socios_comum" },
        { "type": "floatMax", "fieldName": "qtde_de_cnpjs_envolvidos_tels", "name": "qtde_de_cnpjs_envolvidos_tels" },
      ]
    }));

    let irregularities = (await druid.timeSeries(dataSource, interval, {
      aggregations: [
        { "type": "count", "name": "ranking_irregularidades"},
        { "type": "longSum", "fieldName": "ranking_irregularidades", "name": "sum_ranking_irregularidades"}
      ],
      filter: {
        "type": "bound",
        "dimension": "ranking_irregularidades",
        "lower": "0",
        "upper": null,
        "lowerStrict": true,
        "upperStrict": false,
        "extractionFn": null,
        "ordering": {
          "type": "numeric"
        }
      }
    }));

    //return res.status(200).json();


    var r = await druid.groupBy(dataSource, interval, {
      "dimensions": [
        // "cod_meso_regiao", 
        // "cod_micro_regiao", 
        "cod_modalidade", 
        // "dat_abertura", 
        // "dat_edital_convite", 
        // "dat_publicacao_edital_do", 
        // "dat_publicacao_edital_veiculo_1", 
        // "dat_publicacao_edital_veiculo_2", 
        // "dat_recebimento_doc", 
        // "dsc_objeto", 
        // "dsc_objeto_busca", 
        // "flag_existe_email_em_comum", 
        // "flag_existe_licitante_nao_ativo", 
        // "flag_existe_tel_em_comum", 
        "flag_lict_unic_com_venc", 
        // "flag_lict_unic_sem_venc", 
        // "flag_lograd_comum",
        // "flag_lograd_nro_compl_comum",
        // "flag_lograd_nro_comum",
        // "flag_possui_irregularidade",
        "flag_socios_comum",
        // "funcoes",
        // "ind_esfera",
        // "metadata_data_execucao_merge",
        // "metadata_trilhas_versao",
        // "nom_comarca",
        // "nom_entidade",
        // "nom_fonte_recurso",
        // "nom_meso_regiao",
        "nom_micro_regiao",
        "nom_modalidade",
        // "nom_reg_patrimonio_publico",
        // "num_exercicio",
        "num_exercicio_licitacao",
        // "num_modalidade", 
        // "num_processo_licitatorio", 
        // "qtd_cnpjs_envolvidos_socios_comum", 
        // "qtd_lograd_comum", 
        "qtd_lograd_nro_compl_comum", 
        "qtd_lograd_nro_comum", 
        // "qtd_lograd_sem_compl", 
        // "qtd_lograd_sem_nro", 
        // "qtd_lograd_sem_nro_e_compl", 
        // "qtd_populacao_total", 
        // "qtd_socios_comum", 
        "qtde_de_cnpjs_envolvidos_emails", 
        "qtde_de_cnpjs_envolvidos_tels", 
        // "qtde_emails_que_repetem", 
        "qtde_licitantes_nao_ativos", 
        "qtde_licitantes_nao_ativos_vencedores", 
        // "qtde_tels_que_repetem", 
        "ranking_irregularidades", 
        // "seq_dim_entidade", 
        "seq_dim_licitacao", 
        // "somatorio_de_emails_repetidos", 
        // "somatorio_de_tels_repetidos", 
        // "vlr_latitude", 
        "vlr_licitacao", 
        // "vlr_longitude"
      ],
      limitSpec: { 
        "type": "default", 
        "limit": per_page, 
        "offset": (page-1)*per_page, //OFFSET não funciona na versão atual do Druid
        "columns": [{
            "dimension": "ranking_irregularidades",
            "direction": "descending"
        }]
      }
    });

    return res.status(200).json({
      current_page: page,
      last_page: Math.ceil(count/per_page),
      total: Object.assign(irregularities, count),
      heatmap_numbers: heatmapMax,
      data: r
    });
  };

  controller.getLicitacao = async (req, res) => {

    let idLic = req.params.idLicitacao;
    const licDataSource = "painel_bi_info_gerais_licitacoes";
    const bidderDataSource = "painel_bi_detalhamento_licitante";
    const licDetDataSource = "painel_bi_detalhamento_licitacao";
    const cnpjDataSource = "painel_bi_detalhamento_cnpj";

    let interval = await druid.timeBoundary(licDataSource);
    let intervalBidder = await druid.timeBoundary(bidderDataSource);
    let intervalLicDet = await druid.timeBoundary(licDetDataSource);
    let intervalCnpj = await druid.timeBoundary(cnpjDataSource);
    
    let licitacao = (await druid.scan(licDataSource, interval, {
      filter: {
        "type": "selector",
        "dimension": "seq_dim_licitacao",
        "value": idLic
      }
    }))[0];

    let licitantes = await druid.scan(bidderDataSource, intervalBidder, {
      filter: {
        "type": "selector",
        "dimension": "seq_dim_licitacao",
        "value": idLic
      }
    });

    for(i=0; i<licitantes.length; i++){
      licitantes[i].detalhes = (await druid.scan(licDetDataSource, intervalLicDet, {
        filter:  {
          "type": "and",
          "fields": [
            {
              "type": "selector",
              "dimension": "num_documento",
              "value": licitantes[i].num_documento,
              "extractionFn": null
            },
            {
              "type": "selector",
              "dimension": "seq_dim_licitacao",
              "value": idLic,
              "extractionFn": null
            }
          ]
        }
      }));
      licitantes[i].cnpj = (await druid.scan(cnpjDataSource, intervalCnpj, {
        filter: {
          "type": "selector",
          "dimension": "num_documento",
          "value": licitantes[i].num_documento,
        }
      }))[0];
    }

    return res.status(200).json({
      licitacao: licitacao,
      licitantes: licitantes
    });
  };

  return controller;
};
