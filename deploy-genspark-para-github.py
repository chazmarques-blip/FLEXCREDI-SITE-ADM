#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Deploy FLEXCREDI: GenSpark → GitHub → Vercel
Versão que funciona 100% no ambiente GenSpark
"""

import requests
import base64
import os
import time
import sys
from pathlib import Path

# ===== CONFIGURAÇÕES =====
TOKEN = "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"
USER = "chazmarques-blip"
REPO = "FLEXCREDI-COMPLETO"
BRANCH = "main"

# Headers para API GitHub
headers = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

# Arquivos a ignorar
IGNORE_FILES = {
    'upload-projeto-genspark.py', 
    'upload-projeto-github-auto.py',
    'upload-index-completo.py', 
    'deploy-now.py',
    'deploy-genspark-para-github.py',
    'force-redeploy.py',
    'check-github.py',
    'update-index.py'
}

IGNORE_DIRS = {
    '.git', 
    'node_modules', 
    '__pycache__', 
    'venv', 
    '.venv',
    'backend',
    'flexcredi-backend',
    'prisma'
}

def print_header():
    """Exibe cabeçalho"""
    print("\n" + "="*70)
    print("🚀 DEPLOY FLEXCREDI: GENSPARK → GITHUB → VERCEL")
    print("="*70)
    print(f"📦 Repositório: {USER}/{REPO}")
    print(f"🌿 Branch: {BRANCH}")
    print("="*70 + "\n")

def get_file_sha(file_path):
    """Obtém SHA de arquivo existente no GitHub"""
    url = f"https://api.github.com/repos/{USER}/{REPO}/contents/{file_path}"
    try:
        r = requests.get(url, headers=headers, timeout=10)
        if r.status_code == 200:
            return r.json().get('sha')
    except:
        pass
    return None

def upload_file(file_path, content, is_binary=False):
    """Faz upload de um arquivo para o GitHub"""
    url = f"https://api.github.com/repos/{USER}/{REPO}/contents/{file_path}"
    
    # Codifica conteúdo em base64
    if is_binary:
        content_b64 = base64.b64encode(content).decode('utf-8')
    else:
        content_b64 = base64.b64encode(content.encode('utf-8')).decode('utf-8')
    
    # Obtém SHA se arquivo já existe
    sha = get_file_sha(file_path)
    
    # Prepara dados do commit
    data = {
        "message": f"Deploy: {file_path}",
        "content": content_b64,
        "branch": BRANCH
    }
    
    if sha:
        data["sha"] = sha
    
    # Faz upload (com 3 tentativas)
    for attempt in range(3):
        try:
            r = requests.put(url, headers=headers, json=data, timeout=30)
            if r.status_code in [200, 201]:
                return True, r.json()['commit']['sha'][:7]
            elif r.status_code == 422:
                # Arquivo idêntico
                return True, "skip"
            time.sleep(1)
        except Exception as e:
            if attempt == 2:
                return False, str(e)[:50]
            time.sleep(2)
    
    return False, "Timeout"

def is_binary_file(file_path):
    """Detecta se arquivo é binário"""
    binary_extensions = {
        '.jpg', '.jpeg', '.png', '.gif', '.ico', '.pdf', 
        '.zip', '.tar', '.gz', '.mp4', '.mp3', '.woff', '.woff2',
        '.ttf', '.eot', '.webp', '.docx', '.doc'
    }
    return file_path.suffix.lower() in binary_extensions

def format_size(bytes_size):
    """Formata tamanho"""
    if bytes_size < 1024:
        return f"{bytes_size} B"
    elif bytes_size < 1024*1024:
        return f"{bytes_size/1024:.1f} KB"
    else:
        return f"{bytes_size/(1024*1024):.1f} MB"

def get_all_files():
    """Lista todos os arquivos do projeto"""
    files = []
    current_dir = Path('.')
    
    for file_path in current_dir.rglob('*'):
        if file_path.is_file():
            # Ignora pastas específicas
            parts = file_path.parts
            if any(dir_name in IGNORE_DIRS for dir_name in parts):
                continue
            
            # Ignora scripts de deploy
            if file_path.name in IGNORE_FILES:
                continue
            
            # Ignora arquivos ocultos (exceto .gitignore, .vercelignore)
            if file_path.name.startswith('.') and file_path.name not in ['.gitignore', '.vercelignore', '.env', '.env.production']:
                continue
            
            files.append(file_path)
    
    return sorted(files)

def main():
    """Função principal"""
    print_header()
    
    # Verifica se está no GenSpark
    if not os.path.exists('index.html'):
        print("❌ ERRO: Arquivo index.html não encontrado!")
        print("\n💡 Este script deve ser executado da pasta raiz do projeto FLEXCREDI")
        print("   Onde está o arquivo index.html")
        return
    
    print("📁 Analisando arquivos do projeto...")
    files = get_all_files()
    total_files = len(files)
    
    if total_files == 0:
        print("❌ Nenhum arquivo encontrado!")
        return
    
    # Prioriza index.html
    index_files = [f for f in files if f.name == 'index.html']
    other_files = [f for f in files if f.name != 'index.html']
    files = index_files + other_files
    
    print(f"✅ Encontrados {total_files} arquivos para upload")
    
    # Calcula tamanho total
    total_size = sum(f.stat().st_size for f in files)
    print(f"📊 Tamanho total: {format_size(total_size)}")
    
    # Lista principais arquivos
    print("\n📋 Arquivos principais:")
    for f in files[:10]:
        size = format_size(f.stat().st_size)
        print(f"   • {f} ({size})")
    if total_files > 10:
        print(f"   ... e mais {total_files - 10} arquivos")
    
    print(f"\n⏱️  Tempo estimado: {(total_files * 2) // 60 + 1} minutos")
    print("\n" + "="*70)
    
    # Confirmação
    print("\n🤔 Deseja continuar com o upload? (sim/não)")
    resposta = input(">>> ").strip().lower()
    
    if resposta not in ['sim', 's', 'yes', 'y']:
        print("\n❌ Upload cancelado")
        return
    
    print("\n" + "="*70)
    print("🔄 INICIANDO UPLOAD PARA O GITHUB...")
    print("="*70 + "\n")
    
    # Contadores
    success_count = 0
    skip_count = 0
    error_count = 0
    start_time = time.time()
    
    # Upload de cada arquivo
    for idx, file_path in enumerate(files, 1):
        relative_path = str(file_path).replace('\\', '/')
        file_size = file_path.stat().st_size
        
        # Lê conteúdo do arquivo
        try:
            is_binary = is_binary_file(file_path)
            
            if is_binary:
                with open(file_path, 'rb') as f:
                    content = f.read()
            else:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
            
            # Faz upload
            print(f"[{idx:03d}/{total_files}] 📤 {relative_path} ({format_size(file_size)})...", end=" ", flush=True)
            
            success, result = upload_file(relative_path, content, is_binary)
            
            if success:
                if result == "skip":
                    print("⏭️")
                    skip_count += 1
                else:
                    print(f"✅ {result}")
                    success_count += 1
            else:
                print(f"❌ {result}")
                error_count += 1
            
        except Exception as e:
            print(f"❌ Erro: {str(e)[:50]}")
            error_count += 1
        
        # Pausa para não sobrecarregar API
        time.sleep(0.3)
    
    # Relatório final
    elapsed_time = time.time() - start_time
    
    print("\n" + "="*70)
    print("📊 RELATÓRIO FINAL")
    print("="*70)
    print(f"✅ Enviados com sucesso: {success_count}")
    print(f"⏭️  Ignorados (idênticos): {skip_count}")
    print(f"❌ Erros: {error_count}")
    print(f"📦 Total processado: {total_files}")
    print(f"⏱️  Tempo decorrido: {elapsed_time/60:.1f} minutos")
    print("="*70 + "\n")
    
    if error_count == 0 or success_count > 0:
        print("🎉 UPLOAD CONCLUÍDO!\n")
        print("🔗 LINKS IMPORTANTES:")
        print(f"   📦 GitHub: https://github.com/{USER}/{REPO}")
        print(f"   🚀 Vercel Painel: https://vercel.com/charles-marques-projects/flexcredi")
        print(f"   🌐 Site: https://flexcredi.vercel.app")
        print("\n⏱️  O Vercel vai detectar as mudanças e fazer o deploy automaticamente")
        print("   Aguarde 3-5 minutos e teste o site!\n")
        print("✅ Verifique se o carousel com 6 slides está funcionando!")
    else:
        print(f"⚠️  Upload concluído com {error_count} erros")
        print("   Você pode tentar executar o script novamente\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Upload interrompido pelo usuário")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Erro fatal: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
