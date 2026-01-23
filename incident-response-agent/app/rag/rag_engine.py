from langchain_community.vectorstores import Chroma

# Prefer the newer langchain_huggingface package if available (deprecation notice)
try:
    from langchain_huggingface import HuggingFaceEmbeddings
except Exception:
    from langchain_community.embeddings import HuggingFaceEmbeddings

from langchain_text_splitters import CharacterTextSplitter
import logging
from typing import Optional


# Lazy-loaded vector DB to avoid heavy initialization or startup failures
VECTOR_DB: Optional[Chroma] = None


def load_playbooks():
    try:
        with open("app/rag/playbooks.txt", "r", encoding="utf-8") as f:
            text = f.read()

        splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        docs = splitter.create_documents([text])

        # Explicitly set a model name to avoid future LangChain deprecation warnings
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        try:
            vectordb = Chroma.from_documents(docs, embeddings, persist_directory="playbook_db")
        except Exception as e:
            # If the existing DB was built with a different embedding dimension, try a new directory
            try:
                from chromadb.errors import InvalidArgumentError
                if isinstance(e, InvalidArgumentError) or "Collection expecting embedding" in str(e):
                    logging.warning("Chroma collection incompatible; creating a new DB at playbook_db_v2")
                    vectordb = Chroma.from_documents(docs, embeddings, persist_directory="playbook_db_v2")
                else:
                    raise
            except Exception:
                logging.exception("Failed to initialize playbook vector DB on retry: %s", e)
                return None

        return vectordb
    except Exception as e:
        logging.exception("Failed to initialize playbook vector DB: %s", e)
        return None


def get_vector_db():
    global VECTOR_DB
    if VECTOR_DB is None:
        VECTOR_DB = load_playbooks()
    return VECTOR_DB


def retrieve_playbook(query: str) -> str:
    vectordb = get_vector_db()
    if not vectordb:
        return ""
    try:
        results = vectordb.similarity_search(query, k=1)
        return results[0].page_content if results else ""
    except Exception as e:
        logging.exception("Error retrieving playbook: %s", e)
        return ""
