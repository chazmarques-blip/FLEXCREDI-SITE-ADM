import requests
import base64

# Configurações
TOKEN = "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"
USER = "chazmarques-blip"
REPO = "FLEXCREDI-COMPLETO"
headers = {"Authorization": f"token {TOKEN}", "Accept": "application/vnd.github.v3+json"}

print("🚀 Iniciando upload do index.html para o GitHub...")

# Lê o arquivo index.html
try:
    with open('index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    print(f"✅ Arquivo lido: {len(content)} bytes ({len(content)/1024:.1f} KB)")
    
    # Obtém SHA do arquivo existente
    url = f"https://api.github.com/repos/{USER}/{REPO}/contents/index.html"
    r = requests.get(url, headers=headers)
    sha = r.json().get('sha', '') if r.status_code == 200 else None
    
    if sha:
        print(f"📦 Arquivo existe no GitHub (SHA: {sha[:7]}), substituindo...")
    else:
        print("📦 Criando novo arquivo no GitHub...")
    
    # Codifica em base64
    content_b64 = base64.b64encode(content.encode('utf-8')).decode('utf-8')
    
    # Prepara dados
    data = {
        "message": "fix: Upload completo do index.html com carousel de 6 slides",
        "content": content_b64,
        "branch": "main"
    }
    
    if sha:
        data["sha"] = sha
    
    # Faz upload
    print("📤 Enviando para o GitHub...")
    r = requests.put(url, headers=headers, json=data)
    
    if r.status_code in [200, 201]:
        commit_sha = r.json()['commit']['sha'][:7]
        print(f"✅ INDEX.HTML ENVIADO COM SUCESSO!")
        print(f"📦 Commit: {commit_sha}")
        print(f"🔗 GitHub: https://github.com/{USER}/{REPO}")
        print(f"🚀 Vercel: https://vercel.com/charles-marques-projects/flexcredi")
        print(f"🌐 Site (aguarde 5 min): https://flexcredi.vercel.app")
    else:
        print(f"❌ Erro {r.status_code}: {r.text}")
        
except Exception as e:
    print(f"❌ Erro: {e}")
