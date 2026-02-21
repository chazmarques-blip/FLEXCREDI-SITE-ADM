#!/usr/bin/env python3
"""
FLEXCREDI - Deploy direto via GitHub API
Faz commit diretamente no repositório sem precisar de clone local
"""

import requests
import json
import base64

# Configurações
GITHUB_TOKEN = "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"
REPO_OWNER = "chazmarques-blip"
REPO_NAME = "FLEXCREDI-COMPLETO"
BRANCH = "main"

# Headers para autenticação
headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

def get_file_sha(file_path):
    """Obtém o SHA do arquivo atual no GitHub"""
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{file_path}"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()['sha']
    return None

def update_file(file_path, content, message):
    """Atualiza um arquivo no GitHub"""
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/contents/{file_path}"
    
    # Converter conteúdo para base64
    content_bytes = content.encode('utf-8')
    content_base64 = base64.b64encode(content_bytes).decode('utf-8')
    
    # Obter SHA do arquivo atual
    sha = get_file_sha(file_path)
    
    # Preparar dados
    data = {
        "message": message,
        "content": content_base64,
        "branch": BRANCH
    }
    
    if sha:
        data["sha"] = sha
    
    # Fazer requisição
    response = requests.put(url, headers=headers, json=data)
    
    if response.status_code in [200, 201]:
        print(f"✅ {file_path} atualizado com sucesso!")
        return True
    else:
        print(f"❌ Erro ao atualizar {file_path}: {response.status_code}")
        print(response.json())
        return False

# Ler arquivo local
with open('index.html', 'r', encoding='utf-8') as f:
    index_content = f.read()

# Atualizar no GitHub
print("🚀 Fazendo deploy do index.html...")
success = update_file(
    "index.html",
    index_content,
    "fix: Replace index.html with correct working version\n\n- Carousel funcionando com 6 slides\n- Imagens mosaic-*.jpg\n- Deploy via API"
)

if success:
    print("\n✅ Deploy concluído!")
    print("\n🌐 Acesse:")
    print("   https://flexcredi.vercel.app")
    print("\n⏱️ Aguarde 30-60s para o Vercel fazer deploy")
else:
    print("\n❌ Deploy falhou!")
