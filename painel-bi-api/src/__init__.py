from fastapi import APIRouter, Depends

from src.modules.painel_bi.v1.licitacoes.licitacoes_controller import licitacao_router
from src.modules.painel_bi.v1.licitante.licitante_controller import licitante_router
from src.modules.painel_bi.v1.filters.filters_controller import filters_router

from src.modules.painel_bi.v2.licitacoes.licitacoes_controller import licitacao_router as licitacao_router_v2
from src.modules.painel_bi.v2.licitante.licitante_controller import licitante_router as licitante_router_v2
from src.modules.painel_bi.v2.filters.filters_controller import filters_router as filters_router_v2

router = APIRouter()
router.include_router(licitacao_router, prefix='/painel_bi/v1/licitacoes', tags=['Licitacoes'])
router.include_router(licitante_router, prefix='/painel_bi/v1/licitante', tags=['Licitante'])
router.include_router(filters_router, prefix='/painel_bi/v1/filters', tags=['Filters'])
router.include_router(licitacao_router_v2, prefix='/painel_bi/v2/licitacoes', tags=['Licitacoes'])
router.include_router(licitante_router_v2, prefix='/painel_bi/v2/licitante', tags=['Licitante'])
router.include_router(filters_router_v2, prefix='/painel_bi/v2/filters', tags=['Filters'])
