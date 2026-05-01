#!/bin/bash
set -x  # Enable POSIX shell debug
INPUT=$(cat)


#  log prompt and timestamp to a file
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "[$TIMESTAMP] $INPUT" >> prompt_log.txt
