#!/bin/bash
# Test suite for exec_compact wrapper

set -euo pipefail

WRAPPER="$(dirname "$0")/exec_compact.sh"
ARTIFACTS_DIR="/home/manpac/.openclaw/workspace/artifacts/raw/exec"

echo "🧪 Testing exec_compact wrapper"
echo "Wrapper: $WRAPPER"
echo ""

# Test 1: Small output (should pass through)
echo "=== Test 1: Small output (below threshold) ==="
OUTPUT=$("$WRAPPER" "echo 'Hello, world!'")
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

# Test 2: Large output by line count (seq 1 200)
echo "=== Test 2: Large output (200 lines) ==="
OUTPUT=$("$WRAPPER" "seq 1 200")
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

# Test 3: Large output by character count (generate 20KB)
echo "=== Test 3: Large output (20KB chars) ==="
OUTPUT=$("$WRAPPER" "dd if=/dev/zero bs=1024 count=20 2>/dev/null | tr '\\0' 'a'")
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

# Test 4: Error output
echo "=== Test 4: Command with error ==="
OUTPUT=$("$WRAPPER" "ls /nonexistent_directory_xyz123" 2>&1)
echo "Output:"
echo "$OUTPUT"
if echo "$OUTPUT" | grep -q "Error\|error\|No such file"; then
    echo "✅ PASS (error captured in summary)"
else
    echo "⚠️  WARN (error not explicitly shown)"
fi
echo ""

# Test 5: Verify artifact creation
echo "=== Test 5: Artifact file creation ==="
ARTIFACT_COUNT=$(find "$ARTIFACTS_DIR" -name "*.log" -type f | wc -l)
echo "Existing artifacts: $ARTIFACT_COUNT"
# Run a large command to trigger artifact creation
"$WRAPPER" "seq 1 300" > /dev/null
NEW_COUNT=$(find "$ARTIFACTS_DIR" -name "*.log" -type f | wc -l)
if [[ $NEW_COUNT -gt $ARTIFACT_COUNT ]]; then
    echo "✅ PASS (artifact created)"
    LATEST=$(find "$ARTIFACTS_DIR" -name "*.log" -type f | sort | tail -1)
    echo "Latest artifact: $LATEST"
    echo "First 5 lines of artifact:"
    head -10 "$LATEST"
else
    echo "❌ FAIL (no artifact created)"
    exit 1
fi
echo ""

echo "🎉 All tests passed!"
echo "Wrapper correctly compacts large outputs and preserves small ones."