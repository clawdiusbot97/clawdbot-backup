#!/bin/bash
cd /home/manpac/.openclaw
/usr/bin/env node workspace/rotate-on-rate-limit.js 2>&1 | logger -t openclaw-rotate