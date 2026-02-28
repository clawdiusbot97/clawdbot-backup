"""
extract.py - Extrae texto plano de los JSONs de Confluence

Convierte el HTML del body a markdown/texto plano y guarda en archivos separados.
"""

import json
import re
import os
from pathlib import Path
from html.parser import HTMLParser
from typing import Optional


class ConfluenceHTMLToText(HTMLParser):
    """Parser para convertir HTML de Confluence a texto plano."""
    
    def __init__(self):
        super().__init__()
        self.result = []
        self.skip_tags = {'toc', 'acstructured-macro', 'acparameter', 'aclink', 
                         'riuser', 'ripage', 'rimacro', 'acemoticon'}
        self.current_tag = ''
        self.in_skip_tag = False
        self.skip_depth = 0
    
    def handle_starttag(self, tag, attrs):
        tag_lower = tag.lower()
        if tag_lower in self.skip_tags:
            self.in_skip_tag = True
            self.skip_depth = 1
        else:
            self.current_tag = tag_lower
            
    def handle_endtag(self, tag):
        tag_lower = tag.lower()
        if self.in_skip_tag:
            if tag_lower in self.skip_tags:
                self.skip_depth -= 1
                if self.skip_depth == 0:
                    self.in_skip_tag = False
            return
        
        if tag_lower in ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
                         'li', 'td', 'th', 'tr', 'table']:
            self.result.append('\n')
        elif tag_lower == 'br':
            self.result.append('\n')
    
    def handle_data(self, data):
        if not self.in_skip_tag:
            text = data.strip()
            if text:
                self.result.append(text)
    
    def handle_entityref(self, name):
        entities = {
            'nbsp': ' ', 'amp': '&', 'lt': '<', 'gt': '>', 'quot': '"',
            'apos': "'", 'ndash': '–', 'mdash': '—'
        }
        self.result.append(entities.get(name, f'&{name};'))
    
    def handle_charref(self, name):
        try:
            self.result.append(chr(int(name)))
        except ValueError:
            pass
    
    def get_text(self) -> str:
        # Limpiar múltiples newlines
        text = re.sub(r'\n{3,}', '\n\n', ''.join(self.result))
        # Limpiar espacios múltiples
        text = re.sub(r' {2,}', ' ', text)
        return text.strip()


def extract_text_from_html(html_content: str) -> str:
    """Convierte HTML de Confluence a texto plano."""
    parser = ConfluenceHTMLToText()
    try:
        parser.feed(html_content)
        return parser.get_text()
    except Exception:
        # Fallback: strip simple tags
        text = re.sub(r'<[^>]+>', '', html_content)
        text = re.sub(r'&[a-z]+;', ' ', text)
        text = re.sub(r'\s+', ' ', text)
        return text.strip()


def load_confluence_index(index_path: str) -> dict:
    """Carga el índice curado de Confluence para obtener dominios y prioridades."""
    index_data = {}
    try:
        with open(index_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Parsear las tablas del índice (formato markdown simple)
        current_domain = None
        for line in content.split('\n'):
            if line.startswith('## '):
                current_domain = line.replace('## ', '').strip()
            elif re.match(r'^\|.*Alta.*\|', line) or re.match(r'^\|.*Media.*\|', line) or re.match(r'^\|.*Baja.*\|', line):
                parts = [p.strip() for p in line.split('|')[1:-1]]
                if len(parts) >= 3:
                    priority = parts[0]
                    page_id = parts[1]
                    title = parts[2]
                    if page_id.isdigit():
                        index_data[page_id] = {
                            'domain': current_domain or 'Unknown',
                            'priority': priority,
                            'title': title
                        }
    except Exception as e:
        print(f"Warning: No se pudo cargar el índice: {e}")
    return index_data


def process_json_files(input_dir: str, output_dir: str, index_path: str):
    """Procesa todos los archivos JSON de Confluence y extrae texto."""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    
    # Cargar índice curado
    index_data = load_confluence_index(index_path)
    
    json_files = list(input_path.glob('*.json'))
    print(f"Encontrados {len(json_files)} archivos JSON")
    
    extracted = []
    
    for json_file in json_files:
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Extraer campos principales
            page_id = str(data.get('id', json_file.stem))
            title = data.get('title', 'Sin título')
            
            # Extraer body HTML
            body_html = ''
            if 'body' in data:
                if 'storage' in data['body']:
                    body_html = data['body']['storage'].get('value', '')
                elif 'view' in data['body']:
                    body_html = data['body']['view'].get('value', '')
            
            # Convertir a texto plano
            text = extract_text_from_html(body_html)
            
            if not text.strip():
                print(f"  [SKIP] {title}: texto vacío")
                continue
            
            # Obtener dominio y prioridad del índice
            index_info = index_data.get(page_id, {})
            domain = index_info.get('domain', 'General')
            priority = index_info.get('priority', 'Media')
            
            # Crear documento estructurado
            doc = {
                'id': page_id,
                'title': title,
                'text': text,
                'domain': domain,
                'priority': priority,
                'source_file': json_file.name
            }
            
            extracted.append(doc)
            
            # Guardar texto plano individual
            text_file = output_path / f"{page_id}.txt"
            with open(text_file, 'w', encoding='utf-8') as f:
                f.write(f"TITLE: {title}\n")
                f.write(f"DOMAIN: {domain}\n")
                f.write(f"PRIORITY: {priority}\n")
                f.write(f"ID: {page_id}\n")
                f.write(f"SOURCE: {json_file.name}\n")
                f.write("\n---\n\n")
                f.write(text)
            
        except json.JSONDecodeError as e:
            print(f"  [ERROR] {json_file}: JSON inválido - {e}")
        except Exception as e:
            print(f"  [ERROR] {json_file}: {e}")
    
    # Guardar metadatos combinados
    metadata_file = output_path / "_metadata.json"
    with open(metadata_file, 'w', encoding='utf-8') as f:
        json.dump(extracted, f, ensure_ascii=False, indent=2)
    
    print(f"\nExtracción completada:")
    print(f"  - Documentos extraídos: {len(extracted)}")
    print(f"  - Archivos guardados en: {output_dir}")
    
    # Resumen por dominio
    domains = {}
    for doc in extracted:
        d = doc['domain']
        domains[d] = domains.get(d, 0) + 1
    print(f"  - Distribución por dominio: {domains}")
    
    return extracted


if __name__ == '__main__':
    INPUT_DIR = '/home/manpac/.openclaw/workspace/agents/qubika/context/raw/confluence-export/confluence-export'
    OUTPUT_DIR = '/home/manpac/.openclaw/workspace/agents/qubika/rag/extracted'
    INDEX_PATH = '/home/manpac/.openclaw/workspace/agents/qubika/context/CONFLUENCE_INDEX.md'
    
    process_json_files(INPUT_DIR, OUTPUT_DIR, INDEX_PATH)