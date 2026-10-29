#!/usr/bin/env python3
"""PreToolUse guard for the design phase.

Active only while .claude/DESIGN_PHASE exists. While active:
- Write/Edit/NotebookEdit: denied unless the target file ends in .md.
- Bash: simple read-only commands pass through; anything else asks the user.
Delete .claude/DESIGN_PHASE to enter the coding phase (the guard goes inert).
"""
import json
import os
import shlex
import sys

PROJECT_DIR = os.environ.get("CLAUDE_PROJECT_DIR") or os.getcwd()
MARKER = os.path.join(PROJECT_DIR, ".claude", "DESIGN_PHASE")

READ_ONLY_COMMANDS = {"ls", "cat", "head", "tail", "grep", "wc", "pwd", "tree"}
READ_ONLY_GIT = {"status", "diff", "log", "show"}
SHELL_METACHARS = (">", "<", ";", "&", "|", "`", "$(", "\n")


def decide(decision, reason):
    print(json.dumps({
        "hookSpecificOutput": {
            "hookEventName": "PreToolUse",
            "permissionDecision": decision,
            "permissionDecisionReason": reason,
        }
    }))
    sys.exit(0)


def is_read_only(command):
    if any(c in command for c in SHELL_METACHARS):
        return False
    try:
        tokens = shlex.split(command)
    except ValueError:
        return False
    if not tokens:
        return False
    if tokens[0] in READ_ONLY_COMMANDS:
        return True
    return tokens[0] == "git" and len(tokens) > 1 and tokens[1] in READ_ONLY_GIT


def main():
    if not os.path.exists(MARKER):
        sys.exit(0)
    payload = json.load(sys.stdin)
    tool = payload.get("tool_name", "")
    tool_input = payload.get("tool_input", {})

    if tool in ("Write", "Edit", "NotebookEdit"):
        path = tool_input.get("file_path") or tool_input.get("notebook_path") or ""
        if not path.lower().endswith(".md"):
            decide("deny", f"Design phase: only .md files may be edited (blocked: {path}).")
    elif tool == "Bash":
        if not is_read_only(tool_input.get("command", "")):
            decide("ask", "Design phase: non-read-only shell command needs user approval.")
    sys.exit(0)


if __name__ == "__main__":
    main()
