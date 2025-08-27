#!/bin/bash

# Auto Push Script for MOGENT Project
# This script automatically commits and pushes changes to GitHub

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Auto Push Process...${NC}"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Not in a git repository${NC}"
    exit 1
fi

# Check if there are any changes
if git diff --quiet && git diff --staged --quiet; then
    echo -e "${YELLOW}📝 No changes to commit${NC}"
    exit 0
fi

# Get current branch
CURRENT_BRANCH=$(git branch --show-current)
echo -e "${GREEN}📍 Current branch: ${CURRENT_BRANCH}${NC}"

# Add all changes
echo -e "${GREEN}📦 Adding all changes...${NC}"
git add .

# Get list of changed files
CHANGED_FILES=$(git diff --cached --name-only)
echo -e "${GREEN}📄 Changed files:${NC}"
echo "$CHANGED_FILES"

# Create commit message with timestamp
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
COMMIT_MESSAGE="Auto-commit: Update files at $TIMESTAMP

Changed files:
$CHANGED_FILES"

# Commit changes
echo -e "${GREEN}💾 Committing changes...${NC}"
git commit -m "$COMMIT_MESSAGE"

# Push to remote
echo -e "${GREEN}🚀 Pushing to remote...${NC}"
if git push origin $CURRENT_BRANCH; then
    echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
else
    echo -e "${RED}❌ Failed to push to GitHub${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Auto push completed successfully!${NC}" 