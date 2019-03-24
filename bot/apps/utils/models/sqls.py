from __future__ import unicode_literals

from django.db import models

from apps.utils.types.sqls import sql_to_dict, executar_sql, consulta_valor_escalar_no_banco


class SQLMixin(models.Model):

    """ Mixin para sqls """

    database_alias = 'default'

    class Meta:
        abstract = True

    def _sql_to_list(self, select_sql, param=None, key_dados=""):
        return SQLMixin.sql_to_dict(
            select_sql,
            param=param,
            return_dados=True,
            key_dados=key_dados
        )

    def _sql_to_dict(self, select_sql, param=None,  key_dados=""):
        return SQLMixin.sql_to_dict(
            select_sql,
            param=param,
            return_dados=False,
            key_dados=key_dados
        )

    @staticmethod
    def sql_to_dict(select_sql, param=None,
                     return_dados=False, key_dados="id"):

        retorno = sql_to_dict(
            select_sql,
            param=param,
            database_alias=SQLMixin.database_alias
        )
        if return_dados:
            return SQLMixin.get_list_from_dados(
                retorno,
                key_dados=key_dados
            )
        return retorno

    @staticmethod
    def get_list_from_dados(dados, key_dados="id"):
        return map(lambda d: d[key_dados], dados)

    @staticmethod
    def consulta_valor_escalar_no_banco(select_sql):
        return consulta_valor_escalar_no_banco(
            select_sql,
            database_alias=SQLMixin.database_alias
        )

    @staticmethod
    def executar_sql(select_sql):
        return executar_sql(
            select_sql,
            database_alias=SQLMixin.database_alias
        )
