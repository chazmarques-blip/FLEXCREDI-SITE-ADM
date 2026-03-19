#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Upload Automático de Projeto GenSpark para GitHub
Versão otimizada que funciona direto do ambiente GenSpark
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
IGNORE = {
    '.git', '.gitignore', 'node_modules', '__pycache__', 
    '.env', '.DS_Store', 'venv', '.venv',
    'upload-projeto-genspark.py', 'upload-projeto-github-auto.py',
    'upload-index-completo.py', 'deploy-now.py'
}

def print_header():
    """Exibe cabeçalho do script"""
    print("\n" + "="*70)
    print("🚀 UPLOAD AUTOMÁTICO - PROJETO FLEXCREDI → GITHUB")
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
        "message": f"Upload: {file_path}",
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
                # Arquivo idêntico, não precisa upload
                return True, "skip"
            time.sleep(1)
        except Exception as e:
            if attempt == 2:
                return False, str(e)
            time.sleep(2)
    
    return False, "Timeout"

def get_all_files():
    """Lista todos os arquivos do projeto"""
    files = []
    current_dir = Path('.')
    
    for file_path in current_dir.rglob('*'):
        if file_path.is_file():
            # Ignora arquivos/pastas da lista IGNORE
            if any(ignore in str(file_path).split(os.sep) for ignore in IGNORE):
                continue
            
            # Ignora arquivos temporários
            if file_path.name.startswith('.') and file_path.name != '.env.example':
                continue
            
            files.append(file_path)
    
    return sorted(files)

def is_binary_file(file_path):
    """Detecta se arquivo é binário"""
    binary_extensions = {
        '.jpg', '.jpeg', '.png', '.gif', '.ico', '.pdf', 
        '.zip', '.tar', '.gz', '.mp4', '.mp3', '.woff', '.woff2',
        '.ttf', '.eot', '.svg', '.webp'
    }
    return file_path.suffix.lower() in binary_extensions

def format_size(bytes):
    """Formata tamanho em KB/MB"""
    if bytes < 1024:
        return f"{bytes} B"
    elif bytes < 1024*1024:
        return f"{bytes/1024:.1f} KB"
    else:
        return f"{bytes/(1024*1024):.1f} MB"

def main():
    """Função principal"""
    print_header()
    
    # Lista todos os arquivos
    print("📁 Analisando arquivos do projeto...")
    files = get_all_files()
    total_files = len(files)
    
    if total_files == 0:
        print("❌ Nenhum arquivo encontrado!")
        print("\n💡 DICA: Execute este script da pasta raiz do projeto")
        print("   Exemplo: cd /caminho/para/FLEXCREDI-COMPLETO")
        return
    
    print(f"✅ Encontrados {total_files} arquivos para upload\n")
    
    # Calcula tamanho total
    total_size = sum(f.stat().st_size for f in files)
    print(f"📊 Tamanho total: {format_size(total_size)}")
    print(f"⏱️  Tempo estimado: {(total_files * 2) // 60} minutos\n")
    
    # Confirmação
    print("🤔 Deseja continuar? (sim/não)")
    resposta = input(">>> ").strip().lower()
    
    if resposta not in ['sim', 's', 'yes', 'y']:
        print("\n❌ Upload cancelado pelo usuário")
        return
    
    print("\n" + "="*70)
    print("🔄 INICIANDO UPLOAD...")
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
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            
            # Faz upload
            print(f"[{idx:03d}/{total_files}] 📤 {relative_path} ({format_size(file_size)})...", end=" ")
            sys.stdout.flush()
            
            success, result = upload_file(relative_path, content, is_binary)
            
            if success:
                if result == "skip":
                    print("⏭️  (idêntico)")
                    skip_count += 1
                else:
                    print(f"✅ ({result})")
                    success_count += 1
            else:
                print(f"❌ {result}")
                error_count += 1
            
        except Exception as e:
            print(f"❌ Erro ao ler arquivo: {e}")
            error_count += 1
        
        # Pequena pausa para não sobrecarregar API
        time.sleep(0.5)
    
    # Relatório final
    elapsed_time = time.time() - start_time
    
    print("\n" + "="*70)
    print("📊 RELATÓRIO FINAL")
    print("="*70)
    print(f"✅ Enviados: {success_count}")
    print(f"⏭️  Ignorados (idênticos): {skip_count}")
    print(f"❌ Erros: {error_count}")
    print(f"📦 Total: {total_files}")
    print(f"⏱️  Tempo: {elapsed_time/60:.1f} minutos")
    print("="*70 + "\n")
    
    if error_count == 0:
        print("🎉 UPLOAD CONCLUÍDO COM SUCESSO!\n")
        print("🔗 Links importantes:")
        print(f"   📦 Repositório: https://github.com/{USER}/{REPO}")
        print(f"   🚀 Vercel: https://vercel.com/charles-marques-projects/flexcredi")
        print(f"   🌐 Site: https://flexcredi.vercel.app")
        print("\n⏱️  Aguarde 3-5 minutos para o deploy no Vercel")
        print("✅ Depois teste o site para confirmar que tudo está funcionando!\n")
    else:
        print(f"⚠️  UPLOAD CONCLUÍDO COM {error_count} ERROS")
        print("\n💡 Você pode tentar fazer upload manual dos arquivos que falharam")
        print(f"   ou executar o script novamente para tentar apenas os que falharam.\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Upload interrompido pelo usuário")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Erro fatal: {e}")
        sys.exit(1)
