"""
query.py - Sistema de consulta para la base vectorial RAG

Proporciona funciones para consultar ChromaDB y recuperar los chunks más similares.
Soporte para búsqueda híbrida: embeddings + keywords.
"""

import json
import os
import re
from pathlib import Path
from typing import List, Dict, Any, Optional, Set
from dataclasses import dataclass

import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer

# Módulo de seguridad RAG
try:
    from . import security
    from .security import sanitizer, sanitize_context, apply_security_limits, prepare_context_for_llm
    SECURITY_AVAILABLE = True
except ImportError:
    import sys
    sys.path.append(os.path.dirname(__file__))
    try:
        import security
        from security import sanitizer, sanitize_context, apply_security_limits, prepare_context_for_llm
        SECURITY_AVAILABLE = True
    except ImportError:
        SECURITY_AVAILABLE = False
        print("⚠️  Módulo de seguridad no disponible. Ejecutando sin protecciones.")


# Stopwords en español (lista básica)
SPANISH_STOPWORDS = {
    'de', 'la', 'el', 'y', 'a', 'en', 'que', 'es', 'un', 'una', 'con', 'para', 'por',
    'los', 'las', 'del', 'se', 'su', 'al', 'lo', 'como', 'más', 'pero', 'sus', 'o',
    'este', 'esta', 'si', 'ya', 'cuando', 'muy', 'sin', 'sobre', 'también', 'me',
    'hay', 'donde', 'quien', 'qué', 'cómo', 'cual', 'cuando', 'cuyo', 'cuyos',
    'ante', 'bajo', 'contra', 'desde', 'entre', 'hacia', 'hasta', 'mediante',
    'para', 'por', 'según', 'sin', 'sobre', 'tras', 'durante', 'ante', 'bajo',
    'como', 'con', 'de', 'desde', 'en', 'entre', 'hacia', 'hasta', 'para', 'por',
    'según', 'sin', 'sobre', 'tras', 'durante', 'mediante', 'versus', 'vía',
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'este', 'esta',
    'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'aquel', 'aquella',
    'aquellos', 'aquellas', 'le', 'les', 'lo', 'la', 'los', 'las', 'se', 'te',
    'me', 'nos', 'os', 'mi', 'mis', 'tu', 'tus', 'su', 'sus', 'nuestro',
    'nuestra', 'nuestros', 'nuestras', 'vuestro', 'vuestra', 'vuestros',
    'vuestras', 'cuyo', 'cuya', 'cuyos', 'cuyas', 'que', 'quien', 'quienes',
    'cual', 'cuales', 'cuyo', 'cuya', 'cuyos', 'cuyas', 'cuanto', 'cuanta',
    'cuantos', 'cuantas', 'donde', 'cuando', 'como', 'porque', 'aunque',
    'mientras', 'si', 'sino', 'pero', 'y', 'o', 'ni', 'que', 'pues', 'aunque',
    'siquiera', 'conque', 'luego', 'así', 'tan', 'tanto', 'mucho', 'poco',
    'bastante', 'demasiado', 'más', 'menos', 'algo', 'nada', 'todo', 'alguien',
    'nadie', 'cada', 'cualquier', 'ningún', 'ninguna', 'ningunos', 'ningunas',
    'varios', 'varias', 'otros', 'otras', 'tal', 'tales', 'cierto', 'cierta',
    'ciertos', 'ciertas', 'medio', 'media', 'medios', 'medias', 'sendos',
    'sendas', 'ambos', 'ambas', 'sendos', 'sendas', 'cada', 'sendos', 'sendas',
    'varios', 'varias', 'otros', 'otras', 'muchos', 'muchas', 'pocos', 'pocas',
    'bastantes', 'demasiados', 'demasiadas', 'tantos', 'tantas', 'cuántos',
    'cuántas', 'cuánto', 'cuánta', 'cuántos', 'cuántas', 'algún', 'alguna',
    'algunos', 'algunas', 'ningún', 'ninguna', 'ningunos', 'ningunas',
    'mismo', 'misma', 'mismos', 'mismas', 'propio', 'propia', 'propios',
    'propias', 'semejante', 'semejantes', 'tal', 'tales', 'cierto', 'cierta',
    'ciertos', 'ciertas', 'dicho', 'dicha', 'dichos', 'dichas', 'expreso',
    'expresa', 'expresos', 'expresas', 'presente', 'presentes', 'futuro',
    'futura', 'futuros', 'futuras', 'pasado', 'pasada', 'pasados', 'pasadas',
    'anterior', 'anteriores', 'posterior', 'posteriores', 'siguiente',
    'siguientes', 'próximo', 'próxima', 'próximos', 'próximas', 'último',
    'última', 'últimos', 'últimas', 'primero', 'primera', 'primeros',
    'primeras', 'segundo', 'segunda', 'segundos', 'segundas', 'tercero',
    'tercera', 'terceros', 'terceras', 'cuarto', 'cuarta', 'cuartos',
    'cuartas', 'quinto', 'quinta', 'quintos', 'quintas', 'sexto', 'sexta',
    'sextos', 'sextas', 'séptimo', 'séptima', 'séptimos', 'séptimas',
    'octavo', 'octava', 'octavos', 'octavas', 'noveno', 'novena', 'novenos',
    'novenas', 'décimo', 'décima', 'décimos', 'décimas', 'undécimo',
    'undécima', 'undécimos', 'undécimas', 'duodécimo', 'duodécima',
    'duodécimos', 'duodécimas', 'decimotercero', 'decimotercera',
    'decimoterceros', 'decimoterceras', 'decimocuarto', 'decimocuarta',
    'decimocuartos', 'decimocuartas', 'decimoquinto', 'decimoquinta',
    'decimoquintos', 'decimoquintas', 'decimosexto', 'decimosexta',
    'decimosextos', 'decimosextas', 'decimoséptimo', 'decimoséptima',
    'decimoséptimos', 'decimoséptimas', 'decimoctavo', 'decimoctava',
    'decimoctavos', 'decimoctavas', 'decimonoveno', 'decimonovena',
    'decimonovenos', 'decimonovenas', 'vigésimo', 'vigésima', 'vigésimos',
    'vigésimas', 'trigésimo', 'trigésima', 'trigésimos', 'trigésimas',
    'cuadragésimo', 'cuadragésima', 'cuadragésimos', 'cuadragésimas',
    'quincuagésimo', 'quincuagésima', 'quincuagésimos', 'quincuagésimas',
    'sexagésimo', 'sexagésima', 'sexagésimos', 'sexagésimas', 'septuagésimo',
    'septuagésima', 'septuagésimos', 'septuagésimas', 'octogésimo',
    'octogésima', 'octogésimos', 'octogésimas', 'nonagésimo', 'nonagésima',
    'nonagésimos', 'nonagésimas', 'centésimo', 'centésima', 'centésimos',
    'centésimas', 'ducentésimo', 'ducentésima', 'ducentésimos', 'ducentésimas',
    'tricentésimo', 'tricentésima', 'tricentésimos', 'tricentésimas',
    'cuadringentésimo', 'cuadringentésima', 'cuadringentésimos',
    'cuadringentésimas', 'quingentésimo', 'quingentésima', 'quingentésimos',
    'quingentésimas', 'sexcentésimo', 'sexcentésima', 'sexcentésimos',
    'sexcentésimas', 'septingentésimo', 'septingentésima', 'septingentésimos',
    'septingentésimas', 'octingentésimo', 'octingentésima', 'octingentésimos',
    'octingentésimas', 'noningentésimo', 'noningentésima', 'noningentésimos',
    'noningentésimas', 'milésimo', 'milésima', 'milésimos', 'milésimas',
    'dosmilésimo', 'dosmilésima', 'dosmilésimos', 'dosmilésimas',
    'tresmilésimo', 'tresmilésima', 'tresmilésimos', 'tresmilésimas',
    'cuatromilésimo', 'cuatromilésima', 'cuatromilésimos', 'cuatromilésimas',
    'cincomilésimo', 'cincomilésima', 'cincomilésimos', 'cincomilésimas',
    'seismilésimo', 'seismilésima', 'seismilésimos', 'seismilésimas',
    'sietemilésimo', 'sietemilésima', 'sietemilésimos', 'sietemilésimas',
    'ochomilésimo', 'ochomilésima', 'ochomilésimos', 'ochomilésimas',
    'nuevemilésimo', 'nuevemilésima', 'nuevemilésimos', 'nuevemilésimas',
    'diezmilésimo', 'diezmilésima', 'diezmilésimos', 'diezmilésimas',
    'cienmilésimo', 'cienmilésima', 'cienmilésimos', 'cienmilésimas',
    'millonésimo', 'millonésima', 'millonésimos', 'millonésimas',
    'dosmillonésimo', 'dosmillonésima', 'dosmillonésimos', 'dosmillonésimas',
    'tresmillonésimo', 'tresmillonésima', 'tresmillonésimos', 'tresmillonésimas',
    'cuatromillonésimo', 'cuatromillonésima', 'cuatromillonésimos',
    'cuatromillonésimas', 'cincomillonésimo', 'cincomillonésima',
    'cincomillonésimos', 'cincomillonésimas', 'seismillonésimo',
    'seismillonésima', 'seismillonésimos', 'seismillonésimas',
    'sietemillonésimo', 'sietemillonésima', 'sietemillonésimos',
    'sietemillonésimas', 'ochomillonésimo', 'ochomillonésima',
    'ochomillonésimos', 'ochomillonésimas', 'nuevemillonésimo',
    'nuevemillonésima', 'nuevemillonésimos', 'nuevemillonésimas',
    'diezmillonésimo', 'diezmillonésima', 'diezmillonésimos',
    'diezmillonésimas', 'cienmillonésimo', 'cienmillonésima',
    'cienmillonésimos', 'cienmillonésimas', 'milmillonésimo',
    'milmillonésima', 'milmillonésimos', 'milmillonésimas',
}


