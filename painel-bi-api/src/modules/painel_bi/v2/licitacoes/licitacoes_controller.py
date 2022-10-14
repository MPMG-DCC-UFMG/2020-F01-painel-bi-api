from typing import List

from fastapi import APIRouter, Depends

from src.modules.painel_bi.v2.licitacoes.licitacoes_operations import LicitacaoQuery
from src.modules.painel_bi.v2.licitacoes.licitacoes_service import LicitacaoService as service
from src.modules.painel_bi.v2.utils.utils import (
    Pageable
)

licitacao_router = APIRouter()

@licitacao_router.post('/', description='Buscar licitações de acordo com os parametros', )
async def get_licitacoes(params: LicitacaoQuery = LicitacaoQuery(), page: int = 0, per_page: int = 250) -> List[dict]:
    if page < 0:
        page = 0
    pageable = Pageable(page, per_page)
    return service.get_licitacoes(params, pageable)
    
@licitacao_router.post('/header/', description='Buscar  cabeçalho das licitações de acordo com os parametros', )
async def get_header(params: LicitacaoQuery = LicitacaoQuery(), per_page: int = 250) -> List[dict]:
    pageable = Pageable(0, per_page)
    return service.get_header(params, pageable)


@licitacao_router.get('/{id}', description='Buscar licitação por ID', )
async def get_licitacao(id: str):
  return service.find_by_id(id)

