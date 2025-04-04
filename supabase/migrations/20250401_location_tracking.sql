-- Criar tabela para armazenar o histórico de localizações
CREATE TABLE IF NOT EXISTS location_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    accuracy DOUBLE PRECISION,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adicionar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_location_history_user_id ON location_history(user_id);
CREATE INDEX IF NOT EXISTS idx_location_history_timestamp ON location_history(timestamp);

-- Criar função para inserir nova localização
CREATE OR REPLACE FUNCTION insert_location(
    p_user_id UUID,
    p_latitude DOUBLE PRECISION,
    p_longitude DOUBLE PRECISION,
    p_accuracy DOUBLE PRECISION DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_location_id UUID;
BEGIN
    INSERT INTO location_history (user_id, latitude, longitude, accuracy)
    VALUES (p_user_id, p_latitude, p_longitude, p_accuracy)
    RETURNING id INTO v_location_id;
    
    RETURN v_location_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar função para obter última localização de um usuário
CREATE OR REPLACE FUNCTION get_last_location(p_user_id UUID)
RETURNS TABLE (
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    accuracy DOUBLE PRECISION,
    timestamp TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        lh.latitude,
        lh.longitude,
        lh.accuracy,
        lh.timestamp
    FROM location_history lh
    WHERE lh.user_id = p_user_id
    ORDER BY lh.timestamp DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Configurar RLS (Row Level Security)
ALTER TABLE location_history ENABLE ROW LEVEL SECURITY;

-- Política para inserção de localização
CREATE POLICY "Users can insert their own location"
    ON location_history
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Política para leitura de localização
CREATE POLICY "Users can read their own location"
    ON location_history
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id
        OR 
        EXISTS (
            SELECT 1 
            FROM guardians g 
            WHERE g.student_id = user_id 
            AND g.guardian_id = auth.uid()
            AND g.status = 'approved'
        )
    );

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_location_history_updated_at
    BEFORE UPDATE ON location_history
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 