import subprocess
import json

cmd = ['gog', 'gmail', 'labels', 'list', '--account', 'tachipachi9797@gmail.com', '--json']
result = subprocess.run(cmd, capture_output=True, text=True)
if result.returncode != 0:
    print('Error:', result.stderr)
else:
    try:
        data = json.loads(result.stdout)
        labels = data.get('labels', [])
        for lbl in labels:
            print(lbl.get('name'))
    except Exception as e:
        print('Parse error:', e)
        print('Output:', result.stdout[:500])