CREATE TABLE base_conhecimento_produto (
	id serial NOT NULL,
	descricao CHARACTER VARYING (20),
	CONSTRAINT base_conhecimento_produto_pkey PRIMARY KEY (id)
);

CREATE TABLE base_conhecimento (
	id SERIAL NOT NULL,
	private_ti BOOLEAN DEFAULT false,
	private_consultoria BOOLEAN DEFAULT false,
	public BOOLEAN DEFAULT false,
	produto_id integer NOT NULL,
	slug character varying(150) NOT NULL,
	CONSTRAINT base_conhecimento_pkey PRIMARY KEY (id)
);

CREATE TABLE base_conhecimento_log (
	id SERIAL NOT NULL,
	data_cadastro timestamp with time zone NOT NULL DEFAULT ('now'::text)::date,
	usuario integer,
	data_atualizacao timestamp with time zone NOT NULL DEFAULT ('now'::text)::date,
	acao text NOT NULL,
	CONSTRAINT base_conhecimento_log_pkey PRIMARY KEY (id)

);
