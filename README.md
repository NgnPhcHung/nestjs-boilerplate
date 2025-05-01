
# TODO list
- [x] Black list jwt
- [ ] CORS 
- [x] Rate Limiting 
- [x] Find username and suggest new one (Trie)

# How to use 
## Setup env
```bash
cp .env.example .env
```

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

