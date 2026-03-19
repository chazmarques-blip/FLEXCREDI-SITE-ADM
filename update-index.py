#!/usr/bin/env python3
"""
Força commit do index.html para garantir que está no GitHub
"""

import requests
import base64
import json
from datetime import datetime

TOKEN = "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"
USER = "chazmarques-blip"
REPO = "FLEXCREDI-COMPLETO"
FILE = "index.html"

headers = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

print("🚀 FLEXCREDI - Atualizando index.html no GitHub")
print("=" * 60)

# Ler index.html local
print(f"\n📖 Lendo {FILE} local...")
with open(FILE, 'r', encoding='utf-8') as f:
    index_content = f.read()

print(f"✅ Arquivo lido: {len(index_content)} bytes")

# Obter SHA atual no GitHub
print(f"\n📡 Obtendo SHA do {FILE} no GitHub...")
url = f"https://api.github.com/repos/{USER}/{REPO}/contents/{FILE}"
response = requests.get(url, headers=headers)

if response.status_code != 200:
    print(f"❌ Erro ao obter arquivo: {response.status_code}")
    print(response.text)
    exit(1)

sha = response.json()["sha"]
print(f"✅ SHA obtido: {sha[:7]}...")

# Converter para base64
print(f"\n📦 Convertendo para base64...")
content_base64 = base64.b64encode(index_content.encode('utf-8')).decode('utf-8')

# Fazer commit
timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
commit_message = f"fix: Atualizar index.html com carousel completo - {timestamp}"

print(f"\n📤 Fazendo commit: {commit_message}")

data = {
    "message": commit_message,
    "content": content_base64,
    "sha": sha,
    "branch": "main"
}

response = requests.put(url, headers=headers, json=data)

if response.status_code == 200:
    print("✅ index.html atualizado com sucesso!")
    commit_data = response.json()
    commit_sha = commit_data["commit"]["sha"][:7]
    print(f"✅ Commit SHA: {commit_sha}")
    
    print("\n" + "=" * 60)
    print("✅ INDEX.HTML ATUALIZADO NO GITHUB!")
    print("=" * 60)
    
    print(f"\n📦 Commit:")
    print(f"   https://github.com/{USER}/{REPO}/commit/{commit_data['commit']['sha']}")
    
    print(f"\n🌐 Vercel vai detectar e fazer redeploy:")
    print(f"   https://vercel.com/charles-marques-projects/flexcredi")
    
    print(f"\n🔗 Site (aguarde 3-5 min):")
    print(f"   https://flexcredi.vercel.app")
    
    print(f"\n⏱️  AGUARDE:")
    print(f"   - 1 min: Vercel detecta mudança")
    print(f"   - 3 min: Build completa")
    print(f"   - 5 min: Site com carousel online!")
    
else:
    print(f"❌ Erro ao fazer commit: {response.status_code}")
    print(response.text)
    exit(1)
