# Music Ingest Skill

## Purpose
Ingest raw music inputs (lyrics, melodies, references) and normalize to library records.

## Input
```
- source: "url | file | text"
- content: string
- metadata: {artist, title, genre_tags, source_url}
```

## Processing
```yaml
1. Extract and validate content
2. Apply genre tags from taxonomy
3. Normalize to library schema
4. Write to music/library.jsonl
5. Update checkpoint: music/checkpoints/ingest_{id}.json
```

## Output Schema (Library Record)
```json
{
  "id": "uuid",
  "source": "string",
  "ingested_at": "ISO8601",
  "artist": "string",
  "title": "string",
  "genre": "string",
  "subgenre": "string",
  "bpm": null,
  "mood": null,
  "energy": null,
  "tags": [],
  "raw_content": "string",
  "normalized": false,
  "checksum": "sha256"
}
```

## Commands
```
ingest(url=string) -> record_id
ingest(file=path) -> record_id
ingest(text=string, metadata={}) -> record_id
normalize(record_id) -> normalized_record
```

## Example
```bash
ingest(url="https://spotify.com/track/xxx", metadata={"title":"Song"})
```