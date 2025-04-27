
# TODO list
- [ ] Bit-Field role based access control (RBAC)
- [ ] Black list jwt

# Technicals 
- GraphQL
- Typeorm


# How to use 
> [!INFO]
- First time setup app only

    Before run migration, in `modules/db/typeorm-config.service.ts`, set synchornize = true then run app for a first time that will create schema, after that I can create migration files

cli
```bash
#generate migration:
npm run migration:generate --name=your_migration_name

```
