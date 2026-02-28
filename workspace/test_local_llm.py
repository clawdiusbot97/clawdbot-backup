import sys
sys.path.insert(0, '/home/manpac/.openclaw/workspace/skills/local_llm')
from run import LocalLLM

llm = LocalLLM()
result = llm.infer("Categorize 'Uber Trip' into: food, transport, shopping, health, services, entertainment, other. Reply with only the category name.")
print(result)