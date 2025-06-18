
# TODO list
- [x] Black list jwt
- [x] CORS 
- [x] Rate Limiting 
- [x] Find username and suggest new one (Trie)
- [ ] Setup tokens
- [ ] Setup realtime intergration

# How to use 
## Setup env
```bash
cp .env.example .env
```

## Migration
### After setup source run
```bash
pnpm prisma migrate dev 
```

### After change entity
```bash
pnpm primsa migrate dev --name change_content_message
```

## Setup docker
in root project run
```bash

# to review docker compose config again before 
docker compose config

docker compose up -d
```


