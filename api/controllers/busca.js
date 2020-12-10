module.exports = (app) => {

  const druid = app.services.druid;
  const controller = {};

  controller.buscar = async (req, res) => {
    let busca = req.query.q;

    busca = busca.split(".").join("");
    busca = busca.replace("/", "");
    busca = busca.replace("-", "");

    const dataSource = "painel_bi_detalhamento_cnpj";
    let interval = await druid.timeBoundary(dataSource);

    let resultados = await druid.scan(dataSource, interval, {
        limit: 5,
        filter: {
            "type": "or",
            fields: [
                {
                    "type": "search",
                    "dimension": "nome_fantasia",
                    "query": {
                        "type": "insensitive_contains",
                        "value": busca
                    }
                },
                {
                    "type": "search",
                    "dimension": "razao_social",
                    "query": {
                        "type": "insensitive_contains",
                        "value": busca
                    }
                },
                {
                    "type": "like",
                    "dimension": "num_documento",
                    "pattern": busca
                }
            ]
        }
    });



    return res.status(200).json(resultados);
  };

  return controller;
};
