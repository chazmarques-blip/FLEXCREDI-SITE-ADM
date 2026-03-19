#!/bin/bash

##################################################################
# FLEXCREDI API - Script de Teste Completo
# Testa todos os endpoints REST da API v4.0
##################################################################

BASE_URL="${1:-http://localhost:3001}"
echo "======================================================================"
echo "  FLEXCREDI API v4.0 - TESTE DE ENDPOINTS"
echo "======================================================================"
echo "Base URL: $BASE_URL"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para testar endpoint
test_endpoint() {
  local method=$1
  local endpoint=$2
  local data=$3
  local description=$4
  
  echo -e "${YELLOW}[TEST]${NC} $method $endpoint - $description"
  
  if [ -z "$data" ]; then
    response=$(curl -s -X $method "$BASE_URL$endpoint" -H "Content-Type: application/json")
  else
    response=$(curl -s -X $method "$BASE_URL$endpoint" -H "Content-Type: application/json" -d "$data")
  fi
  
  # Check if response is valid JSON
  if echo "$response" | jq empty 2>/dev/null; then
    echo -e "${GREEN}✓ OK${NC}"
    echo "$response" | jq -C '.' | head -20
  else
    echo -e "${RED}✗ FAILED${NC}"
    echo "$response" | head -10
  fi
  echo "----------------------------------------------------------------------"
  echo ""
}

# ==================== HEALTH & TEST ====================
echo ""
echo "======================================================================"
echo "  1. HEALTH & TEST ENDPOINTS"
echo "======================================================================"
echo ""

test_endpoint "GET" "/health" "" "Health check"
test_endpoint "GET" "/api/test" "" "Simple test"

# ==================== PARTNERS ====================
echo ""
echo "======================================================================"
echo "  2. PARTNERS ENDPOINTS"
echo "======================================================================"
echo ""

# Test POST /api/partners (criar novo parceiro)
PARTNER_DATA='{
  "companyName": "Loja Exemplo LTDA",
  "tradeName": "Loja Exemplo",
  "cnpj": "12345678000199",
  "email": "contato@lojaexemplo.com",
  "phone": "(11) 98765-4321",
  "address": "Rua Exemplo, 123",
  "city": "São Paulo",
  "state": "SP",
  "zipCode": "01234-567",
  "legalRepName": "João Silva",
  "legalRepCpf": "12345678900",
  "legalRepEmail": "joao@lojaexemplo.com",
  "legalRepPhone": "(11) 91234-5678",
  "bankName": "Banco Exemplo",
  "bankBranch": "1234",
  "bankAccount": "56789-0",
  "bankAccountType": "CHECKING",
  "bankRoutingNumber": "123",
  "monthlyRevenue": 50000,
  "monthlyReceivables": 30000
}'

test_endpoint "POST" "/api/partners" "$PARTNER_DATA" "Criar novo parceiro"

# Test GET /api/partners (listar parceiros)
test_endpoint "GET" "/api/partners" "" "Listar todos parceiros"
test_endpoint "GET" "/api/partners?status=PENDING" "" "Listar parceiros pendentes"
test_endpoint "GET" "/api/partners?limit=5" "" "Listar 5 parceiros"

# ==================== APPLICATIONS ====================
echo ""
echo "======================================================================"
echo "  3. APPLICATIONS ENDPOINTS"
echo "======================================================================"
echo ""

# Para testar applications, primeiro precisamos de um partnerId
# Vamos assumir um ID fictício para o teste
APPLICATION_DATA='{
  "clientName": "Maria Silva",
  "clientEmail": "maria@example.com",
  "clientPhone": "(11) 98765-4321",
  "clientCpf": "12345678900",
  "clientAddress": "Rua Exemplo, 456",
  "clientCity": "São Paulo",
  "clientState": "SP",
  "clientZipCode": "01234-567",
  "desiredAmount": 25000,
  "purpose": "Renovação de estoque",
  "monthlyIncome": 8000,
  "employmentStatus": "EMPLOYED",
  "employer": "Empresa ABC",
  "occupation": "Gerente",
  "partnerId": "00000000-0000-0000-0000-000000000000"
}'

test_endpoint "POST" "/api/applications" "$APPLICATION_DATA" "Criar nova aplicação"

# Test GET /api/applications
test_endpoint "GET" "/api/applications" "" "Listar todas aplicações"
test_endpoint "GET" "/api/applications?status=PENDING" "" "Listar aplicações pendentes"
test_endpoint "GET" "/api/applications?limit=5" "" "Listar 5 aplicações"

# ==================== ADMIN ====================
echo ""
echo "======================================================================"
echo "  4. ADMIN ENDPOINTS"
echo "======================================================================"
echo ""

test_endpoint "GET" "/api/admin/dashboard" "" "Dashboard administrativo"
test_endpoint "GET" "/api/admin/stats/monthly" "" "Estatísticas mensais"
test_endpoint "GET" "/api/admin/stats/monthly?months=3" "" "Estatísticas últimos 3 meses"
test_endpoint "GET" "/api/admin/system-settings" "" "Buscar configurações do sistema"

# ==================== SUMMARY ====================
echo ""
echo "======================================================================"
echo "  TESTE COMPLETO FINALIZADO"
echo "======================================================================"
echo ""
echo "Todos os endpoints foram testados."
echo "Verifique os resultados acima para identificar erros."
echo ""
echo "Para testar com outro servidor, execute:"
echo "  ./test-api.sh https://sua-api.railway.app"
echo ""
