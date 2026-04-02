#!/bin/bash
# Sync wet-lab and lab-safety content from Obsidian vault to this repo.
# Run this after editing protocols in Obsidian to push changes to the wiki.

VAULT="/Users/greymonroe/Dropbox/myapps/grey-matter/Obsidian_ProfessorHQ"
WIKI="$(cd "$(dirname "$0")" && pwd)"

echo "Syncing from vault to wiki..."

# Sync wet-lab protocols (exclude CLAUDE.md and _supplemental)
rsync -av --delete \
  --exclude='CLAUDE.md' \
  --exclude='_supplemental/' \
  --exclude='.DS_Store' \
  "$VAULT/wet-lab/" "$WIKI/docs/wet-lab/"

# Sync lab-safety
rsync -av --delete \
  --exclude='.DS_Store' \
  "$VAULT/lab-safety/" "$WIKI/docs/lab-safety/"

# Rename files with spaces to kebab-case
cd "$WIKI/docs/lab-safety"
for f in *\ *; do
  [ -e "$f" ] && mv "$f" "$(echo "$f" | tr ' ' '-' | tr '[:upper:]' '[:lower:]')"
done

echo "Done. Review changes with: cd $WIKI && git diff"
