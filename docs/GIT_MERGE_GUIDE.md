# Guia Completo para Realizar o Merge

## Passo 1: Preparação
1. Abra o PowerShell como Administrador
2. Navegue até o projeto:
```powershell
cd "c:\Users\ASUS\Documents\GitHub\student-sentinel-hub-main"
```

## Passo 2: Configurar Remote
1. Verifique os remotes existentes:
```powershell
git remote -v
```

2. Se não mostrar "upstream", adicione:
```powershell
git remote add upstream https://github.com/FrankWebber33/student-sentinel-hub.git
```

## Passo 3: Fetch das Mudanças
```powershell
git fetch upstream
```

## Passo 4: Realizar o Merge
```powershell
git merge upstream/main
```

## Solução de Problemas Comuns

### Erro: "Token '&&' não é válido"
- Execute cada comando separadamente
- Pressione Enter após cada comando

### Erro: Conflitos de Merge
1. Liste arquivos com conflitos:
```powershell
git status
```

2. Resolva cada arquivo marcado como "unmerged"
3. Adicione as alterações resolvidas:
```powershell
git add <arquivo>
```

4. Complete o merge:
```powershell
git commit
```

## Verificação Final
1. Confirme o sucesso:
```powershell
git status
git log --oneline --graph -n 10
```

2. Execute testes básicos:
```powershell
npm run dev