def extract_keywords(text: str, min_length: int = 3) -> List[str]:
    """
    Extrae palabras clave de un texto en español, eliminando stopwords.
    """
    # Tokenizar: mantener palabras con letras y números
    words = re.findall(r'\b\w+\b', text.lower())
    
    # Filtrar stopwords y palabras cortas
    keywords = []
    for word in words:
        if len(word) >= min_length and word not in SPANISH_STOPWORDS:
            # Verificar que no sea solo números
            if not word.isdigit():
                keywords.append(word)
    
    return list(set(keywords))  # eliminar duplicados


# Configuración por defecto
DEFAULT_TOP_K = 5
COLLECTION_NAME = 'confluence_docs'


@dataclass
class RetrievedChunk:
    """Representa un fragmento recuperado de la base de conocimiento."""
    text: str
    doc_id: str
    title: str
    domain: str
    priority: str
    score: float
    chunk_index: int
    
    def to_dict(self) -> Dict:
        return {
            'text': self.text,
            'doc_id': self.doc_id,
            'title': self.title,
            'domain': self.domain,
            'priority': self.priority,
            'score': self.score,
            'chunk_index': self.chunk_index
        }


def combine_results(embedding_chunks: List[RetrievedChunk], 
                    keyword_chunks: List[RetrievedChunk],
                    top_k: int = 10) -> List[RetrievedChunk]:
    """
    Combina resultados de embeddings y keywords, priorizando chunks que aparecen en ambos.
    """
    # Crear dict por chunk id
    chunks_by_id = {}
    for chunk in embedding_chunks:
        chunks_by_id[chunk.doc_id + f"_{chunk.chunk_index}"] = (chunk, 'embedding')
    
    for chunk in keyword_chunks:
        key = chunk.doc_id + f"_{chunk.chunk_index}"
        if key in chunks_by_id:
            # Ya existe, marcar como híbrido
            chunks_by_id[key] = (chunk, 'hybrid')
        else:
            chunks_by_id[key] = (chunk, 'keyword')
    
    # Ordenar: primero híbridos, luego embedding, luego keyword
    # Dentro de cada grupo, ordenar por score descendente
    hybrid = []
    embedding = []
    keyword = []
    
    for chunk, source in chunks_by_id.values():
        if source == 'hybrid':
            hybrid.append(chunk)
        elif source == 'embedding':
            embedding.append(chunk)
        else:
            keyword.append(chunk)
    
    # Ordenar cada grupo por score
    hybrid.sort(key=lambda x: x.score, reverse=True)
    embedding.sort(key=lambda x: x.score, reverse=True)
    keyword.sort(key=lambda x: x.score, reverse=True)
    
    # Combinar
    combined = hybrid + embedding + keyword
    return combined[:top_k]


