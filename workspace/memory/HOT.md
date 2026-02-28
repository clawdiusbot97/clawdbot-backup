# HOT Memory - Always Loaded
# 
# Rules in this file are loaded on EVERY session start.
# Only promote rules here after explicit confirmation.
# Format: One rule per line, markdown bullet, stable line numbers.
# 
# To add a rule via correction flow:
# 1. Correction logged → corrections.jsonl
# 2. Count tracked → corrections_index.json  
# 3. On 3rd occurrence → prompt user for promotion
# 4. If confirmed → append to HOT.md or contexts/<name>.md
#
# Applied rules should cite: "Applied rule: memory/HOT.md:L{line}"

# Identity (permanent)

# Output Preferences (permanent)

# Safety (permanent)

- Name: Manuel Pacheco (Manu)
- Timezone: America/Montevideo (GMT-3)
- Country: Uruguay
- Prefer concise, structured, actionable responses
- Prefer checklists, clear next steps, implementation-ready outputs
- End important responses with 1-3 next actions
- Technical naming/code in English; client-facing messages/test data often in Spanish
- Never store secrets/tokens/passwords in any memory file
- Denylist guard active: reject storing patterns matching: password, token, key, secret, apikey, credential
