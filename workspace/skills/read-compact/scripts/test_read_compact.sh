#!/bin/bash
# Test suite for read_compact wrapper

set -euo pipefail

WRAPPER="$(dirname "$0")/read_compact.sh"
ARTIFACTS_DIR="/home/manpac/.openclaw/workspace/artifacts/raw/read"

echo "🧪 Testing read_compact wrapper"
echo "Wrapper: $WRAPPER"
echo ""

# Create test files in a temporary directory
TESTDIR=$(mktemp -d)
cd "$TESTDIR"

# Test 1: Small file (should pass through)
echo "=== Test 1: Small file (below threshold) ==="
echo "Hello, world!" > small.txt
OUTPUT=$("$WRAPPER" "small.txt")
echo "Output:"
echo "$OUTPUT"
echo "Expected: 'Hello, world!'"
if [[ "$OUTPUT" == "Hello, world!" ]]; then
    echo "✅ PASS"
else
    echo "❌ FAIL"
    exit 1
fi
echo ""

# Test 2: Large file by line count (seq 1 200)
echo "=== Test 2: Large file (200 lines) ==="
seq 1 200 > large_lines.txt
OUTPUT=$("$WRAPPER" "large_lines.txt")
LINE_COUNT=$(echo "$OUTPUT" | wc -l)
echo "Output line count: $LINE_COUNT"
echo "First 3 lines of output:"
echo "$OUTPUT" | head -3
echo "..."
echo "Last 3 lines:"
echo "$OUTPUT" | tail -3
if [[ $LINE_COUNT -lt 50 ]]; then
    echo "✅ PASS (output compacted, likely summary)"
else
    echo "❌ FAIL (output not compacted)"
    exit 1
fi
echo ""

# Test 3: Large file by character count (generate 20KB single line)
echo "=== Test 3: Large file (20KB chars, single line) ==="
dd if=/dev/zero bs=1024 count=20 2>/dev/null | tr '\0' 'a' > large_chars.txt
OUTPUT=$("$WRAPPER" "large_chars.txt")
CHAR_COUNT=$(echo "$OUTPUT" | wc -c)
echo "Output char count: $CHAR_COUNT"
echo "First 100 chars:"
echo "$OUTPUT" | head -c 100
echo "..."
if [[ $CHAR_COUNT -lt 10000 ]]; then
    echo "✅ PASS (output compacted)"
else
    echo "❌ FAIL (output not compacted)"
    exit 1
fi
echo ""

# Test 4: Offset and limit handling
echo "=== Test 4: Offset and limit ==="
seq 1 30 > offset_test.txt
OUTPUT=$("$WRAPPER" "offset_test.txt" 10 5)
EXPECTED="10
11
12
13
14"
echo "Output:"
echo "$OUTPUT"
echo "Expected:"
echo "$EXPECTED"
if [[ "$OUTPUT" == "$EXPECTED" ]]; then
    echo "✅ PASS"
else
    echo "❌ FAIL"
    exit 1
fi
echo ""

# Test 5: Error handling (file not found)
echo "=== Test 5: File not found ==="
OUTPUT=$("$WRAPPER" "nonexistent_file.txt" 2>&1 || true)
if echo "$OUTPUT" | grep -q "Error: File not found"; then
    echo "✅ PASS (error captured)"
else
    echo "❌ FAIL (error not shown)"
    exit 1
fi
echo ""

# Test 6: Verify artifact creation
echo "=== Test 6: Artifact file creation ==="
ARTIFACT_COUNT=$(find "$ARTIFACTS_DIR" -name "*.txt" -type f | wc -l)
echo "Existing artifacts: $ARTIFACT_COUNT"
# Run a large read to trigger artifact creation
"$WRAPPER" "large_lines.txt" > /dev/null
NEW_COUNT=$(find "$ARTIFACTS_DIR" -name "*.txt" -type f | wc -l)
if [[ $NEW_COUNT -gt $ARTIFACT_COUNT ]]; then
    echo "✅ PASS (artifact created)"
    LATEST=$(find "$ARTIFACTS_DIR" -name "*.txt" -type f | sort | tail -1)
    echo "Latest artifact: $LATEST"
    echo "First 5 lines of artifact:"
    head -10 "$LATEST"
else
    echo "❌ FAIL (no artifact created)"
    exit 1
fi
echo ""

# Cleanup
cd /
rm -rf "$TESTDIR"

echo "🎉 All tests passed!"
echo "Wrapper correctly compacts large reads and preserves small ones."