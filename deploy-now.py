#!/usr/bin/env python3
"""Deploy imediato do Vercel via GitHub API"""

import requests
import base64
import json
from datetime import datetime

# Configurações
GITHUB_TOKEN = "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"
GITHUB_USER = "chazmarques-blip"
REPO = "FLEXCREDI-COMPLETO"
FILE = "vercel.json"

headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

print("🚀 FLEXCREDI - Deploy Vercel AGORA")
print("=" * 60)

# 1. Obter SHA atual
print("\n📡 Obtendo SHA do vercel.json no GitHub...")
url = f"https://api.github.com/repos/{GITHUB_USER}/{REPO}/contents/{FILE}"
response = requests.get(url, headers=headers)

if response.status_code != 200:
    print(f"❌ Erro ao obter arquivo: {response.status_code}")
    print(response.text)
    exit(1)

sha = response.json()["sha"]
print(f"✅ SHA obtido: {sha[:7]}...")

# 2. Conteúdo do vercel.json
vercel_content = {
    "rewrites": [
        {
            "source": "/(.*)",
            "destination": "/admin-dashboard.html",
            "has": [
                {
                    "type": "host",
                    "value": "admin.flexcredi.com"
                }
            ]
        }
    ]
}

# Converter para string JSON e depois base64
content_str = json.dumps(vercel_content, indent=2)
content_base64 = base64.b64encode(content_str.encode()).decode()

# 3. Fazer commit
timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
commit_message = f"deploy: Forçar novo deploy Vercel - {timestamp}"

print(f"\n📤 Fazendo commit: {commit_message}")

data = {
    "message": commit_message,
    "content": content_base64,
    "sha": sha,
    "branch": "main"
}

response = requests.put(url, headers=headers, json=data)

if response.status_code == 200:
    print("✅ Commit realizado com sucesso!")
    commit_data = response.json()
    commit_sha = commit_data["commit"]["sha"][:7]
    print(f"✅ Commit SHA: {commit_sha}")
    
    print("\n" + "=" * 60)
    print("✅ DEPLOY INICIADO COM SUCESSO!")
    print("=" * 60)
    
    print(f"\n📦 Repositório:")
    print(f"   https://github.com/{GITHUB_USER}/{REPO}")
    
    print(f"\n📊 Commit:")
    print(f"   https://github.com/{GITHUB_USER}/{REPO}/commit/{commit_data['commit']['sha']}")
    
    print(f"\n🌐 Painel Vercel:")
    print(f"   https://vercel.com/charles-marques-projects/flexcredi")
    
    print(f"\n🔗 Site (aguarde 2-3 min):")
    print(f"   https://flexcredi.vercel.app")
    
    print(f"\n⏱️  TIMELINE:")
    print(f"   0:00 - ✅ Commit feito agora")
    print(f"   0:30 - 🔄 Vercel detecta mudança")
    print(f"   1:00 - 🔨 Build inicia")
    print(f"   3:00 - ✅ Build completa")
    print(f"   3:30 - 🚀 Deploy finalizado")
    
    print(f"\n✅ Aguarde 3-5 minutos e acesse o site!")
    
else:
    print(f"❌ Erro ao fazer commit: {response.status_code}")
    print(response.text)
    exit(1)
