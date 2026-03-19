# 📄 Template de Contrato - Guia Rápido

## ✅ Arquivo Template
**Localização:** `/home/user/webapp/backend/templates/contracts/personal-loan-agreement-template.docx`

## 🔢 Variáveis do Template (42 total)

### Categorias
- **Data** (3): DAY, MONTH, YEAR
- **Mutuário** (11): Nome, endereço, documentos, contato
- **Termos do Empréstimo** (9): Valores, taxas, parcelas
- **Cronograma** (3): Dia do mês, primeiro pagamento
- **Desembolso** (4): Banco, routing, conta
- **ACH** (9): Dados bancários para débito automático
- **Taxas** (4): Multas, juros, período de carência

## 📋 Mapeamento Automático

O arquivo `utils/contractVariablesMapper.js` busca dados de:
- ✅ Application (valores aprovados)
- ✅ User (dados do cliente)
- ✅ Partner (informações do parceiro)
- ✅ SystemSettings (configurações padrão)

## 🚀 Como Usar

```javascript
const { mapApplicationToContract } = require('./utils/contractVariablesMapper');

// Gerar variáveis do contrato
const variables = await mapApplicationToContract(
  'application-uuid',
  new Date('2026-02-15')
);

// Resultado:
// {
//   DAY: "15",
//   MONTH: "February",
//   YEAR: "2026",
//   BORROWER_FULL_NAME: "John Smith",
//   LOAN_AMOUNT_NUMBERS: "25,000.00",
//   ... (todas as 42 variáveis)
// }
```

## 📊 Exemplo de Saída

```json
{
  "BORROWER_FULL_NAME": "Maria Silva Santos",
  "BORROWER_EMAIL": "maria@example.com",
  "LOAN_AMOUNT_NUMBERS": "25,000.00",
  "LOAN_AMOUNT_WORDS": "Twenty Five Thousand Dollars",
  "INTEREST_RATE_PERCENTAGE": "18.50",
  "LOAN_TERM_MONTHS": "24",
  "INSTALLMENT_AMOUNT_NUMBERS": "1,287.50",
  "ACH_BANK_NAME": "Chase Bank",
  "ACH_ROUTING_NUMBER": "021000021"
}
```

## 🔐 Seções do Contrato

1. **Partes** - FLEXCREDI LLC + Mutuário
2. **Termos do Empréstimo** - Valor, taxa, prazo
3. **Desembolso** - Como o dinheiro será enviado
4. **Cronograma de Pagamento** - Datas e valores
5. **Atrasos** - Multas e juros de mora
6. **Pagamento Antecipado** - Sem penalidade
7. **Representações** - Declarações do mutuário
8. **Inadimplência** - Eventos de default
9. **🔥 Autorização ACH** - Débito automático (seção crítica)
10. **Lei Aplicável** - Estado da Flórida
11. **Notificações** - Como as partes se comunicam
12. **Cláusulas Gerais** - Acordo completo, modificações, etc.

## ⚡ Autorização ACH (Seção 9)

Esta é a seção **mais importante** do contrato, pois:
- ✅ Autoriza débitos automáticos
- ✅ Define conta bancária
- ✅ Estabelece termos de revogação
- ✅ Prevê taxa de devolução ($25)
- ✅ Requer **rubrica separada** do mutuário

**Variáveis ACH (9):**
- `ACH_BANK_NAME`
- `ACH_ROUTING_NUMBER`
- `ACH_ACCOUNT_HOLDER_NAME`
- `ACH_ACCOUNT_NUMBER`
- `ACH_REVOCATION_NOTICE_DAYS` (padrão: 15 dias)
- `ACH_TRANSACTION_REFERENCE`
- `ACH_ACCOUNT_VERIFIED_BY`
- `ACH_DATE_VERIFIED`

## 📝 Assinatura

O contrato requer:
1. ✍️ **Assinatura do Mutuário** - Completa
2. ✅ **Rubrica ACH** - Consentimento específico para débitos
3. 📅 **Data** - Preenchida automaticamente

## 🔄 Próximos Passos (Sprint 2)

1. ⏳ Instalar `pizzip` e `docxtemplater`
2. ⏳ Criar `ContractGenerator` utility
3. ⏳ Criar endpoint `POST /api/contracts/generate`
4. ⏳ Integrar com DocuSign
5. ⏳ Criar página `/admin/contratos`

## 📚 Documentação Completa

Ver: `/home/user/webapp/backend/templates/contracts/CONTRACT-TEMPLATE-DOCUMENTATION.md`

---

**Atualizado:** 2026-02-21  
**Status:** Template documentado e mapeador criado  
**Próximo:** Sprint 2 - Implementar geração
