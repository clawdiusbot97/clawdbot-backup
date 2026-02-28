#!/usr/bin/env python3
"""
Local LLM inference wrapper.
Supports Ollama (preferred) and llama‑cpp‑python backends.
Starts model on demand, caches responses, provides fallback.
"""

import os
import json
import hashlib
import time
import logging
import subprocess
import sys
from pathlib import Path
from typing import Dict, Optional, Any

# -------------------------------------------------------------------
# Configuration (can be overridden by environment)
# -------------------------------------------------------------------
CONFIG = {
    "backend": os.getenv("LOCAL_LLM_BACKEND", "ollama"),  # ollama | llama.cpp | disabled
    "model": os.getenv("LOCAL_LLM_MODEL", "phi3:mini"),
    "model_path": os.getenv("LOCAL_LLM_MODEL_PATH", 
                           os.path.expanduser("~/.cache/llama/Phi-3-mini-4k-instruct-q4_k_m.gguf")),
    "host": os.getenv("LOCAL_LLM_HOST", "http://localhost:11434"),
    "cache_ttl": int(os.getenv("LOCAL_LLM_CACHE_TTL", "86400")),  # 24h
    "max_tokens": int(os.getenv("LOCAL_LLM_MAX_TOKENS", "256")),
    "context": int(os.getenv("LOCAL_LLM_CONTEXT", "2048")),
    "temperature": float(os.getenv("LOCAL_LLM_TEMPERATURE", "0.2")),
    "timeout": int(os.getenv("LOCAL_LLM_TIMEOUT", "30")),
    "cache_dir": os.getenv("LOCAL_LLM_CACHE_DIR", 
                          os.path.join(os.path.dirname(__file__), "../../data/cache/local_llm")),
}

# Ensure cache directory exists
Path(CONFIG["cache_dir"]).mkdir(parents=True, exist_ok=True)

# -------------------------------------------------------------------
# Logging
# -------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] local_llm: %(message)s",
    handlers=[
        logging.FileHandler(os.path.join(os.path.dirname(__file__), "../../logs/local_llm.log")),
        logging.StreamHandler(sys.stderr)
    ]
)
logger = logging.getLogger(__name__)

# -------------------------------------------------------------------
# Cache
# -------------------------------------------------------------------
def cache_key(prompt: str, params: Dict) -> str:
    """Generate SHA256 key from prompt and inference parameters."""
    content = f"{prompt}:{json.dumps(params, sort_keys=True)}"
    return hashlib.sha256(content.encode()).hexdigest()

def cache_get(key: str) -> Optional[Dict]:
    """Retrieve cached response if exists and not expired."""
    cache_file = Path(CONFIG["cache_dir"]) / f"{key}.json"
    if not cache_file.exists():
        return None
    try:
        with open(cache_file, "r", encoding="utf-8") as f:
            entry = json.load(f)
        if time.time() - entry["timestamp"] > CONFIG["cache_ttl"]:
            cache_file.unlink()
            return None
        return entry
    except Exception as e:
        logger.warning(f"Cache read failed: {e}")
        return None

def cache_set(key: str, prompt: str, response: str, backend: str):
    """Store response in cache."""
    cache_file = Path(CONFIG["cache_dir"]) / f"{key}.json"
    try:
        entry = {
            "prompt": prompt,
            "response": response,
            "backend": backend,
            "timestamp": time.time(),
            "ttl": CONFIG["cache_ttl"]
        }
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(entry, f, ensure_ascii=False)
    except Exception as e:
        logger.warning(f"Cache write failed: {e}")

# -------------------------------------------------------------------
# Backend: Ollama
# -------------------------------------------------------------------
class OllamaBackend:
    """Communicate with Ollama's REST API."""
    
    def __init__(self):
        import requests
        self.session = requests.Session()
        self.base_url = CONFIG["host"].rstrip("/")
    
    def is_available(self) -> bool:
        """Check if Ollama server is reachable."""
        try:
            resp = self.session.get(f"{self.base_url}/api/tags", timeout=5)
            return resp.status_code == 200
        except Exception:
            return False
    
    def infer(self, prompt: str, max_tokens: int, temperature: float) -> str:
        """Generate completion via Ollama."""
        import requests
        payload = {
            "model": CONFIG["model"],
            "prompt": prompt,
            "stream": False,
            "options": {
                "num_ctx": CONFIG["context"],
                "num_predict": max_tokens,
                "temperature": temperature,
            }
        }
        try:
            resp = self.session.post(
                f"{self.base_url}/api/generate",
                json=payload,
                timeout=CONFIG["timeout"]
            )
            resp.raise_for_status()
            data = resp.json()
            return data.get("response", "").strip()
        except requests.exceptions.RequestException as e:
            logger.error(f"Ollama request failed: {e}")
            raise RuntimeError(f"Ollama error: {e}")

