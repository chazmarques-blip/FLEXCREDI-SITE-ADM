#!/usr/bin/env python3
"""
Upload completo do index.html para o GitHub
Isso vai substituir o arquivo vazio por este completo com carousel
"""

import requests
import base64
import os

TOKEN = "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"
USER = "chazmarques-blip"
REPO = "FLEXCREDI-COMPLETO"
FILE = "index.html"

headers = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

print("=" * 70)
print("🚀 FLEXCREDI - UPLOAD INDEX.HTML COMPLETO PARA GITHUB")
print("=" * 70)

# Verificar se arquivo existe
if not os.path.exists(FILE):
    print(f"\n❌ ERRO: Arquivo {FILE} não encontrado!")
    print(f"📁 Diretório atual: {os.getcwd()}")
    print(f"📋 Arquivos disponíveis:")
    for f in os.listdir('.'):
        if f.endswith('.html'):
            print(f"   - {f}")
    exit(1)

# Ler arquivo local
print(f"\n📖 Lendo {FILE}...")
with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

file_size = len(content)
file_size_kb = file_size / 1024

print(f"✅ Arquivo lido com sucesso!")
print(f"   📊 Tamanho: {file_size} bytes ({file_size_kb:.1f} KB)")

# Verificar conteúdo
mosaics = [
    'mosaic-restaurant.jpg',
    'mosaic-beauty.jpg',
    'mosaic-construction.jpg',
    'mosaic-foodtruck.jpg',
    'mosaic-auto.jpg',
    'mosaic-retail.jpg'
]

print(f"\n🎠 Verificando carousel no arquivo local:")
found_count = 0
for mosaic in mosaics:
    found = mosaic in content
    found_count += 1 if found else 0
    status = "✅" if found else "❌"
    print(f"   {status} {mosaic}")

print(f"\n📊 Total: {found_count}/6 slides encontrados")

if found_count < 6:
    print(f"\n⚠️  AVISO: Carousel incompleto no arquivo local!")
    response = input("Continuar mesmo assim? (s/n): ")
    if response.lower() != 's':
        print("❌ Upload cancelado")
        exit(1)

# Obter SHA do arquivo no GitHub
print(f"\n📡 Conectando ao GitHub...")
url = f"https://api.github.com/repos/{USER}/{REPO}/contents/{FILE}"

try:
    response = requests.get(url, headers=headers, timeout=10)
    
    if response.status_code == 200:
        sha = response.json().get("sha", "")
        print(f"✅ Arquivo encontrado no GitHub")
        print(f"   SHA atual: {sha[:7]}...")
    elif response.status_code == 404:
        sha = ""
        print(f"⚠️  Arquivo não existe no GitHub (será criado)")
    else:
        print(f"❌ Erro ao conectar: {response.status_code}")
        print(response.text)
        exit(1)
        
except Exception as e:
    print(f"❌ Erro de conexão: {str(e)}")
    exit(1)

# Converter para base64
print(f"\n📦 Convertendo para base64...")
content_base64 = base64.b64encode(content.encode('utf-8')).decode('utf-8')
print(f"✅ Conversão concluída")

# Preparar dados do commit
commit_message = f"fix: Upload completo do index.html com carousel de 6 slides ({file_size_kb:.1f} KB)"

data = {
    "message": commit_message,
    "content": content_base64,
    "branch": "main"
}

if sha:
    data["sha"] = sha

# Fazer upload
print(f"\n📤 Fazendo upload para o GitHub...")
print(f"   Mensagem: {commit_message}")

try:
    response = requests.put(url, headers=headers, json=data, timeout=30)
    
    if response.status_code == 200 or response.status_code == 201:
        commit_data = response.json()
        commit_sha = commit_data["commit"]["sha"]
        
        print("\n" + "=" * 70)
        print("✅ INDEX.HTML ENVIADO COM SUCESSO!")
        print("=" * 70)
        
        print(f"\n📦 Detalhes do commit:")
        print(f"   SHA: {commit_sha[:7]}...")
        print(f"   Tamanho: {file_size_kb:.1f} KB")
        print(f"   Slides: {found_count}/6")
        
        print(f"\n🔗 Links:")
        print(f"   📦 Commit: https://github.com/{USER}/{REPO}/commit/{commit_sha}")
        print(f"   📁 Arquivo: https://github.com/{USER}/{REPO}/blob/main/{FILE}")
        print(f"   🌐 Painel Vercel: https://vercel.com/charles-marques-projects/flexcredi")
        
        print(f"\n⏱️  PRÓXIMOS PASSOS:")
        print(f"   1. Vercel detectará a mudança (30 seg)")
        print(f"   2. Build iniciará automaticamente (1 min)")
        print(f"   3. Deploy completará (3-5 min)")
        print(f"   4. Teste o site: https://flexcredi.vercel.app")
        
        print(f"\n✅ Aguarde 5 minutos e acesse: https://flexcredi.vercel.app")
        print("=" * 70)
        
    else:
        print(f"\n❌ Erro ao fazer upload: {response.status_code}")
        print(f"📄 Resposta:")
        print(response.text)
        exit(1)
        
except Exception as e:
    print(f"\n❌ Erro durante upload: {str(e)}")
    exit(1)
