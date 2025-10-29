- Run keep-sorted on words.js with command `~/go/bin/keep-sorted --mode fix words.js`

## Auto-formatting

A pre-commit hook is configured in `.git/hooks/pre-commit` that automatically formats files before each commit:

1. **keep-sorted**: Runs on `words.js` to keep the word list alphabetically sorted
2. **Prettier**: Formats all `.js`, `.css`, and `.html` files

The hook will automatically stage any formatting changes, so you don't need to run these tools manually.

If you need to recreate the hook, run:
```bash
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash

# Run keep-sorted on words.js
echo "Running keep-sorted on words.js..."
~/go/bin/keep-sorted --mode fix words.js
git add words.js

# Run Prettier on JS, CSS, and HTML files
echo "Running Prettier on JS, CSS, and HTML files..."
npx prettier --write "*.js" "*.css" "*.html"
git add -u

exit 0
EOF
chmod +x .git/hooks/pre-commit
```