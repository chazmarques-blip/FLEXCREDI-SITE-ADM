#!/usr/bin/env python3
"""
Verifica o conteúdo do index.html que está no GitHub
"""

import requests
import base64

TOKEN = "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"
USER = "chazmarques-blip"
REPO = "FLEXCREDI-COMPLETO"
FILE = "index.html"

headers = {
    "Authorization": f"token {TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

print("🔍 VERIFICANDO INDEX.HTML NO GITHUB")
print("=" * 60)

# Obter arquivo do GitHub
url = f"https://api.github.com/repos/{USER}/{REPO}/contents/{FILE}"
response = requests.get(url, headers=headers)

if response.status_code != 200:
    print(f"❌ Erro: {response.status_code}")
    print(response.text)
    exit(1)

data = response.json()

# Decodificar conteúdo
content = base64.b64decode(data["content"]).decode('utf-8')

# Informações básicas
print(f"\n📊 INFORMAÇÕES DO ARQUIVO:")
print(f"   Nome: {data['name']}")
print(f"   Tamanho: {data['size']} bytes ({data['size'] / 1024:.1f} KB)")
print(f"   SHA: {data['sha'][:7]}...")
print(f"   Última atualização: {data.get('commit', {}).get('date', 'N/A')}")

# Verificar carousel
print(f"\n🎠 VERIFICANDO CAROUSEL:")

slides_found = []
mosaic_images = [
    'mosaic-restaurant.jpg',
    'mosaic-beauty.jpg', 
    'mosaic-construction.jpg',
    'mosaic-foodtruck.jpg',
    'mosaic-auto.jpg',
    'mosaic-retail.jpg'
]

for mosaic in mosaic_images:
    if mosaic in content:
        slides_found.append(mosaic)
        print(f"   ✅ {mosaic}")
    else:
        print(f"   ❌ {mosaic} - NÃO ENCONTRADO!")

print(f"\n📊 RESULTADO:")
print(f"   Total de slides encontrados: {len(slides_found)}/6")

if len(slides_found) == 6:
    print(f"   ✅ CAROUSEL COMPLETO NO GITHUB!")
else:
    print(f"   ❌ CAROUSEL INCOMPLETO - Faltam {6 - len(slides_found)} slides")

# Verificar estrutura do carousel
if 'class="hero-carousel"' in content:
    print(f"\n✅ Estrutura HTML do carousel encontrada")
else:
    print(f"\n❌ Estrutura HTML do carousel NÃO encontrada")

if 'carousel-slide' in content:
    print(f"✅ Classes de slides encontradas")
else:
    print(f"❌ Classes de slides NÃO encontradas")

# Contar quantas vezes aparece "carousel-slide"
slide_count = content.count('class="carousel-slide')
print(f"\n📊 Total de elementos carousel-slide: {slide_count}")

# Verificar CSS
print(f"\n🎨 VERIFICANDO CSS:")
css_files = [
    'css/style.css',
    'css/carousel-fix.css',
    'css/layout-adjustments.css'
]

for css in css_files:
    if css in content:
        print(f"   ✅ {css}")
    else:
        print(f"   ❌ {css} - não referenciado")

# Primeiras linhas
print(f"\n📄 PRIMEIRAS 20 LINHAS DO ARQUIVO:")
print("=" * 60)
lines = content.split('\n')[:20]
for i, line in enumerate(lines, 1):
    print(f"{i:3d}: {line[:75]}")

print("\n" + "=" * 60)
print("✅ VERIFICAÇÃO CONCLUÍDA")
print("=" * 60)
