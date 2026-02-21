#!/usr/bin/env python3
"""
Força redeploy no Vercel fazendo um commit vazio (dummy commit)
Isso garante que o Vercel vai detectar e fazer build com os arquivos atuais
"""

import requests
import base64
import json
from datetime import datetime

TOKEN = "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"
USER = "chazmarques-blip"
REPO = "FLEXCREDI-COMPLETO"
FILE = ".vercelignore"  # Arquivo pequeno para forçar commit

headers = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

print("🚀 FORÇANDO REDEPLOY NO VERCEL")
print("=" * 60)

# Obter SHA atual
print(f"\n📡 Obtendo SHA do {FILE}...")
url = f"https://api.github.com/repos/{USER}/{REPO}/contents/{FILE}"
response = requests.get(url, headers=headers)

if response.status_code != 200:
    print(f"❌ Erro: {response.status_code}")
    exit(1)

current_data = response.json()
sha = current_data["sha"]
current_content = base64.b64decode(current_data["content"]).decode('utf-8')

print(f"✅ SHA obtido: {sha[:7]}...")

# Adicionar comentário com timestamp para forçar mudança
timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
new_content = current_content.strip() + f"\n# Force deploy: {timestamp}\n"

# Converter para base64
content_base64 = base64.b64encode(new_content.encode('utf-8')).decode('utf-8')

# Fazer commit
commit_message = f"deploy: Forçar redeploy Vercel - {timestamp}"

print(f"\n📤 Commitando: {commit_message}")

data = {
    "message": commit_message,
    "content": content_base64,
    "sha": sha,
    "branch": "main"
}

response = requests.put(url, headers=headers, json=data)

if response.status_code == 200:
    commit_data = response.json()
    commit_sha = commit_data["commit"]["sha"][:7]
    
    print("\n" + "=" * 60)
    print("✅ REDEPLOY FORÇADO COM SUCESSO!")
    print("=" * 60)
    
    print(f"\n📦 Commit: {commit_sha}")
    print(f"   https://github.com/{USER}/{REPO}/commit/{commit_data['commit']['sha']}")
    
    print(f"\n🌐 Painel Vercel (ATUALIZE AGORA):")
    print(f"   https://vercel.com/charles-marques-projects/flexcredi")
    
    print(f"\n🔗 Site (3-5 min):")
    print(f"   https://flexcredi.vercel.app")
    
    print(f"\n⏱️  TIMELINE:")
    print(f"   0:30 - Vercel detecta commit")
    print(f"   1:00 - Build inicia")
    print(f"   3:00 - Build completa")
    print(f"   3:30 - Deploy online")
    
    print(f"\n🎯 PRÓXIMOS PASSOS:")
    print(f"   1. Abra o painel Vercel")
    print(f"   2. Aguarde novo deploy aparecer")
    print(f"   3. Monitore os logs")
    print(f"   4. Teste o site em 5 min")
    
else:
    print(f"❌ Erro ao fazer commit: {response.status_code}")
    print(response.text)
    exit(1)
