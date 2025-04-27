
# TODO list
- [ ] Black list jwt
- [ ] Rate Limiting 
- [ ] IP while list
- [ ] CORS 


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

