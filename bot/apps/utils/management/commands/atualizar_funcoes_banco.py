from glob import glob

from django.core.management.base import BaseCommand
from django.conf import settings

from apps.utils.types.sqls import executar_sql


class Command(BaseCommand):
    ''' O comando irá atualizar todas a a função do banco.
    O processo deleta todas as funções para criar novamente a partir dos arquivos sqls do diretório sqls/funcoes/
    Nos arquivos type tem o Drop e Create dos types, o processo deleta o type
    e cria novamente.
    No final executa a permissao das funções para o usuario do cliente.
    Como executar o comando:.../spa$ python3 manage.py atualizar_funcoes_banco
    '''

    def permission_function(self):
        db_user = settings.DB_NAME
        SQL = """GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO {};
        GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO spamaster;
        GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO usr_selector;
        GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO usr_support;
        """.format(db_user)
        executar_sql(SQL)
        print("Todas as funções com permissão para o cliente {}.".format(db_user))

    def drop_function_all(self):
        print("Removendo todas as funções ...")
        SQL = """
        DO
        $do$
        DECLARE
           _tbl text;
        BEGIN
        FOR _tbl  IN
            SELECT 'DROP FUNCTION ' || ns.nspname || '.' || pg_proc.proname || '(' || oidvectortypes(pg_proc.proargtypes) || ') CASCADE;'
                FROM pg_proc
                INNER JOIN pg_namespace ns ON pg_proc.pronamespace = ns.oid
                WHERE ns.nspname = 'public'
                --AND pg_proc.proname NOT LIKE '%unaccent%'
                AND (
                    pg_proc.proname LIKE '%get_%'
                    OR pg_proc.proname LIKE '%set_%'
                    OR pg_proc.proname LIKE '%finalizar_%'
                    OR pg_proc.proname LIKE '%criar_%'
                    OR pg_proc.proname LIKE '%copia_%'
                    OR pg_proc.proname LIKE '%calcular_%'
                    OR pg_proc.proname LIKE '%calc_%'
                    OR pg_proc.proname LIKE '%atualiza_%'
                    OR pg_proc.proname LIKE '%abertura_%'
                    OR pg_proc.proname LIKE '%acerto_%'
                    OR pg_proc.proname LIKE '%norm%'
                    OR pg_proc.proname LIKE '%clean%'
                )
                ORDER BY pg_proc.proname
        LOOP
           RAISE NOTICE '%',_tbl;
           EXECUTE _tbl;
        END LOOP;

        FOR _tbl  IN
        		SELECT 'DROP TYPE IF EXISTS ' || t.typname || ' CASCADE;'
        		FROM pg_type t
        		LEFT JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
        		WHERE t.typname LIKE 'type_%'
        LOOP
           RAISE NOTICE '%',_tbl;
           EXECUTE _tbl;
        END LOOP;

        END
        $do$;
        """
        print(SQL)
        try:
            executar_sql(SQL)
        except:
            SQL = SQL.replace('%','%%') #tratamento para nao dar o erro do % na query
            executar_sql(SQL)

        print("Todas as funções foram deletadas.")


    def handle(self, *args, **options):
        '''A variavel SQL tem o replace para tratar o %.
        O python ao executar uma query com % dá o erro
        IndexError: tuple index out of range'''

        #deleta as funções
        self.drop_function_all()

        #cria as funções e types
        funcoes = glob("sqls/funcoes/*.sql")
        funcoes += glob("sqls/funcoes/*/*.sql")
        funcoes += glob("sqls/funcoes/*/*/*.sql")

        lista_funcoes = args if args else funcoes
        #print('lista_funcoes',lista_funcoes)

        for funcao in sorted(funcoes, reverse=True):
            funcao_nome = funcao.split("/")[-1].replace(".sql","")

            print("Atualizando a funcao: ", funcao)
            arq_sql = open(funcao, 'r')
            SQL = arq_sql.read()
            try:
                executar_sql(SQL)
            except:
                SQL = SQL.replace('%','%%') #tratamento para nao dar o erro do % na query
                executar_sql(SQL)
            arq_sql.close()

        #permissao do usuario da aplicacao das funções
        self.permission_function()
        print('Processo finalizado com sucesso!')
