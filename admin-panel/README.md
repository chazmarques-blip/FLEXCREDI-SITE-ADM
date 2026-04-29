# FlexCredi Admin Dashboard

## Desenvolvimento

Este é o painel administrativo do FlexCredi, desenvolvido em HTML/CSS/JS puro.

### URLs de Produção
- **Admin**: https://admin.flexcredi.com
- **API Backend**: https://flexcredi-site-adm-production-b27d.up.railway.app

### Estrutura
```
admin-panel/
├── admin/                 # Páginas do painel
│   ├── admin-dashboard.html
│   ├── admin-clientes.html
│   ├── admin-cliente-detalhes.html
│   ├── admin-aplicacoes.html
│   ├── admin-aplicacao-detalhes.html
│   └── ...
├── css/                   # Estilos
├── js/                    # Scripts
│   ├── api-config.js      # Configuração da API
│   └── flexcredi-api.js   # Cliente API
└── assets/                # Imagens e recursos
```

### Configuração da API

A URL da API está configurada em `js/api-config.js`:
```javascript
const API_URL = 'https://flexcredi-site-adm-production-b27d.up.railway.app';
```

### Endpoints Principais

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/api/admin/dashboard` | GET | Métricas do dashboard |
| `/api/admin/clients` | GET | Lista de clientes |
| `/api/admin/clients/:id` | GET | Detalhes do cliente |
| `/api/admin/applications` | GET | Lista de aplicações |
| `/api/admin/applications/:id` | GET | Detalhes da aplicação |
| `/api/admin/applications/:id/approve` | PUT | Aprovar aplicação |
| `/api/admin/applications/:id/reject` | PUT | Rejeitar aplicação |

### Deploy

O deploy é feito via Vercel, conectado ao repositório GitHub.
O domínio `admin.flexcredi.com` aponta para a pasta `/admin-panel/admin/`.