# -------------------------------------------------------------------
# Backend: llama.cpp (via llama-cpp-python)
# -------------------------------------------------------------------
class LlamaCppBackend:
    """Direct integration with llama-cpp-python."""
    
    def __init__(self):
        try:
            from llama_cpp import Llama
        except ImportError:
            raise RuntimeError("llama-cpp-python not installed")
        
        model_path = CONFIG["model_path"]
        if not os.path.exists(model_path):
            raise RuntimeError(f"Model file not found: {model_path}")
        
        self.llm = Llama(
            model_path=model_path,
            n_ctx=CONFIG["context"],
            n_threads=2,  # conservative for 8GB RAM
            verbose=False
        )
    
    def is_available(self) -> bool:
        """Model loaded successfully."""
        return self.llm is not None
    
    def infer(self, prompt: str, max_tokens: int, temperature: float) -> str:
        """Generate completion directly."""
        try:
            output = self.llm(
                prompt=prompt,
                max_tokens=max_tokens,
                temperature=temperature,
                stop=["\n", "###", "Human:", "Assistant:"],
                echo=False
            )
            return output["choices"][0]["text"].strip()
        except Exception as e:
            logger.error(f"llama.cpp inference failed: {e}")
            raise RuntimeError(f"llama.cpp error: {e}")

# -------------------------------------------------------------------
# Main LLM class
# -------------------------------------------------------------------
class LocalLLM:
    """Unified interface for local LLM inference."""
    
    def __init__(self):
        self.backend_name = CONFIG["backend"]
        self.backend = None
        self._init_backend()
    
    def _init_backend(self):
        """Initialize the selected backend."""
        if self.backend_name == "ollama":
            try:
                self.backend = OllamaBackend()
                if self.backend.is_available():
                    logger.info("Ollama backend ready")
                    return
                else:
                    logger.warning("Ollama server not reachable")
            except Exception as e:
                logger.warning(f"Ollama init failed: {e}")
        
        if self.backend_name == "llama.cpp":
            try:
                self.backend = LlamaCppBackend()
                logger.info("llama.cpp backend ready")
                return
            except Exception as e:
                logger.warning(f"llama.cpp init failed: {e}")
        
        # If both fail, set backend to None
        self.backend = None
        logger.warning("No local LLM backend available")
    
    def infer(self, 
              prompt: str, 
              max_tokens: Optional[int] = None,
              temperature: Optional[float] = None,
              timeout: Optional[int] = None) -> Dict[str, Any]:
        """
        Generate a completion for the given prompt.
        
        Returns:
            {
                "text": str,          # generated text (empty on error)
                "cached": bool,       # True if served from cache
                "backend": str,       # "ollama", "llama.cpp", "error"
                "error": str,         # error message if any
                "fallback_suggestion": str  # suggested fallback action
            }
        """
        # Build parameter dict for cache key
        params = {
            "max_tokens": max_tokens or CONFIG["max_tokens"],
            "temperature": temperature or CONFIG["temperature"],
            "timeout": timeout or CONFIG["timeout"]
        }
        
        # Check cache first
        key = cache_key(prompt, params)
        cached = cache_get(key)
        if cached:
            logger.info(f"Cache hit for prompt: {prompt[:50]}...")
            return {
                "text": cached["response"],
                "cached": True,
                "backend": cached["backend"],
                "error": None,
                "fallback_suggestion": None
            }
        
        # If no backend available, return error with fallback suggestion
        if self.backend is None:
            error_msg = f"{self.backend_name} backend not available"
            logger.error(error_msg)
            return {
                "text": "",
                "cached": False,
                "backend": "error",
                "error": error_msg,
                "fallback_suggestion": "Use keyword‑based categorization or rule‑based fallback."
            }
        
        # Perform inference
        try:
            start = time.time()
            response = self.backend.infer(
                prompt=prompt,
                max_tokens=params["max_tokens"],
                temperature=params["temperature"]
            )
            elapsed = time.time() - start
            logger.info(f"Inference succeeded in {elapsed:.2f}s: {response[:50]}...")
            
            # Cache the result
            cache_set(key, prompt, response, self.backend_name)
            
            return {
                "text": response,
                "cached": False,
                "backend": self.backend_name,
                "error": None,
                "fallback_suggestion": None
            }
            
        except Exception as e:
            error_msg = str(e)
            logger.error(f"Inference failed: {error_msg}")
            return {
                "text": "",
                "cached": False,
                "backend": "error",
                "error": error_msg,
                "fallback_suggestion": "Switch to keyword matching or regex‑based logic."
            }

# -------------------------------------------------------------------
# Command‑line interface
# -------------------------------------------------------------------
def main():
    if len(sys.argv) < 2:
        print("Usage: python run.py <prompt> [max_tokens] [temperature]")
        sys.exit(1)
    
    prompt = sys.argv[1]
    max_tokens = int(sys.argv[2]) if len(sys.argv) > 2 else None
    temperature = float(sys.argv[3]) if len(sys.argv) > 3 else None
    
    llm = LocalLLM()
    result = llm.infer(prompt, max_tokens=max_tokens, temperature=temperature)
    
    if result["error"]:
        print(f"ERROR: {result['error']}")
        print(f"Fallback: {result['fallback_suggestion']}")
        sys.exit(1)
    else:
        print(result["text"])

if __name__ == "__main__":
    main()