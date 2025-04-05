#!/bin/bash

# Configuração esperada
EXPECTED_REPO="git@github.com:Webber-Lubenham/monitoro-connect.git"

# Verifica o repositório origin atual
CURRENT_REPO=$(git remote get-url origin 2>/dev/null)

if [ "$CURRENT_REPO" != "$EXPECTED_REPO" ]; then
  echo "ERRO: Repositório configurado incorretamente!"
  echo "Configuração atual: $CURRENT_REPO"
  echo "Configuração esperada: $EXPECTED_REPO"
  echo ""
  echo "Para corrigir, execute:"
  echo "git remote set-url origin $EXPECTED_REPO"
  echo "git push --set-upstream origin main"
  exit 1
fi

echo "Repositório configurado corretamente: $EXPECTED_REPO"
exit 0
