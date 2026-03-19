# 🚀 FLEXCREDI - Deploy Automático Completo

## ✅ O que este deploy vai fazer:

1. ✅ Substituir o `index.html` pela versão correta (com carousel funcionando)
2. ✅ Criar `css/cache-buster.css` para forçar reload de imagens
3. ✅ Garantir que `css/carousel-fix.css` está linkado corretamente
4. ✅ Fazer commit automático no GitHub
5. ✅ Fazer push para o repositório
6. ✅ Acionar deploy automático no Vercel

---

## 📋 PRÉ-REQUISITOS:

- ✅ Git instalado no computador
- ✅ Repositório clonado localmente
- ✅ Token do GitHub configurado (já incluído no script)

---

## 🖥️ INSTRUÇÕES DE USO:

### **WINDOWS:**

1. Abra o **Prompt de Comando** (CMD) ou **PowerShell**
2. Navegue até a pasta do projeto:
   ```cmd
   cd caminho\para\FLEXCREDI-COMPLETO
   ```
3. Execute o script:
   ```cmd
   deploy-final.bat
   ```

### **MAC / LINUX:**

1. Abra o **Terminal**
2. Navegue até a pasta do projeto:
   ```bash
   cd /caminho/para/FLEXCREDI-COMPLETO
   ```
3. Dê permissão de execução ao script (primeira vez apenas):
   ```bash
   chmod +x deploy-final.sh
   ```
4. Execute o script:
   ```bash
   ./deploy-final.sh
   ```

---

## ⏱️ TEMPO ESTIMADO:

- **Execução do script:** 10-30 segundos
- **Deploy no Vercel:** 30-60 segundos
- **TOTAL:** ~1-2 minutos

---

## 🌐 VALIDAÇÃO:

Após o script executar com sucesso:

1. Aguarde **30-60 segundos**
2. Acesse: **https://flexcredi.vercel.app**
3. Faça **Hard Refresh** (Ctrl+Shift+R ou Cmd+Shift+R)
4. Verifique:
   - ✅ Carousel aparece com 6 slides
   - ✅ Imagens de fundo carregam corretamente
   - ✅ Navegação (◄ ►) funciona
   - ✅ Indicadores (● ○ ○ ○ ○ ○) funcionam
   - ✅ Formulário de aplicação aparece
   - ✅ Seção de benefícios aparece

---

## 🔍 MONITORAR DEPLOY:

Acompanhe o deploy em tempo real:
👉 **https://vercel.com/charles-marques-projects/flexcredi/deployments**

Status esperado:
- 🟡 **Building...** (30-45 segundos)
- 🟢 **Ready** (deploy concluído!)

---

## ❌ TROUBLESHOOTING:

### **Erro: "not a git repository"**
**Solução:** Clone o repositório primeiro:
```bash
git clone https://github.com/chazmarques-blip/FLEXCREDI-COMPLETO.git
cd FLEXCREDI-COMPLETO
```

### **Erro: "permission denied"**
**Solução (Linux/Mac):** Dê permissão de execução:
```bash
chmod +x deploy-final.sh
```

### **Erro: "failed to push"**
**Solução:** Execute manualmente:
```bash
git push https://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@github.com/chazmarques-blip/FLEXCREDI-COMPLETO.git main
```

### **Imagens ainda não aparecem após deploy**
**Solução:**
1. Aguarde mais 1-2 minutos (cache do Vercel)
2. Faça **Hard Refresh** no navegador (Ctrl+Shift+R)
3. Limpe cache do navegador
4. Tente em uma aba anônima

---

## 📞 SUPORTE:

Se algo der errado, envie a mensagem de erro completa que apareceu no terminal.

---

## ✅ CHECKLIST PÓS-DEPLOY:

- [ ] Script executou sem erros
- [ ] Vercel mostrou status "Ready"
- [ ] Site carrega em https://flexcredi.vercel.app
- [ ] Carousel aparece com imagens
- [ ] Navegação funciona
- [ ] Formulário aparece
- [ ] Sem erros no console (F12)

---

## 🎉 PRONTO!

Seu site FLEXCREDI está 100% atualizado e funcionando!

**Próximos passos sugeridos:**
1. Aguardar propagação DNS (1-2h) para www.flexcredi.com
2. Testar em dispositivos móveis
3. Configurar Google Analytics (se ainda não feito)
4. Testar formulário de aplicação
5. Validar integração com backend

---

**Data da última atualização:** 2026-02-20
**Versão do deploy:** 1.0.0
