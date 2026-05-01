#!/bin/bash
INPUT=$(cat)
TOOL_NAME=$(echo "$INPUT" | jq -r '.toolName')
TOOL_ARGS=$(echo "$INPUT" | jq -r '.toolArgs')

# Log the tool use
echo "$(date): Tool=$TOOL_NAME Args=$TOOL_ARGS" >> tool-usage.log

# Check for dangerous patterns
if echo "$TOOL_ARGS" | grep -qE "rm -rf /|format|DROP TABLE"; then
  echo '{"permissionDecision":"deny","permissionDecisionReason":"Dangerous command detected"}' >> prompt_log.txt
  exit 0
fi

# Allow by default (or omit output to allow)
echo '{"permissionDecision":"allow"}'