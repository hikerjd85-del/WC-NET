# Security Specification

## Data Invariants
- A tournament cannot exist without a valid user ID.
- The user ID in the document must match the document ID (the user's identity).

## The "Dirty Dozen" Payloads
1. Create with mismatched userId (spoofed identity)
2. Create without groupScores (missing field)
3. Create without koScores (missing field)
4. Update with a different userId (identity change)
5. Update adding a "isPro" field (shadow update)
6. Update without updating updatedAt (temporal integrity)
7. Update someone else's tournament
8. Create with oversized string in userId
9. Create missing createdAt
10. Update changing createdAt (immortal field)
11. Update changing groupScores to a string instead of map
12. Read someone else's tournament data
