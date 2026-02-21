#!/usr/bin/env python3
"""
SOLUÇÃO COMPLETA: Upload automático do projeto FLEXCREDI para GitHub
Execute este arquivo e aguarde. Tudo será feito automaticamente!
"""

import os
import base64
import requests
import time
import json

# ==================== CONFIGURAÇÕES ====================
GITHUB_TOKEN = "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"
GITHUB_USER = "chazmarques-blip"
REPO_NAME = "FLEXCREDI-COMPLETO"
BRANCH = "main"

headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

# Arquivos prioritários (enviar primeiro)
PRIORITY_FILES = ['index.html', 'vercel.json', 'package.json']

# Ignorar estes arquivos
IGNORE = ['__pycache__', '.git', 'node_modules', '.DS_Store', '.env', '*.pyc', 
          'upload-projeto-github-auto.py', 'package-lock.json', '.gitignore']

# ==================== FUNÇÕES ====================

def print_header(text):
    print("\n" + "=" * 70)
    print(f"  {text}")
    print("=" * 70)

def should_ignore(path):
    for pattern in IGNORE:
        if pattern in str(path):
            return True
    return False

def get_files():
    """Coleta todos os arquivos"""
    files = []
    for root, dirs, filenames in os.walk('.'):
        dirs[:] = [d for d in dirs if not should_ignore(os.path.join(root, d))]
        for filename in filenames:
            filepath = os.path.join(root, filename)
            if not should_ignore(filepath):
                files.append(filepath.lstrip('./'))
    return files

def get_file_size(filepath):
    """Retorna tamanho do arquivo em KB"""
    try:
        return os.path.getsize(filepath) / 1024
    except:
        return 0

def upload_file_to_github(filepath):
    """Upload de um arquivo para o GitHub"""
    try:
        # Ler arquivo (binário para suportar imagens)
        with open(filepath, 'rb') as f:
            content = f.read()
        
        # Converter para base64
        content_base64 = base64.b64encode(content).decode('utf-8')
        
        # URL da API
        url = f"https://api.github.com/repos/{GITHUB_USER}/{REPO_NAME}/contents/{filepath}"
        
        # Verificar se existe (para obter SHA)
        response = requests.get(url, headers=headers)
        sha = response.json().get('sha') if response.status_code == 200 else None
        
        # Preparar dados
        data = {
            "message": f"auto: {filepath}",
            "content": content_base64,
            "branch": BRANCH
        }
        
        if sha:
            data["sha"] = sha
        
        # Upload
        response = requests.put(url, headers=headers, json=data)
        
        return response.status_code in [200, 201]
        
    except Exception as e:
        print(f"      ⚠️ Erro: {str(e)[:50]}")
        return False

def main():
    print_header("🚀 UPLOAD AUTOMÁTICO - FLEXCREDI → GITHUB")
    
    print("\n📊 Analisando projeto...")
    files = get_files()
    
    # Separar por tipo
    html_files = [f for f in files if f.endswith('.html')]
    css_files = [f for f in files if f.endswith('.css')]
    js_files = [f for f in files if f.endswith('.js')]
    img_files = [f for f in files if any(f.endswith(ext) for ext in ['.jpg', '.png', '.svg', '.gif', '.jpeg'])]
    other_files = [f for f in files if f not in html_files + css_files + js_files + img_files]
    
    print(f"\n   📄 HTML: {len(html_files)} arquivos")
    print(f"   🎨 CSS: {len(css_files)} arquivos")
    print(f"   ⚡ JS: {len(js_files)} arquivos")
    print(f"   🖼️  Imagens: {len(img_files)} arquivos")
    print(f"   📦 Outros: {len(other_files)} arquivos")
    print(f"\n   📊 TOTAL: {len(files)} arquivos")
    
    # Calcular tamanho total
    total_size = sum(get_file_size(f) for f in files)
    print(f"   💾 Tamanho total: {total_size:.1f} KB ({total_size/1024:.1f} MB)")
    
    print_header("📤 INICIANDO UPLOAD PARA O GITHUB")
    print("\n⏱️  Tempo estimado: 5-10 minutos")
    print("☕ Pegue um café e aguarde...\n")
    
    # Ordenar por prioridade
    priority = [f for f in files if any(p in f for p in PRIORITY_FILES)]
    rest = [f for f in files if f not in priority]
    ordered_files = priority + rest
    
    success = 0
    failed = 0
    
    for i, filepath in enumerate(ordered_files, 1):
        size = get_file_size(filepath)
        
        # Determinar emoji por tipo
        if filepath.endswith('.html'):
            emoji = "📄"
        elif filepath.endswith('.css'):
            emoji = "🎨"
        elif filepath.endswith('.js'):
            emoji = "⚡"
        elif any(filepath.endswith(ext) for ext in ['.jpg', '.png', '.svg']):
            emoji = "🖼️"
        else:
            emoji = "📦"
        
        print(f"[{i:3d}/{len(files)}] {emoji} {filepath:<50} {size:>6.1f}KB ", end='', flush=True)
        
        if upload_file_to_github(filepath):
            print("✅")
            success += 1
        else:
            print("❌")
            failed += 1
        
        # Delay para não sobrecarregar API
        time.sleep(0.3)
    
    # Resultado
    print_header("📊 RESULTADO FINAL")
    
    print(f"\n   ✅ Sucesso: {success}/{len(files)}")
    print(f"   ❌ Falhas: {failed}/{len(files)}")
    print(f"   📈 Taxa de sucesso: {(success/len(files)*100):.1f}%")
    
    if failed == 0:
        print_header("🎉 UPLOAD 100% COMPLETO!")
        print(f"\n   🔗 GitHub: https://github.com/{GITHUB_USER}/{REPO_NAME}")
        print(f"   🌐 Vercel: https://flexcredi.vercel.app")
        print(f"\n   ⏱️  Aguarde 3-5 minutos para o Vercel fazer deploy")
        print(f"   ✅ Depois acesse o site e veja o carousel funcionando!")
    else:
        print(f"\n   ⚠️  {failed} arquivos falharam")
        print(f"   💡 Execute o script novamente para tentar os que falharam")
    
    print("\n" + "=" * 70 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n❌ Upload interrompido pelo usuário")
    except Exception as e:
        print(f"\n\n❌ Erro fatal: {str(e)}")
