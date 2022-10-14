from typing import List, Optional

from fastapi import Query

from src.modules.painel_bi.v2.model.licitacao import LicitacaoModel
from sqlalchemy.sql import label
from pydantic import BaseModel

class PesoQuery(BaseModel):
    valor: Optional[float] = Query(None, description="Peso do valor")
    T01: Optional[float] = Query(None, description="Peso da trilha T01")
    T02: Optional[float] = Query(None, description="Peso da trilha T02")
    T03: Optional[float] = Query(None, description="Peso da trilha T03")
    T04: Optional[float] = Query(None, description="Peso da trilha T04")
    T05: Optional[float] = Query(None, description="Peso da trilha T05")
    T06: Optional[float] = Query(None, description="Peso da trilha T06")
    T07: Optional[float] = Query(None, description="Peso da trilha T07")
    T08: Optional[float] = Query(None, description="Peso da trilha T08")
    T09: Optional[float] = Query(None, description="Peso da trilha T09")
    T10: Optional[float] = Query(None, description="Peso da trilha T10")
    T11: Optional[float] = Query(None, description="Peso da trilha T11")
    T12: Optional[float] = Query(None, description="Peso da trilha T12")
    T13: Optional[float] = Query(None, description="Peso da trilha T13")
    

    class Config:
        arbitrary_types_allowed = True



class LicitacaoQuery(BaseModel):
    ano: Optional[List[int]] = Query(None, description="Ano de exercicio da licitação")
    comarca: Optional[List[str]] = Query(None, description="Comarca do órgão licitante")
    mesorregiao: Optional[List[str]] = Query(None, description="Mesorregiao do órgão licitante")
    microrregiao: Optional[List[str]] = Query(None, description="Microrregiao do órgão licitante")
    modalidades: Optional[List[str]] = Query(None, description="Modalidades do órgão licitante")
    municipios: Optional[List[str]] = Query(None, description="Município do órgão licitante")
    valor: Optional[List[float]] = Query(None, description="Valor da licitação")
    pesos: Optional[PesoQuery] = Query(None, description="Pesos")

    class Config:
        arbitrary_types_allowed = True

def get_params_values(params):
    filters = []

    if bool(params.municipios):
        filters.append(LicitacaoModel.nom_entidade.in_(params.municipios))
    if bool(params.microrregiao):
        filters.append(LicitacaoModel.nom_micro_regiao.in_(params.microrregiao))
    if bool(params.mesorregiao):
        filters.append(LicitacaoModel.nom_meso_regiao.in_(params.mesorregiao))
    if bool(params.comarca):
        filters.append(LicitacaoModel.nom_comarca.in_(params.comarca))
    if bool(params.modalidades):
        filters.append(LicitacaoModel.nom_modalidade.in_(params.modalidades))

    if bool(params.ano):
        filters.append(LicitacaoModel.num_exercicio >= params.ano[0])
    if bool(params.ano):
        filters.append(LicitacaoModel.num_exercicio <= params.ano[1])

    if bool(params.valor):
        filters.append(LicitacaoModel.vlr_licitacao >= params.valor[0])
    if bool(params.valor):
        filters.append(LicitacaoModel.vlr_licitacao <= params.valor[1])
    return filters
    
