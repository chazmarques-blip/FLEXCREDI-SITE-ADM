#!/usr/bin/env python3
"""
Script para fazer upload COMPLETO do projeto FLEXCREDI para o GitHub
Executa direto do ambiente GenSpark
"""

import os
import base64
import requests
import time
from pathlib import Path

# Configurações
GITHUB_TOKEN = "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"
GITHUB_USER = "chazmarques-blip"
REPO_NAME = "FLEXCREDI-COMPLETO"
BRANCH = "main"

headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

print("=" * 70)
print("🚀 UPLOAD COMPLETO DO PROJETO FLEXCREDI PARA O GITHUB")
print("=" * 70)

# Arquivos e pastas para ignorar
IGNORE_PATTERNS = [
    '__pycache__',
    '.git',
    'node_modules',
    '.DS_Store',
    '.env',
    'venv',
    '*.pyc',
    '.gitignore',
    'upload-projeto-completo.py',  # Este script
    'package-lock.json'
]

def should_ignore(file_path):
    """Verifica se o arquivo deve ser ignorado"""
    path_str = str(file_path)
    for pattern in IGNORE_PATTERNS:
        if pattern in path_str:
            return True
    return False

def get_all_files(directory='.'):
    """Lista todos os arquivos do projeto"""
    files = []
    for root, dirs, filenames in os.walk(directory):
        # Remover diretórios ignorados
        dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d))]
        
        for filename in filenames:
            filepath = os.path.join(root, filename)
            if not should_ignore(filepath):
                files.append(filepath)
    return files

def upload_file(file_path):
    """Faz upload de um arquivo para o GitHub"""
    # Caminho relativo sem ./
    relative_path = file_path.lstrip('./')
    
    print(f"\n📤 Uploading: {relative_path}")
    
    try:
        # Ler arquivo
        with open(file_path, 'rb') as f:
            content = f.read()
        
        # Converter para base64
        content_base64 = base64.b64encode(content).decode('utf-8')
        
        # URL da API
        url = f"https://api.github.com/repos/{GITHUB_USER}/{REPO_NAME}/contents/{relative_path}"
        
        # Verificar se arquivo já existe
        response = requests.get(url, headers=headers)
        sha = None
        if response.status_code == 200:
            sha = response.json().get('sha')
            print(f"   ℹ️  Arquivo existe, será substituído")
        
        # Preparar dados
        data = {
            "message": f"Upload: {relative_path}",
            "content": content_base64,
            "branch": BRANCH
        }
        
        if sha:
            data["sha"] = sha
        
        # Fazer upload
        response = requests.put(url, headers=headers, json=data)
        
        if response.status_code in [200, 201]:
            print(f"   ✅ Sucesso!")
            return True
        else:
            print(f"   ❌ Erro {response.status_code}: {response.text[:200]}")
            return False
            
    except Exception as e:
        print(f"   ❌ Erro: {str(e)}")
        return False

def main():
    print("\n🔍 Listando arquivos do projeto...")
    files = get_all_files()
    
    print(f"\n📊 Total de arquivos encontrados: {len(files)}")
    
    # Mostrar alguns exemplos
    print("\n📁 Exemplos de arquivos que serão enviados:")
    for f in files[:10]:
        print(f"   - {f}")
    if len(files) > 10:
        print(f"   ... e mais {len(files) - 10} arquivos")
    
    # Confirmar
    print("\n" + "=" * 70)
    print("⚠️  ATENÇÃO: Isso vai SUBSTITUIR todos os arquivos no GitHub!")
    print("=" * 70)
    
    response = input("\n🤔 Deseja continuar? (sim/não): ")
    
    if response.lower() not in ['sim', 's', 'yes', 'y']:
        print("\n❌ Upload cancelado pelo usuário")
        return
    
    print("\n" + "=" * 70)
    print("📤 INICIANDO UPLOAD...")
    print("=" * 70)
    
    success_count = 0
    failed_count = 0
    
    # Ordenar: primeiro arquivos raiz, depois por pasta
    files.sort()
    
    for i, file_path in enumerate(files, 1):
        print(f"\n[{i}/{len(files)}]", end=" ")
        
        if upload_file(file_path):
            success_count += 1
        else:
            failed_count += 1
        
        # Pequeno delay para não sobrecarregar a API
        time.sleep(0.5)
    
    # Resultado final
    print("\n" + "=" * 70)
    print("📊 RESULTADO DO UPLOAD")
    print("=" * 70)
    print(f"✅ Sucessos: {success_count}")
    print(f"❌ Falhas: {failed_count}")
    print(f"📁 Total: {len(files)}")
    
    if failed_count == 0:
        print("\n" + "=" * 70)
        print("🎉 UPLOAD COMPLETO COM SUCESSO!")
        print("=" * 70)
        print(f"\n🔗 Repositório: https://github.com/{GITHUB_USER}/{REPO_NAME}")
        print(f"🌐 Vercel: https://flexcredi.vercel.app")
        print(f"\n⏱️  Aguarde 3-5 minutos para o Vercel fazer deploy")
    else:
        print(f"\n⚠️  {failed_count} arquivos falharam. Verifique os erros acima.")

if __name__ == "__main__":
    main()
