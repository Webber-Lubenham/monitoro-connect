# Solução para Problemas Identificados no Monitore Connect

## 1. Problema: Múltiplas Instâncias do GoTrueClient
**Arquivo**: `supabase.ts`
**Erro**: "Multiple GoTrueClient instances detected"

### Solução:
```typescript
// Modificar src/lib/supabase.ts para usar singleton pattern
let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storage: localStorage,
        storageKey: 'aberrdeen_supabase_auth',
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });
  }
  return supabaseInstance;
};
```

## 2. Problema: CORS nas Edge Functions
**Erro**: "Blocked by CORS policy"

### Solução:
1. Configurar CORS no Supabase:
```sql
-- Executar no SQL Editor do Supabase
update supabase_functions.functions 
set cors_origins = '{"https://monitoro-connect.lovable.app"}' 
where slug = 'email-service';
```

2. Adicionar headers manualmente nas chamadas:
```typescript
// Modificar src/services/notificationSender.ts
const { data, error } = await supabase.functions.invoke('email-service', {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://monitoro-connect.lovable.app'
  },
  body: JSON.stringify(payload)
});
```

## 3. Problema: 400 Bad Request em notification_logs
**Erro**: Falha ao logar notificações

### Solução:
1. Verificar schema da tabela:
```sql
ALTER TABLE notification_logs
ALTER COLUMN student_id SET NOT NULL,
ALTER COLUMN guardian_id SET NOT NULL;
```

2. Adicionar validação no frontend:
```typescript
// Modificar src/services/notificationSender.ts
if (!notification.student_id || !notification.guardian_id) {
  throw new Error('Missing required fields for notification log');
}
```

## 4. Problema: Verificação Excessiva de Geolocalização
**Arquivo**: `useLocationPermission.ts`

### Solução:
```typescript
// Modificar o hook para verificar apenas uma vez
export function useLocationPermission() {
  const [permission, setPermission] = useState<PermissionState>('prompt');

  useEffect(() => {
    let mounted = true;
    
    const checkPermission = async () => {
      try {
        const status = await navigator.permissions.query({ 
          name: 'geolocation' 
        });
        if (mounted) setPermission(status.state);
        
        status.onchange = () => {
          if (mounted) setPermission(status.state);
        };
      } catch (error) {
        console.error('Error checking geolocation permission:', error);
      }
    };

    checkPermission();
    
    return () => {
      mounted = false;
    };
  }, []); // Empty dependency array to run only once

  return permission;
}
```

## Recomendações Adicionais

1. **Monitoramento**:
```typescript
// Adicionar em src/lib/logger.ts
export function logError(error: Error, context: string) {
  console.error(`[${context}]`, error);
  // Integrar com Sentry/Rollbar futuramente
}
```

2. **Testes Automatizados**:
- Configurar Jest/Vitest para testar:
  - Hooks (useLocationPermission)
  - Serviços (notificationSender)
  - Componentes críticos

3. **Documentação**:
Atualizar README.md com:
- Configuração de CORS
- Solução de problemas comuns
- Guia de implementação de novas Edge Functions

## Próximos Passos
1. Implementar as correções em ordem de prioridade:
   - Singleton do Supabase Client (urgente)
   - Configuração de CORS (urgente)
   - Correção do hook de geolocalização

2. Criar tarefas para:
   - Adicionar monitoramento
   - Implementar testes
   - Atualizar documentação
