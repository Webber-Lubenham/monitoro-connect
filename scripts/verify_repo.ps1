# Configuração esperada
$expectedRepo = "git@github.com:Webber-Lubenham/monitoro-connect.git"

# Verifica o repositório origin atual
$currentRepo = git remote get-url origin

if ($currentRepo -ne $expectedRepo) {
    Write-Host "ERRO: Repositório configurado incorretamente!"
    Write-Host "Configuração atual: $currentRepo"
    Write-Host "Configuração esperada: $expectedRepo"
    Write-Host ""
    Write-Host "Para corrigir, execute:"
    Write-Host "git remote set-url origin $expectedRepo"
    Write-Host "git push --set-upstream origin main"
    exit 1
}

Write-Host "Repositório configurado corretamente: $expectedRepo"
exit 0
