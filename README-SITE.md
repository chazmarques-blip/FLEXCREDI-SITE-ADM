# FlexCredi Site (Cliente)

## Desenvolvimento

Este é o site principal do FlexCredi para clientes, desenvolvido em HTML/CSS/JS puro.

### URLs de Produção
- **Site**: https://www.flexcredi.com
- **API Backend**: https://flexcredi-site-adm-production-b27d.up.railway.app

### Estrutura Principal
```
/
├── index.html             # Página inicial
├── login.html             # Login/Registro de clientes
├── dashboard-cliente.html # Dashboard do cliente
├── sobre.html             # Sobre nós
├── como-funciona.html     # Como funciona
├── servicos.html          # Serviços
├── faq.html               # Perguntas frequentes
├── contato.html           # Contato
├── js/
│   ├── main.js            # Script principal
│   └── client-api.js      # Cliente API
├── css/                   # Estilos
├── assets/                # Imagens
└── locales/               # Traduções (EN, ES, PT)
```

### Configuração da API

A URL da API está configurada em `js/client-api.js`:
```javascript
baseURL: 'https://flexcredi-site-adm-production-b27d.up.railway.app'
```

### Endpoints do Cliente

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/client/auth/login` | POST | Login do cliente |
| `/api/client/auth/register` | POST | Registro de novo cliente |
| `/api/client/auth/me` | GET | Perfil do usuário logado |
| `/api/public/applications` | POST | Submeter aplicação de crédito |
| `/api/public/partners` | GET | Listar parceiros |

### Traduções

O site suporta 3 idiomas:
- Inglês (EN) - `/locales/en.json`
- Espanhol (ES) - `/locales/es.json`
- Português (PT) - `/locales/pt.json`

### Deploy

O deploy é feito via Vercel, conectado ao repositório GitHub.
O domínio `www.flexcredi.com` aponta para a raiz do projeto.
