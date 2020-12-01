module.exports = (app) => {

    const service = app.services.druid;
    const controller = {};
  
    controller.getTeste = async (req, res) => {
        //return res.status(200).json();

        var r = await service.groupBy("painel_bi_info_gerais_licitacoes", {
            limitSpec: { 
                "type": "default", 
                "limit": 10, 
                "columns": [{
                    "dimension": "ranking_irregularidades",
                    "direction": "descending"
                }]
            }
        });
        
        return res.status(200).json(r)
        /*.then(result=>{
            return res.status(200).json(result)
        });
        */

    };
    
    return controller;
  };
  