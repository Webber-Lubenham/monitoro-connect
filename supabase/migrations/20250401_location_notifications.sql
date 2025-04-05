-- Criar tabela para configurações de notificação de localização
CREATE TABLE IF NOT EXISTS location_notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    guardian_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    notify_on_arrival BOOLEAN DEFAULT false,
    notify_on_departure BOOLEAN DEFAULT false,
    notify_on_emergency BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, guardian_id)
);

-- Adicionar índices
CREATE INDEX IF NOT EXISTS idx_location_notification_settings_user ON location_notification_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_location_notification_settings_guardian ON location_notification_settings(guardian_id);

-- Criar função para configurar notificações
CREATE OR REPLACE FUNCTION set_location_notifications(
    p_user_id UUID,
    p_guardian_id UUID,
    p_notify_arrival BOOLEAN DEFAULT false,
    p_notify_departure BOOLEAN DEFAULT false,
    p_notify_emergency BOOLEAN DEFAULT true
) RETURNS VOID AS $$
BEGIN
    INSERT INTO location_notification_settings (
        user_id,
        guardian_id,
        notify_on_arrival,
        notify_on_departure,
        notify_on_emergency
    )
    VALUES (
        p_user_id,
        p_guardian_id,
        p_notify_arrival,
        p_notify_departure,
        p_notify_emergency
    )
    ON CONFLICT (user_id, guardian_id)
    DO UPDATE SET
        notify_on_arrival = p_notify_arrival,
        notify_on_departure = p_notify_departure,
        notify_on_emergency = p_notify_emergency,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Configurar RLS
ALTER TABLE location_notification_settings ENABLE ROW LEVEL SECURITY;

-- Política para inserção/atualização
CREATE POLICY "Users can manage their own notification settings"
    ON location_notification_settings
    FOR ALL
    TO authenticated
    USING (
        auth.uid() = user_id
        OR
        auth.uid() = guardian_id
    )
    WITH CHECK (
        auth.uid() = user_id
        OR
        auth.uid() = guardian_id
    );

-- Trigger para atualizar updated_at
CREATE TRIGGER update_location_notification_settings_updated_at
    BEFORE UPDATE ON location_notification_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 