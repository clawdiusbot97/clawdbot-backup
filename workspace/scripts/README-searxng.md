# SearXNG local - scripts rápidos

Base URL usada por los scripts: `http://127.0.0.1:8088`

## Scripts

- `search.sh "query" [n]`
  - Consulta SearXNG en JSON (`format=json`)
  - `n` opcional, por defecto `10`
  - Devuelve JSON crudo

- `search-top5.sh "query"`
  - Muestra top 5 en formato legible:
    - título
    - URL
    - snippet (`content`)
  - Requiere `jq`

## Ejemplos

```bash
# JSON crudo (10 resultados por defecto)
./scripts/search.sh "openclaw thesis insurance"

# JSON crudo (20 resultados)
./scripts/search.sh "openclaw thesis insurance" 20

# Top 5 legible
./scripts/search-top5.sh "openclaw thesis insurance"
```

## Troubleshooting básico

- **SearXNG caído / no responde**
  - Verifica que el servicio esté arriba en `http://127.0.0.1:8088`
  - Si usas Docker, revisa:
    - contenedor en ejecución
    - puerto `8088` publicado
    - logs del contenedor

- **Permisos con Docker**
  - Si aparece error de permisos al gestionar contenedores, agrega tu usuario al grupo `docker` o usa el método recomendado por tu sistema.

- **`jq` faltante**
  - Instálalo y vuelve a ejecutar:
    - Debian/Ubuntu: `apt install jq`
    - Fedora: `dnf install jq`
    - Arch: `pacman -S jq`
