CREATE TABLE IF NOT EXISTS article (
    id SERIAL NOT NULL,
    author_id INT4 NOT NULL,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL  DEFAULT NOW(),
    CONSTRAINT article_pkey PRIMARY KEY (id),
	CONSTRAINT article_author_id_fkey FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
