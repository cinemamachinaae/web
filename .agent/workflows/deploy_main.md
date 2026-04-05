---
description: Stage, commit, and push the current Cinema Machina site to main
---
// turbo-all
1. Run `git status`
2. Run `git add .`
3. Run `git diff --cached --stat`
4. Generate a concise production-safe commit message based on the staged changes.
5. Run `git commit -m "<generated_message>"`
6. Run `git push origin main`
7. Summarize what was deployed and mention that Vercel should auto-deploy from GitHub.
