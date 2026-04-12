CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS hstore;

-- Drop and recreate vector_store to match Ollama embedding dimensions (768 for nomic-embed-text)
DROP TABLE IF EXISTS vector_store;
CREATE TABLE IF NOT EXISTS vector_store(
    id TEXT PRIMARY KEY, -- id should be TEXT (not UUID type)
    content TEXT,
    metadata JSONB,
    embedding VECTOR(768)
);

-- Create HNSW index for fast search
CREATE INDEX IF NOT EXISTS vector_store_embedding_idx ON vector_store USING HNSW (embedding vector_cosine_ops);

-- product.description column length is managed by Hibernate (@Column(length=5000))

