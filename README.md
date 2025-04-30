
# TODO list
- [x] Black list jwt
- [ ] CORS 
- [ ] Rate Limiting 
- [ ] IP while list
- [ ] Find username and suggest new one (Trie)

# Technicals 
- GraphQL
- Typeorm


# How to use 
## Migration
### After setup source run
```bash
pnpm migration:run 
```
### After change entity
```bash
pnpm migration:generate change-content
```
### Revert entity
```bash
pnpm migration:revert
```

