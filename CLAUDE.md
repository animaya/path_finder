# Development Workflow

**Always use `bun`, not `npm`.**

## ⚠️ CRITICAL: File Organization Rules

**NEVER create files in root directory!**

1. **Documentation files (.md, .txt, etc.):**
   - ALWAYS create in `/docs/` directory
   - Only exception: if user explicitly specifies exact path and filename
   - Example: `docs/new-feature.md` NOT `new-feature.md`

2. **Scripts (.sh, .ts, .js for utilities):**
   - ALWAYS create in `/scripts/` directory or subdirectories:
     - `/scripts/debug/` - testing and debugging scripts
     - `/scripts/monitoring/` - monitoring and log watching
     - `/scripts/deployment/` - deployment helpers
   - Only exception: if user explicitly specifies exact path and filename
   - Example: `scripts/debug/test-feature.ts` NOT `test-feature.ts`

3. **Task tracking files (for /tasks/ directory):**
   - `/tasks/` is ONLY for user-assigned tasks and internal task tracking
   - `tasks/todo.md` - your active task list
   - `tasks/lessons.md` - self-improvement notes
   - User-assigned task plans (only when explicitly requested)
   - DO NOT create general documentation, guides, or README files in `/tasks/`
   - All other documentation goes to `/docs/` instead

**Root directory is ONLY for:**

- System config files (next.config.js, tsconfig.json, etc.)
- Package management (package.json, bun.lockb)
- CLAUDE.md

## ⚠️ CRITICAL: Debugging Production Issues

**When production breaks and you don't know why:**

1. **DON'T start making changes immediately** - first understand what broke
2. **Check git history** - what worked yesterday? `git log --since="yesterday" --oneline`
3. **Read official LLM docs** - OpenAI API changes frequently, always check current docs
4. **Check actual errors** - add detailed logging BEFORE trying fixes (console.error + logger.error)
5. **Restore to working version** - `git checkout <last-working-commit> -- <file>` then identify minimal change needed
6. **Test one change at a time** - never fix multiple things in one commit

## Quick Start for New Session

### Project Structure

```
src/
├── app/                      # short explanation
│   ├── api/                 # short explanation
│   │   ├── dir/          # short explanation
│   │   ├── dir/  # short explanation
│   │   └── dir/          # short explanation
│   ├── dir/              # short explanation
│   └── dir/              # short explanation
│--continue dir tree
```

## VPS Deployment

**Server Access:**

Prod Server:
sshpass -p 'password' ssh -o StrictHostKeyChecking=no root@ip

## Supabase Databases

- Prod DB: PGPASSWORD='password' psql -h db.id.supabase.co -U postgres -d postgres

## Database Backups

**Automated daily backups configured:**

- Runs locally at 3 AM (cron on dev machine)
- Stored on VPS: `/var/backups/postgresql/prod_db_YYYYMMDD_HHMMSS.dump`
- Retention: 7 days
- Size: ~2 MB compressed

**Manual backup:**

```sh
./scripts/backup-prod-db.sh
```

**Restore:**

```sh
# On VPS or local with IPv6
pg_restore -h db.id.supabase.co -U postgres -d postgres \
  --clean --if-exists /var/backups/postgresql/prod_db_YYYYMMDD_HHMMSS.dump
```

**Note:** Supabase requires IPv6. VPS doesn't have IPv6 routing, so backups run from local machine (has IPv6) and upload to VPS via scp.

## NEVER EVER DO

These rules are ABSOLUTE:

### NEVER Deploy to production without first asking user

### NEVER Publish Sensitive Data

- NEVER publish passwords, API keys, tokens to git/npm/docker
- Before ANY commit: verify no secrets included

### NEVER Commit .env Files

- NEVER commit `.env` to git
- ALWAYS verify `.env` is in `.gitignore`

### NEVER Hardcode Credentials

- ALWAYS use environment variables

## development rules

0. Make the plan extremely concise. Sacrifice grammar for the sake of concision.

1. At the end of each plan, give me a list of unresolved questions to answer, if any.

2. First think through the problem, read the codebase for relevant files, and write a plan to tasks/todo.md.

3. The plan should have a list of todo items that you can check off as you complete them.

4. Before you begin working, check in with me and I will verify the plan.

5. Then, begin working on the todo items, marking them as complete as you go.

6. Please every step of the way just give me a high level explanation of what changes you made.

7. Make every task and code change you do as simple as possible. We want to avoid making any massive or complex changes. Every change should impact as little code as possible. Everything is about simplicity.

8. Finally, add a review section to the todo.md file with a summary of the changes you made and any other relevant information.

9. DO NOT BE LAZY. NEVER BE LAZY. IF THERE IS A BUG FIND THE ROOT CAUSE AND FIX IT. NO TEMPORARY FIXES. YOU ARE A SENIOR DEVELOPER. NEVER BE LAZY.

10. MAKE ALL FIXES AND CODE CHANGES AS SIMPLE AS HUMANLY POSSIBLE. THEY SHOULD ONLY IMPACT NECESSARY CODE RELEVANT TO THE TASK AND NOTHING ELSE. IT SHOULD IMPACT AS LITTLE CODE AS POSSIBLE. YOUR GOAL IS TO NOT INTRODUCE ANY BUGS. IT'S ALL ABOUT SIMPLICITY.

11. Don't write tests for what the type system already guarantees.

12. Only use methods available on the interface to verify behavior.

13. Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one.

## Advanced Workflow Patterns

### Verification Protocol

NEVER mark task complete without:

1. Proving it works (tests/logs/manual check)
2. Before/after behavior comparison
3. Asking: "Would a staff engineer approve?"

For bug fixes specifically:

- Point at failing logs/tests FIRST
- Fix autonomously without hand-holding
- Zero context switching required from user

### Elegance vs Simplicity

- **Non-trivial changes (3+ files):** Pause and ask "more elegant way?"
- **Simple fixes (<3 files):** Just implement, don't over-engineer
- **Red flag:** Copy-pasting similar code 3+ times

### Autonomous Bug Fixing

1. Find failing tests/logs FIRST
2. Fix root cause (no temporary fixes)
3. Verify fix with tests
4. Update `tasks/lessons.md` if pattern found

### Subagent Strategy

- One focused task per subagent
- Offload research to Explore agent
- Use parallel subagents for complex problems
- Skip for simple 1-2 tool call calls
