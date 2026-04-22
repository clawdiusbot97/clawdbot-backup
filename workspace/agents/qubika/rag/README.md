# RAG para Documentación de Bancard
Sistema de Retrieval-Augmented Generation local para consultar la documentación de Confluence.

## Instalación

```bash
pip install -r requirements.txt
```

## Dependencias

- `chromadb>=0.4.0` - Base de datos vectorial
- `sentence-transformers>=2.2.0` - Modelo de embeddings
- `torch` - Backend para sentence-transformers

## Construcción de la Base Vectorial

### 1. Extraer texto de los JSONs

```bash
python extract.py
```

Esto creará:
- `/extracted/*.txt` - Textos extraídos
- `/extracted/_metadata.json` - Metadatos combinados

### 2. Generar embeddings e indexar

```bash
python embed.py
```

Esto creará:
- `/chromadb/` - Base de datos ChromaDB persistente

## Uso

### Consulta desde CLI

```bash
python query.py "¿cuál es el flujo de deploy con Docker?"
python query.py "¿qué servicios usan JRuby?"
```

### Uso programático

```python
from query import query_rag, RAGQuerySystem

# Consulta simple
result = query_rag("¿cómo levanto un proyecto dockerizado?")
print(result['answer'])
print(result['sources'])

# Modo interactivo
system = RAGQuerySystem('/path/to/chromadb')
chunks = system.query("pregunta", top_k=5)
```

### Filtros

```python
system = RAGQuerySystem('/path/to/chromadb')

# Solo documentos de Docker
chunks = system.query("deploy", filters={"domain": "Docker"})

# Alta prioridad
chunks = system.query("migraciones", filters={"priority": "Alta"})
```

## Estructura del Proyecto

```
rag/
├── extract.py       # Extracción de texto de JSONs
├── embed.py         # Generación de embeddings + ChromaDB
├── query.py         # Sistema de consultas
├── requirements.txt # Dependencias
├── README.md        # Este archivo
├── extracted/       # Textos extraídos (生成)
└── chromadb/        # Base vectorial (生成)
```

## Consultas de Ejemplo

```python
# Flujo de deploy con Docker
query_rag("¿cómo es el flujo de deploy con Docker?")

# Servicios JRuby
query_rag("¿qué servicios usan JRuby?")

# Autenticación
query_rag("¿cómo genero un token JWT?")

# Migraciones de base de datos
query_rag("¿cómo hago migraciones con Rails?")

# Onboarding
query_rag("¿qué necesito para hacer onboarding en Bancard?")
```

## Notas

- **Modelo**: `all-MiniLM-L6-v2` (384 dimensiones, rápido y ligero)
- **Chunk size**: ~500 palabras con 50 de solapamiento
- **Storage**: ChromaDB con persistencia local
- **Sin APIs externas**: Todo corre localmente