"""
embed.py - Genera embeddings y carga ChromaDB

Toma los textos extraídos, los fragmenta en chunks y los almacena en ChromaDB
con sus embeddings correspondientes.
"""

import json
import os
from pathlib import Path
from typing import List, Dict, Any
from tqdm import tqdm

from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

# Módulo de seguridad para sanitización
try:
    import security
    from security import sanitize_context
    SANITIZATION_ENABLED = True
except ImportError:
    # Fallback si el módulo no está disponible
    SANITIZATION_ENABLED = False
    print("⚠️  Módulo de seguridad no disponible. La sanitización durante indexación estará deshabilitada.")


# Configuración
CHUNK_SIZE = 500  # palabras
CHUNK_OVERLAP = 50  # palabras de solapamiento
EMBEDDING_MODEL = 'paraphrase-multilingual-MiniLM-L12-v2'
TOP_K = 5  # chunks a recuperar por defecto


def split_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    """
    Divide el texto en chunks de aproximadamente chunk_size palabras.
    Mantiene solapamiento entre chunks.
    """
    if not text.strip():
        return []
    
    # Tokenizar por palabras
    words = text.split()
    
    if len(words) <= chunk_size:
        return [text]
    
    chunks = []
    step = chunk_size - overlap
    
    for i in range(0, len(words), step):
        chunk_words = words[i:i + chunk_size]
        chunk = ' '.join(chunk_words)
        chunks.append(chunk)
        
        if i + chunk_size >= len(words):
            break
    
    return chunks


def create_chunks_with_metadata(docs: List[Dict]) -> List[Dict]:
    """
    Crea chunks de texto con metadatos enriquecidos.
    Aplica sanitización de seguridad si está habilitada.
    """
    chunks = []
    
    for doc in docs:
        # Sanitizar texto antes de chunking (si está habilitado)
        if SANITIZATION_ENABLED:
            doc_text = sanitize_context(doc['text'])
        else:
            doc_text = doc['text']
        
        text_chunks = split_text(doc_text)
        
        for idx, chunk_text in enumerate(text_chunks):
            chunk = {
                'id': f"{doc['id']}_chunk_{idx}",
                'text': chunk_text,
                'doc_id': doc['id'],
                'title': doc['title'],
                'domain': doc['domain'],
                'priority': doc['priority'],
                'chunk_index': idx,
                'total_chunks': len(text_chunks)
            }
            chunks.append(chunk)
    
    return chunks


