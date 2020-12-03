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

  const addFilter = (currentFilter, data, field, dimension)=>{
    if(data[field] && data[field].length){
      currentFilter.push({
        "type": "in",
        "dimension": dimension,
        "values": data[field]
      });
    }

    return currentFilter;
  }

  const addFilterInterval = (currentFilter, data, field, dimension)=>{
    if(data[field] && data[field][0]!=null && data[field][1]!=null){
      currentFilter.push({
        "type": "bound",
        "dimension": dimension,
        "lower": data[field][0],
        "upper": data[field][1],
        "lowerStrict": false,
        "upperStrict": false,
        "ordering": {
          "type": "numeric"
        }
      });
    }

    return currentFilter;
  }

  controller.getLicitacoes = async (req, res) => {

    let per_page = parseInt(req.body.per_page) || 25;
    let page = parseInt(req.body.page) || 1;

    let filters = [];


    filters = addFilter(filters, req.body, "municipios", "nom_entidade");
    filters = addFilter(filters, req.body, "microrregiao", "nom_micro_regiao");
    filters = addFilter(filters, req.body, "mesorregiao", "nom_meso_regiao");
    filters = addFilter(filters, req.body, "comarca", "nom_comarca");
    filters = addFilter(filters, req.body, "modalidades", "nom_modalidade");

    filters = addFilterInterval(filters, req.body, "ano", "num_exercicio");
    filters = addFilterInterval(filters, req.body, "valor", "vlr_licitacao");
        
    switch(filters.length){
      case 0:
        filters = null;
        break;
      case 1:
        filters = filters[0];
        break;
      default:
        filters = {
          type: "and",
          fields: filters
        };
        break;
    }
        
    let dataSource = "painel_bi_info_gerais_licitacoes";
    let interval = await druid.timeBoundary(dataSource);
    
    let count = await druid.timeSeries(dataSource, interval, {
      aggregations: [{
        "type": "count",
        "name": "count"
      }],
      filter: filters
    }).catch((err)=>{
      res.status(400).json(err);
    });

    let heatmapMax = await druid.timeSeries(dataSource, interval, {
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
      ],
      filter: filters
    }).catch((err)=>{
      res.status(400).json(err);
    });

    let filtersIrreg = {
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
    };
    
    if(filters){
      filtersIrreg = {
        type: "and",
        fields: [filtersIrreg, filters]
      }
    } 

    //res.status(400).json(filtersIrreg);

    let irregularities = await druid.timeSeries(dataSource, interval, {
      aggregations: [
        { "type": "count", "name": "ranking_irregularidades"},
        { "type": "longSum", "fieldName": "ranking_irregularidades", "name": "sum_ranking_irregularidades"}
      ],
      filter: filtersIrreg
    }).catch((err)=>{
      res.status(400).json(err);
    });

    var r = await druid.groupBy(dataSource, interval, {
      "dimensions": [
        "cod_modalidade", 
        "flag_lict_unic_com_venc",
        "flag_socios_comum",
        "nom_entidade",
        "nom_modalidade",
        "num_exercicio_licitacao",
        "qtd_lograd_nro_compl_comum", 
        "qtd_lograd_nro_comum", 
        "qtde_de_cnpjs_envolvidos_emails", 
        "qtde_de_cnpjs_envolvidos_tels", 
        "qtde_licitantes_nao_ativos", 
        "qtde_licitantes_nao_ativos_vencedores", 
        "ranking_irregularidades", 
        "seq_dim_licitacao", 
        "vlr_licitacao", 
        "nom_fonte_recurso",
        "dsc_objeto"
      ],
      filter: filters,
      limitSpec: { 
        "type": "default", 
        "limit": per_page, 
        "offset": (page-1)*per_page, //OFFSET não funciona na versão atual do Druid
        "columns": [{
            "dimension": "ranking_irregularidades",
            "direction": "descending"
        }]
      }
    }).catch((err)=>{
      res.status(400).json(err);
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
    }).catch((err)=>{
      res.status(400).json(err);
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
