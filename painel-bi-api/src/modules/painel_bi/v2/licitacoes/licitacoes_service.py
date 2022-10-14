from typing import List
from src.modules.painel_bi.v2.licitacoes.licitacoes_operations import LicitacaoQuery
from src.modules.painel_bi.v2.licitacoes.licitacoes_repository import LicitacaoRepository as repository
from src.modules.painel_bi.v2.utils.utils import Pageable

class LicitacaoService:

    def get_licitacoes(params: LicitacaoQuery, pageable: Pageable):
        return repository.get_licitacoes(params, pageable)
        
    def get_header(params: LicitacaoQuery, pageable: Pageable):
        return repository.get_header(params, pageable)

    def find_by_id(id_licitacao: str):
        item = repository.find_by_id(id_licitacao)
        return item