def load_documents(extracted_dir: str) -> List[Dict]:
    """Carga los documentos extraídos desde el directorio."""
    metadata_file = Path(extracted_dir) / '_metadata.json'
    
    if metadata_file.exists():
        with open(metadata_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    else:
        # Fallback: cargar desde archivos individuales
        docs = []
        for txt_file in Path(extracted_dir).glob('*.txt'):
            if txt_file.name == '_metadata.json':
                continue
            
            with open(txt_file, 'r', encoding='utf-8') as f:
                content = f.read()
                parts = content.split('\n---\n')
                if len(parts) >= 2:
                    header = parts[0]
                    text = parts[1]
                    
                    doc = {
                        'id': txt_file.stem,
                        'text': text,
                        'domain': 'General',
                        'priority': 'Media',
                        'title': 'Sin título'
                    }
                    
                    for line in header.split('\n'):
                        if line.startswith('TITLE: '):
                            doc['title'] = line[7:]
                        elif line.startswith('DOMAIN: '):
                            doc['domain'] = line[8:]
                        elif line.startswith('PRIORITY: '):
                            doc['priority'] = line[10:]
                    
                    docs.append(doc)
        
        return docs


def generate_embeddings(chunks: List[Dict], model_name: str = EMBEDDING_MODEL) -> Dict[str, Any]:
    """
    Genera embeddings para todos los chunks usando sentence-transformers.
    """
    print(f"Cargando modelo de embeddings: {model_name}")
    model = SentenceTransformer(model_name)
    
    texts = [chunk['text'] for chunk in chunks]
    
    print(f"Generando embeddings para {len(texts)} chunks...")
    embeddings = model.encode(texts, show_progress_bar=True, convert_to_numpy=True)
    
    return {
        'embeddings': embeddings,
        'model': model,
        'dimension': embeddings.shape[1]
    }


def setup_chromadb(persist_dir: str, collection_name: str = 'confluence_docs'):
    """
    Configura/inicializa la base de datos ChromaDB.
    """
    client = chromadb.PersistentClient(
        path=persist_dir,
        settings=Settings(anonymized_telemetry=False)
    )
    
    # Verificar si la colección existe
    try:
        collection = client.get_collection(name=collection_name)
        print(f"Colección '{collection_name}' ya existe con {collection.count()} documentos")
        return client, collection
    except:
        print(f"Creando nueva colección: {collection_name}")
        collection = client.create_collection(
            name=collection_name,
            metadata={'description': 'Documentos de Confluence de Bancard'}
        )
        return client, collection


def index_to_chromadb(chunks: List[Dict], embeddings_data: Dict[str, Any], 
                      persist_dir: str, collection_name: str = 'confluence_docs'):
    """
    Indexa los chunks con sus embeddings en ChromaDB.
    """
    client, collection = setup_chromadb(persist_dir, collection_name)
    
    embeddings = embeddings_data['embeddings']
    model = embeddings_data['model']
    
    # Preparar datos para ChromaDB
    ids = [chunk['id'] for chunk in chunks]
    documents = [chunk['text'] for chunk in chunks]
    
    # Metadatos enriquecidos
    metadatas = []
    for chunk in chunks:
        metadata = {
            'doc_id': chunk['doc_id'],
            'title': chunk['title'],
            'domain': chunk['domain'],
            'priority': chunk['priority'],
            'chunk_index': chunk['chunk_index'],
            'total_chunks': chunk['total_chunks']
        }
        metadatas.append(metadata)
    
    print(f"Indexando {len(chunks)} chunks en ChromaDB...")
    
    # Usar add directamente con embeddings pre-computados
    collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings.tolist() if hasattr(embeddings, 'tolist') else embeddings,
        metadatas=metadatas
    )
    
    print(f"Indexación completada. Total de documentos: {collection.count()}")
    
    # Guardar modelo usado
    model_info = {
        'model': EMBEDDING_MODEL,
        'dimension': embeddings_data['dimension'],
        'chunk_size': CHUNK_SIZE,
        'chunk_overlap': CHUNK_OVERLAP
    }
    
    with open(os.path.join(persist_dir, '_model_info.json'), 'w') as f:
        json.dump(model_info, f, indent=2)
    
    return collection


def build_index(extracted_dir: str, persist_dir: str):
    """
    Construye el índice vectorial completo.
    """
    # Cargar documentos
    print("Cargando documentos extraídos...")
    docs = load_documents(extracted_dir)
    print(f"Cargados {len(docs)} documentos")
    
    # Crear chunks
    print(f"Creando chunks (size={CHUNK_SIZE}, overlap={CHUNK_OVERLAP})...")
    chunks = create_chunks_with_metadata(docs)
    print(f"Creados {len(chunks)} chunks")
    
    # Generar embeddings
    embeddings_data = generate_embeddings(chunks)
    print(f"Dimensión de embeddings: {embeddings_data['dimension']}")
    
    # Indexar en ChromaDB
    collection = index_to_chromadb(chunks, embeddings_data, persist_dir)
    
    # Resumen
    print("\n" + "="*50)
    print("RESUMEN DEL ÍNDICE")
    print("="*50)
    print(f"Documentos originales: {len(docs)}")
    print(f"Chunks totales: {len(chunks)}")
    print(f"Modelo: {EMBEDDING_MODEL}")
    print(f"Dimensión: {embeddings_data['dimension']}")
    print(f"Directorio: {persist_dir}")
    
    # Distribución por dominio
    domains = {}
    for chunk in chunks:
        d = chunk['domain']
        domains[d] = domains.get(d, 0) + 1
    print(f"Chunks por dominio: {dict(sorted(domains.items()))}")
    
    return collection


if __name__ == '__main__':
    EXTRACTED_DIR = '/home/manpac/.openclaw/workspace/agents/qubika/rag/extracted'
    PERSIST_DIR = '/home/manpac/.openclaw/workspace/agents/qubika/rag/chromadb'
    
    build_index(EXTRACTED_DIR, PERSIST_DIR)