@dataclass
class RetrievedChunk:
    """Representa un fragmento recuperado de la base de conocimiento."""
    text: str
    doc_id: str
    title: str
    domain: str
    priority: str
    score: float
    chunk_index: int
    
    def to_dict(self) -> Dict:
        return {
            'text': self.text,
            'doc_id': self.doc_id,
            'title': self.title,
            'domain': self.domain,
            'priority': self.priority,
            'score': self.score,
            'chunk_index': self.chunk_index
        }


class RAGQuerySystem:
    """
    Sistema de consulta RAG para documentación de Confluence.
    """
    
    def __init__(self, persist_dir: str, collection_name: str = COLLECTION_NAME):
        self.persist_dir = persist_dir
        self.collection_name = collection_name
        self.client = None
        self.collection = None
        self.model = None
        self.model_info = None
        
        self._load_collection()
        self._load_model()
    
    def _load_collection(self):
        """Carga la colección de ChromaDB."""
        if not os.path.exists(self.persist_dir):
            raise ValueError(f"El directorio de persistencia no existe: {self.persist_dir}")
        
        self.client = chromadb.PersistentClient(
            path=self.persist_dir,
            settings=Settings(anonymized_telemetry=False)
        )
        
        try:
            self.collection = self.client.get_collection(name=self.collection_name)
        except ValueError:
            raise ValueError(f"Colección '{self.collection_name}' no encontrada. Ejecuta embed.py primero.")
    
    def _load_model(self):
        """Carga el modelo de embeddings."""
        model_info_path = os.path.join(self.persist_dir, '_model_info.json')
        if os.path.exists(model_info_path):
            with open(model_info_path, 'r') as f:
                self.model_info = json.load(f)
            model_name = self.model_info.get('model', 'all-MiniLM-L6-v2')
        else:
            model_name = 'all-MiniLM-L6-v2'
        
        self.model = SentenceTransformer(model_name)
    
    def query(self, question: str, top_k: int = DEFAULT_TOP_K, 
              filters: Optional[Dict] = None) -> List[RetrievedChunk]:
        """
        Consulta la base vectorial y recupera los chunks más similares.
        
        Args:
            question: Pregunta a buscar
            top_k: Número de chunks a recuperar
            filters: Filtros opcionales (domain, priority)
            
        Returns:
            Lista de RetrievedChunk ordenados por relevancia
        """
        # Generar embedding de la consulta
        query_embedding = self.model.encode([question])
        
        # Preparar filtros para ChromaDB
        where = None
        if filters:
            where = {}
            if 'domain' in filters:
                where['domain'] = filters['domain']
            if 'priority' in filters:
                where['priority'] = filters['priority']
        
        # Consultar ChromaDB
        results = self.collection.query(
            query_embeddings=query_embedding.tolist(),
            n_results=top_k,
            where=where if where else None,
            include=['documents', 'metadatas', 'distances']
        )
        
        # Procesar resultados
        chunks = []
        for i in range(len(results['ids'][0])):
            chunk = RetrievedChunk(
                text=results['documents'][0][i],
                doc_id=results['metadatas'][0][i]['doc_id'],
                title=results['metadatas'][0][i]['title'],
                domain=results['metadatas'][0][i]['domain'],
                priority=results['metadatas'][0][i]['priority'],
                score=1.0 - results['distances'][0][i],  # Convertir distancia a similitud
                chunk_index=results['metadatas'][0][i]['chunk_index']
            )
            chunks.append(chunk)
        
        return chunks

    def keyword_search(self, question: str, top_k: int = DEFAULT_TOP_K) -> List[RetrievedChunk]:
        """
        Búsqueda por palabras clave en título, dominio y texto.
        """
        keywords = extract_keywords(question)
        if not keywords:
            return []
        
        # Construir condiciones OR para cada keyword
        from chromadb import WhereDocument
        conditions = []
        for kw in keywords:
            # Buscar en título, dominio y texto
            conditions.append({
                "$or": [
                    {"title": {"$contains": kw}},
                    {"domain": {"$contains": kw}},
                ]
            })
        
        # Si hay múltiples condiciones, combinarlas con OR
        if len(conditions) == 1:
            where_doc = conditions[0]
        else:
            where_doc = {"$or": conditions}
        
        try:
            # Consultar ChromaDB con filtro en metadatos y documentos
            results = self.collection.query(
                query_embeddings=[[0.0] * self.model_info['dimension']] if self.model_info else [[0.0] * 384],
                n_results=top_k,
                where=where_doc,
                include=['documents', 'metadatas']
            )
        except Exception as e:
            # Fallback: buscar solo en título
            try:
                results = self.collection.query(
                    query_embeddings=[[0.0] * self.model_info['dimension']] if self.model_info else [[0.0] * 384],
                    n_results=top_k,
                    where={"title": {"$contains": keywords[0]}},
                    include=['documents', 'metadatas']
                )
            except:
                return []
        
        # Procesar resultados (sin score de distancia)
        chunks = []
        for i in range(len(results['ids'][0])):
            chunk = RetrievedChunk(
                text=results['documents'][0][i],
                doc_id=results['metadatas'][0][i]['doc_id'],
                title=results['metadatas'][0][i]['title'],
                domain=results['metadatas'][0][i]['domain'],
                priority=results['metadatas'][0][i]['priority'],
                score=0.5,  # score base para keyword matches
                chunk_index=results['metadatas'][0][i]['chunk_index']
            )
            chunks.append(chunk)
        
        return chunks
    
    def query_with_context(self, question: str, top_k: int = DEFAULT_TOP_K) -> Dict[str, Any]:
        """
        Consulta y formatea la respuesta con contexto citeable.
        Aplica medidas de seguridad: sanitización, límites, anti prompt-injection.
        
        Returns:
            Dict con 'answer', 'sources' y 'context'
        """
        # Ajustar top_k según límites de seguridad
        if SECURITY_AVAILABLE:
            # Importar aquí para evitar problemas de importación circular
            try:
                from .security import TOP_K as SECURITY_TOP_K
                effective_top_k = min(top_k, SECURITY_TOP_K)
            except ImportError:
                # Fallback si hay problemas de importación
                effective_top_k = min(top_k, 3)
        else:
            effective_top_k = top_k
        
        # Búsqueda por embeddings
        embedding_chunks = self.query(question, effective_top_k)
        # Búsqueda por keywords
        keyword_chunks = self.keyword_search(question, effective_top_k)
        # Combinar resultados
        chunks = combine_results(embedding_chunks, keyword_chunks, effective_top_k)
        
        if not chunks:
            return {
                'answer': 'No se encontró información relevante.',
                'sources': [],
                'context': ''
            }
        
        # Aplicar medidas de seguridad si está disponible
        if SECURITY_AVAILABLE:
            # Convertir chunks a dicts para seguridad
            chunk_dicts = []
            for chunk in chunks:
                chunk_dict = {
                    'text': chunk.text,
                    'title': chunk.title,
                    'domain': chunk.domain,
                    'priority': chunk.priority,
                    'doc_id': chunk.doc_id,
                    'score': chunk.score,
                    'chunk_index': chunk.chunk_index
                }
                # Excluir chunks peligrosos
                if sanitizer.should_exclude_chunk(chunk_dict):
                    continue
                chunk_dicts.append(chunk_dict)
            
            # Aplicar límites de tamaño
            secure_chunks = sanitizer.apply_context_limits(chunk_dicts)
            
            # Sanitizar texto de cada chunk
            for chunk_dict in secure_chunks:
                chunk_dict['text'] = sanitize_context(chunk_dict['text'])
            
            # Reconstruir objetos RetrievedChunk (simplificado)
            chunks = secure_chunks
        else:
            # Sin seguridad, usar chunks originales
            chunk_dicts = [{'text': chunk.text, 'title': chunk.title, 
                           'domain': chunk.domain, 'priority': chunk.priority,
                           'doc_id': chunk.doc_id, 'score': chunk.score,
                           'chunk_index': chunk.chunk_index} for chunk in chunks]
        
        # Construir contexto concatenado
        context_parts = []
        sources = []
        
        for i, chunk in enumerate(chunks):
            if SECURITY_AVAILABLE:
                chunk_text = chunk['text']
                chunk_title = chunk['title']
                chunk_domain = chunk['domain']
                chunk_priority = chunk['priority']
                chunk_doc_id = chunk['doc_id']
                chunk_score = chunk['score']
            else:
                chunk_text = chunk.text
                chunk_title = chunk.title
                chunk_domain = chunk.domain
                chunk_priority = chunk.priority
                chunk_doc_id = chunk.doc_id
                chunk_score = chunk.score
            
            source_id = f"[{i+1}]"
            context_parts.append(f"\n{source_id} {chunk_title} ({chunk_domain}):\n{chunk_text}")
            sources.append({
                'id': source_id,
                'title': chunk_title,
                'domain': chunk_domain,
                'priority': chunk_priority,
                'doc_id': chunk_doc_id,
                'score': round(chunk_score, 3)
            })
        
        context = '\n'.join(context_parts)
        
        # Encapsular contexto si es perfil EXTERNAL
        if SECURITY_AVAILABLE:
            try:
                from .security import RAG_PROFILE
                is_external = RAG_PROFILE == "EXTERNAL"
                final_context = sanitizer.encapsulate_context(context, is_external)
                
                # Log de debug
                sanitizer.debug_log_query(question, chunk_dicts, 
                                          secure_chunks if SECURITY_AVAILABLE else chunk_dicts)
            except ImportError:
                final_context = context
        else:
            final_context = context
        
        return {
            'answer': final_context,
            'sources': sources,
            'context': final_context
        }
    
    def get_stats(self) -> Dict[str, Any]:
        """Obtiene estadísticas de la base de conocimiento."""
        count = self.collection.count()
        
        # Contar por dominio
        try:
            results = self.collection.query(
                query_embeddings=[[0.0] * self.model_info['dimension']],
                n_results=1,
                include=['metadatas']
            )
            domains = {}
            for meta in results['metadatas'][0]:
                d = meta.get('domain', 'Unknown')
                domains[d] = domains.get(d, 0) + 1
        except:
            domains = {}
        
        return {
            'total_chunks': count,
            'model': self.model_info.get('model', 'unknown') if self.model_info else 'unknown',
            'dimension': self.model_info.get('dimension', 0) if self.model_info else 0,
            'domains': domains
        }


