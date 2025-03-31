
# Sistema Monitore - Componentes do Sistema

## 📊 Dashboard Principal

Após o login, o usuário é direcionado para o Dashboard (`Dashboard.tsx`), que apresenta:

- Mapa em tempo real mostrando a localização atual
- Cartão de compartilhamento de localização
- Opções de privacidade e configurações
- Botão de emergência para situações críticas

## 🗺️ Sistema de Mapas

O projeto utiliza a integração com MapBox (`src/components/dashboard/map/`) para exibir mapas interativos:

- Visualização em tempo real da localização
- Suporte a diferentes estilos de mapa (satélite, ruas)
- Círculo de precisão para indicar a acurácia da localização
- Controles de zoom e navegação
- Animações suaves de transição ao atualizar a localização

Componentes principais:
- `MapContainer.tsx`: Componente principal que gerencia a renderização do mapa
- `LocationMarker.tsx`: Marcador personalizado para indicar a posição
- `AccuracyCircle.ts`: Visualização da precisão da localização

## 📍 Serviço de Localização

O sistema oferece um serviço robusto de rastreamento de localização:

- Compartilhamento em tempo real
- Controle de intervalo de atualizações
- Suporte a alta precisão
- Detecção automática de permissões de localização
- Tratamento de erros e casos de localização indisponível

Implementação em:
- `useLocationTracking.ts`: Hook principal para gerenciar o rastreamento
- `geolocationService.ts`: Serviço para interagir com a API de Geolocalização
- `locationDatabaseService.ts`: Serviço para salvar localizações no banco de dados

## 👨‍👩‍👧‍👦 Sistema de Responsáveis (Guardiões)

O projeto permite o gerenciamento de múltiplos responsáveis por aluno:

- Adição de responsáveis com nome, email e telefone
- Definição de responsável principal com privilégios especiais
- Exclusão e edição de responsáveis
- Validação de informações de contato

Componentes e serviços:
- `GuardiansList.tsx`: Lista de responsáveis cadastrados
- `GuardianForm.tsx`: Formulário para adicionar/editar responsáveis
- `useGuardians.ts`: Hook para gerenciamento dos dados de responsáveis

## 🚨 Sistema de Emergência

Em situações críticas, o aluno pode acionar o botão de emergência:

- Notificação imediata para todos os responsáveis
- Envio da localização exata
- Status prioritário para tratamento rápido
- Visualização em destaque no mapa

Implementação:
- `EmergencyButton.tsx`: Interface do botão de emergência
- `EmergencyService.ts`: Serviço para processamento de situações de emergência
