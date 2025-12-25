# Subagent Selection Policy

## Critical Rule: No Partial Matches

**NEVER use a subagent that only "partially" fits the task requirements.**

### Required Behavior

When a task needs to be delegated:

1. **Evaluate available subagents** - Check if ANY subagent fully matches the task requirements
2. **If no exact match exists** - STOP and ask user for clarification
3. **NEVER compromise** - Don't use a subagent just because it's "close enough"

### Why This Matters

- Partial matches lead to suboptimal results
- Forces proper specialization
- Ensures tasks are handled by the right expert
- Prevents misuse of agents designed for different purposes

### Examples

**WRONG:**

- Task: Implement new UI feature
- Thinking: "design-review agent works with UI, I'll use that"
- Action: Uses design-review agent ❌

**CORRECT:**

- Task: Implement new UI feature
- Thinking: "design-review is for reviewing, not implementing. No exact match exists."
- Action: Stop and ask user for clarification ✓

## When in Doubt

Always ask the user rather than guessing which subagent to use.