def query_rag(question: str, top_k: int = 5, 
              persist_dir: str = '/home/manpac/.openclaw/workspace/agents/qubika/rag/chromadb') -> Dict[str, Any]:
    """
    Función simple para consultar el sistema RAG.
    
    Args:
        question: Pregunta a buscar
        top_k: Número de resultados
        persist_dir: Directorio de ChromaDB
        
    Returns:
        Dict con 'answer', 'sources' y 'context'
    """
    system = RAGQuerySystem(persist_dir)
    return system.query_with_context(question, top_k)


def interactive_query():
    """Modo interactivo de consulta."""
    print("="*60)
    print("SISTEMA RAG - Documentación de Bancard")
    print("="*60)
    print("Escribe tu pregunta (Ctrl+C para salir)\n")
    
    persist_dir = '/home/manpac/.openclaw/workspace/agents/qubika/rag/chromadb'
    
    try:
        system = RAGQuerySystem(persist_dir)
        stats = system.get_stats()
        print(f"Base de conocimiento cargada:")
        print(f"  - Total chunks: {stats['total_chunks']}")
        print(f"  - Modelo: {stats['model']}")
        print()
        
        while True:
            question = input("❓ ").strip()
            if not question:
                continue
            
            print("\n🔍 Buscando...")
            result = system.query_with_context(question, top_k=5)
            
            print("\n" + "="*60)
            print("RESULTADOS")
            print("="*60)
            print(result['answer'])
            
            print("\n📋 FUENTES:")
            for source in result['sources']:
                print(f"  {source['id']} {source['title']} ({source['domain']}) - Score: {source['score']}")
            
            print()
            
    except KeyboardInterrupt:
        print("\n\n👋 ¡Hasta luego!")
    except Exception as e:
        print(f"\nError: {e}")


if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1:
        # Modo CLI: pasar pregunta como argumento
        question = ' '.join(sys.argv[1:])
        result = query_rag(question)
        print(result['answer'])
        print("\n📋 Fuentes:")
        for source in result['sources']:
            print(f"  - {source['title']} ({source['domain']})")
    else:
        # Modo interactivo
        interactive_query()