def get_ranking_label(params):
    T01_peso = 1
    T02_peso = 1
    T03_peso = 1
    T04_peso = 1
    T05_peso = 1
    T06_peso = 1
    T07_peso = 1
    T08_peso = 1
    T09_peso = 1
    T10_peso = 1
    T11_peso = 1
    T12_peso = 1
    T13_peso = 1
    valor_peso = 1
    if params.pesos is not None:
        if (params.pesos.T01 is not None) and (params.pesos.T01 >= 0) and (params.pesos.T01 <= 1):
            T01_peso = params.pesos.T01
        if params.pesos.T02 is not None and (params.pesos.T02 >= 0) and (params.pesos.T02 <= 1):
            T02_peso = params.pesos.T02
        if params.pesos.T03 is not None and (params.pesos.T03 >= 0) and (params.pesos.T03 <= 1):
            T03_peso = params.pesos.T03
        if params.pesos.T04 is not None and (params.pesos.T04 >= 0) and (params.pesos.T04 <= 1):
            T04_peso = params.pesos.T04
        if params.pesos.T05 is not None and (params.pesos.T05 >= 0) and (params.pesos.T05 <= 1):
            T05_peso = params.pesos.T05
        if params.pesos.T06 is not None and (params.pesos.T06 >= 0) and (params.pesos.T06 <= 1):
            T06_peso = params.pesos.T06
        if params.pesos.T07 is not None and (params.pesos.T07 >= 0) and (params.pesos.T07 <= 1):
            T07_peso = params.pesos.T07
        if params.pesos.T08 is not None and (params.pesos.T08 >= 0) and (params.pesos.T08 <= 1):
            T08_peso = params.pesos.T08
        if params.pesos.T09 is not None and (params.pesos.T09 >= 0) and (params.pesos.T09 <= 1):
            T09_peso = params.pesos.T09
        if params.pesos.T10 is not None and (params.pesos.T10 >= 0) and (params.pesos.T10 <= 1):
            T10_peso = params.pesos.T10
        if params.pesos.T11 is not None and (params.pesos.T11 >= 0) and (params.pesos.T11 <= 1):
            T11_peso = params.pesos.T11
        if params.pesos.T12 is not None and (params.pesos.T12 >= 0) and (params.pesos.T12 <= 1):
            T12_peso = params.pesos.T12
        if params.pesos.T13 is not None and (params.pesos.T13 >= 0) and (params.pesos.T13 <= 1):
            T13_peso = params.pesos.T13
        if params.pesos.valor is not None and (params.pesos.valor >= 0) and (params.pesos.valor <= 1):
            valor_peso = params.pesos.valor

    T01_qtd = LicitacaoModel.flag_lict_unic_com_venc*LicitacaoModel.flag_lict_unic_sem_venc
    T02_qtd = LicitacaoModel.qtde_licitantes_nao_ativos
    T03_qtd = LicitacaoModel.qtde_de_cnpjs_envolvidos_emails
    T04_qtd = LicitacaoModel.qtde_de_cnpjs_envolvidos_tels
    T05_qtd = LicitacaoModel.qtde_de_cnpjs_envolvidos_endereco
    T06_qtd = LicitacaoModel.qtd_cnpjs_envolvidos_nao_socios_comum
    T07_qtd = LicitacaoModel.qtd_cnpjs_envolvidos_socios_comum
    T08_qtd = LicitacaoModel.qtd_cnpjs_vencedores_frequentes
    T09_qtd = LicitacaoModel.qtd_cnpjs_perdedores_frequentes
    T10_qtd = LicitacaoModel.qtd_cnpjs_cnae_incongruente
    T11_qtd = LicitacaoModel.qtd_cnpjs_antes_atividade
    T12_qtd = LicitacaoModel.qtd_cnpjs_restricao_ceis
    T13_qtd = LicitacaoModel.qtd_cnpjs_socio_servidor_publico
    valor_qtd = LicitacaoModel.vlr_licitacao


    ranking = label('ranking_irregularidades',\
                    (\
                        (T01_qtd * T01_peso)+\
                        (T02_qtd * T02_peso)+\
                        (T03_qtd * T03_peso)+\
                        (T04_qtd * T04_peso)+\
                        (T05_qtd * T05_peso)+\
                        (T06_qtd * T06_peso)+\
                        (T07_qtd * T07_peso)+\
                        (T08_qtd * T08_peso)+\
                        (T09_qtd * T09_peso)+\
                        (T10_qtd * T10_peso)+\
                        (T11_qtd * T11_peso)+\
                        (T12_qtd * T12_peso)+\
                        (T13_qtd * T13_peso)\
                    )\
                    *(valor_qtd * valor_peso)\
                )
    return ranking