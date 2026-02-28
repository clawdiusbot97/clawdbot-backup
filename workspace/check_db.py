import sqlite3
import sys

db_path = '/home/manpac/.openclaw/workspace/data/finance/itau/transactions.sqlite'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# get tables
cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cur.fetchall()
print("Tables:", tables)

for table in tables:
    table_name = table[0]
    cur.execute(f"PRAGMA table_info({table_name});")
    cols = cur.fetchall()
    print(f"\n{table_name} columns:")
    for col in cols:
        print(col)
    # count rows
    cur.execute(f"SELECT COUNT(*) FROM {table_name};")
    count = cur.fetchone()[0]
    print(f"Row count: {count}")
    if count > 0:
        cur.execute(f"SELECT * FROM {table_name} LIMIT 3;")
        rows = cur.fetchall()
        for row in rows:
            print(row)

conn.close()