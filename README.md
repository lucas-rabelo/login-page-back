# Login Page (Back-end)

Este projeto contem toda a lógica de negócio para o gerenciamento de usuários, o que inclui:

- Criação
- Edição
- Exclusão
- Listagem

Também há o gerenciamento de permissões para o acesso do gerenciamento dos usuários.

## Lista de tecnologias

- [ ] NestJS
- [ ] Node.js
- [ ] Typescript
- [ ] PrismaORM
- [ ] Docker
- [ ] PostgreSQL
- [ ] Google OAuth2

## Pré-requisitos

Para fazer a aplicação funcionar no seu ambiente, você precisa:

- Node.js +20
- Docker e Docker compose
- Criar uma conta no [Mailtrap](https://mailtrap.io/pt/) (para os e-mails)
- Credenciais OAuth2 no [Google Cloud Console](https://console.cloud.google.com)

## Instalação e configuração

```bash
# 1. Clone o repositório
git clone https://github.com/lucas-rabelo/login-page-back.git
cd login-page-back

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas credenciais

# 4. Suba o banco de dados
docker-compose up -d

# 5. Execute as migrations
npx prisma migrate dev
```

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `NODE_ENV` | String para validação em qual ambiente o projeto está | `development` |
| `URL_FRONT` | Url para qual o sistema irá mandar o e-mail para alteração de senha | `sua url do ambiente de testes do front` |
| `SECRET_ENV` | Chave secreta para assinar tokens  | `sua-chave-secreta` |
| `MAILTRAP_HOST` | Host da API do Mailtrap | `seu-host` |
| `MAILTRAP_PORT` | Porta da API do Mailtrap | `sua-porta` |
| `MAILTRAP_USERNAME` | Username da API do Mailtrap | `seu-username` |
| `MAILTRAP_PASSWORD` | Password da API do Mailtrap | `seu-password` |
| `GOOGLE_CLIENT_ID` | Seu cliente ID do google | `seu-client-id` |
| `GOOGLE_CLIENT_SECRET` | Seu secret do google | `seu-secret` |
| `DB_USER` | Seu user do banco de dados | `seu-user` |
| `DB_PASS` | Sua senha do banco de dados | `sua-senha` |
| `DB_NAME` | O nome do banco de dados | `o-nome-do-banco` |
| `DB_PORT` | A porta do banco de dados | `a-porta-do-banco` |
| `DB_HOST` | E o host do banco de dados | `o-host-do-banco` |
| `DATABASE_URL` | É a junção de todas as variários do banco de dados em uma string | `"postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public&connect_timeout=300"` |

## Como rodar o projeto?

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod

# Testes
npm run test        # unitários
npm run test:e2e    # end-to-end
npm run test:cov    # cobertura
```

## Contribuição

Este projeto usa [Conventional Commits](https://www.conventionalcommits.org).
Commits fora do padrão são bloqueados automaticamente pelo Husky.

```bash
git checkout -b feat/nome-da-feature
# faça suas mudanças
git commit -m "feat(escopo): descrição curta"
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
