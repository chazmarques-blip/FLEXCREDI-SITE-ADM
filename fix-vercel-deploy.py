#!/usr/bin/env python3
"""
Script para corrigir o deploy do Vercel via GitHub API
Faz commit do vercel.json corrigido para forçar novo deploy
"""

import json
import requests
import base64
import sys
from datetime import datetime

# Configurações
GITHUB_TOKEN = "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"
GITHUB_USER = "chazmarques-blip"
REPO_NAME = "FLEXCREDI-COMPLETO"
BRANCH = "main"

# Headers para autenticação
headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

def get_file_sha(file_path):
    """Obtém o SHA do arquivo atual no GitHub"""
    url = f"https://api.github.com/repos/{GITHUB_USER}/{REPO_NAME}/contents/{file_path}?ref={BRANCH}"
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()["sha"]
    return None

def update_file(file_path, content, message):
    """Atualiza um arquivo no GitHub"""
    url = f"https://api.github.com/repos/{GITHUB_USER}/{REPO_NAME}/contents/{file_path}"
    
    # Obtém SHA atual
    sha = get_file_sha(file_path)
    if not sha:
        print(f"❌ Erro: Arquivo {file_path} não encontrado no GitHub")
        return False
    
    # Converte conteúdo para base64
    content_bytes = content.encode('utf-8')
    content_base64 = base64.b64encode(content_bytes).decode('utf-8')
    
    # Prepara dados
    data = {
        "message": message,
        "content": content_base64,
        "sha": sha,
        "branch": BRANCH
    }
    
    # Faz o commit
    response = requests.put(url, headers=headers, json=data)
    
    if response.status_code == 200:
        print(f"✅ {file_path} atualizado com sucesso!")
        return True
    else:
        print(f"❌ Erro ao atualizar {file_path}: {response.status_code}")
        print(f"Resposta: {response.text}")
        return False

def trigger_vercel_deploy():
    """Adiciona um comentário para forçar o Vercel a fazer redeploy"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    vercel_json_content = """{
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
"""
    
    message = f"fix: Corrigir vercel.json para resolver erro de deploy - {timestamp}"
    
    print("\n🚀 Iniciando correção do deploy do Vercel...")
    print("=" * 60)
    
    # Atualiza vercel.json
    if update_file("vercel.json", vercel_json_content, message):
        print("\n✅ Commit realizado com sucesso!")
        print(f"📦 Repositório: https://github.com/{GITHUB_USER}/{REPO_NAME}")
        print(f"🌐 Vercel detectará as mudanças e fará redeploy automaticamente")
        print(f"🔗 Site: https://flexcredi.vercel.app")
        print("\n⏱️  Aguarde 2-3 minutos para o deploy completar")
        return True
    else:
        print("\n❌ Falha ao fazer commit")
        return False

if __name__ == "__main__":
    print("🔧 FLEXCREDI - Fix Vercel Deploy")
    print("=" * 60)
    
    success = trigger_vercel_deploy()
    
    if success:
        print("\n" + "=" * 60)
        print("✅ PROCESSO CONCLUÍDO COM SUCESSO!")
        print("=" * 60)
        print("\n📋 PRÓXIMOS PASSOS:")
        print("1. Aguarde 2-3 minutos")
        print("2. Acesse: https://vercel.com/charles-marques-projects/flexcredi")
        print("3. Verifique o status do deploy")
        print("4. Teste o site: https://flexcredi.vercel.app")
        sys.exit(0)
    else:
        print("\n❌ PROCESSO FALHOU")
        print("Verifique o token do GitHub e tente novamente")
        sys.exit(1)
