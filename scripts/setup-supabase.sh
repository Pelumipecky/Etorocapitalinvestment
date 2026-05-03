#!/usr/bin/env bash
#
# setup-supabase.sh
#
# POSIX shell helper to create a local `supabase-config.js` from the example.
# Usage:
#   ./scripts/setup-supabase.sh
#
EXAMPLE="$(dirname "$0")/../supabase-config.example.js"
TARGET="$(dirname "$0")/../supabase-config.js"

if [ ! -f "$EXAMPLE" ]; then
  echo "Example file not found: $EXAMPLE" >&2
  exit 1
fi

if [ -f "$TARGET" ]; then
  echo "A local supabase-config.js already exists at $TARGET. Aborting to avoid overwrite."
  echo "If you want to replace it, delete it first: rm '$TARGET'"
  exit 0
fi

cp "$EXAMPLE" "$TARGET"
echo "Created local config: $TARGET"
echo "Open the file and replace placeholders with your Supabase project's URL and anon key."
