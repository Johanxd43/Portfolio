/*
  # Tablas para Analytics de SmartCAD Vision

  1. Nuevas Tablas
    - `analytics_events`: Registro de eventos del sistema
      - `id` (uuid, primary key)
      - `event_name` (text): Nombre del evento
      - `event_data` (jsonb): Datos del evento
      - `user_id` (uuid): Usuario que generó el evento
      - `timestamp` (timestamptz): Momento del evento
      - `session_id` (uuid): Sesión del usuario
    
    - `analytics_metrics`: Métricas agregadas
      - `id` (uuid, primary key)
      - `metric_name` (text): Nombre de la métrica
      - `value` (numeric): Valor de la métrica
      - `dimensions` (jsonb): Dimensiones de la métrica
      - `timestamp` (timestamptz): Momento de la medición
      - `period` (text): Período de la métrica (hourly, daily, monthly)

    - `analytics_sessions`: Sesiones de usuario
      - `id` (uuid, primary key)
      - `user_id` (uuid): Usuario de la sesión
      - `start_time` (timestamptz): Inicio de sesión
      - `end_time` (timestamptz): Fin de sesión
      - `metadata` (jsonb): Metadatos de la sesión

  2. Security
    - Enable RLS en todas las tablas
    - Políticas para lectura/escritura basadas en roles
*/

-- Tabla de eventos
CREATE TABLE analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name text NOT NULL,
  event_data jsonb DEFAULT '{}',
  user_id uuid REFERENCES auth.users(id),
  timestamp timestamptz DEFAULT now(),
  session_id uuid,
  created_at timestamptz DEFAULT now()
);

-- Tabla de métricas
CREATE TABLE analytics_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  value numeric NOT NULL,
  dimensions jsonb DEFAULT '{}',
  timestamp timestamptz DEFAULT now(),
  period text NOT NULL CHECK (period IN ('hourly', 'daily', 'monthly')),
  created_at timestamptz DEFAULT now()
);

-- Tabla de sesiones
CREATE TABLE analytics_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Índices para optimizar consultas
CREATE INDEX idx_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_events_name ON analytics_events(event_name);
CREATE INDEX idx_events_user ON analytics_events(user_id);
CREATE INDEX idx_metrics_timestamp ON analytics_metrics(timestamp);
CREATE INDEX idx_metrics_name ON analytics_metrics(metric_name);
CREATE INDEX idx_sessions_user ON analytics_sessions(user_id);

-- Habilitar Row Level Security
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad

-- Eventos: Solo administradores pueden ver todos los eventos
CREATE POLICY "Admins can view all events"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Métricas: Administradores pueden ver todas las métricas
CREATE POLICY "Admins can view all metrics"
  ON analytics_metrics
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Sesiones: Usuarios pueden ver sus propias sesiones
CREATE POLICY "Users can view own sessions"
  ON analytics_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Funciones para agregación de métricas

CREATE OR REPLACE FUNCTION calculate_daily_metrics()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Calcular usuarios activos
  INSERT INTO analytics_metrics (metric_name, value, dimensions, period)
  SELECT 
    'active_users',
    COUNT(DISTINCT user_id),
    jsonb_build_object('date', DATE_TRUNC('day', timestamp)),
    'daily'
  FROM analytics_events
  WHERE timestamp >= DATE_TRUNC('day', NOW())
  GROUP BY DATE_TRUNC('day', timestamp);

  -- Calcular archivos procesados
  INSERT INTO analytics_metrics (metric_name, value, dimensions, period)
  SELECT 
    'processed_files',
    COUNT(*),
    jsonb_build_object('date', DATE_TRUNC('day', timestamp)),
    'daily'
  FROM analytics_events
  WHERE event_name = 'file_processed'
  AND timestamp >= DATE_TRUNC('day', NOW())
  GROUP BY DATE_TRUNC('day', timestamp);

  -- Calcular tiempo promedio de procesamiento
  INSERT INTO analytics_metrics (metric_name, value, dimensions, period)
  SELECT 
    'average_processing_time',
    AVG((event_data->>'processing_time')::numeric),
    jsonb_build_object('date', DATE_TRUNC('day', timestamp)),
    'daily'
  FROM analytics_events
  WHERE event_name = 'file_processed'
  AND timestamp >= DATE_TRUNC('day', NOW())
  GROUP BY DATE_TRUNC('day', timestamp);
END;
$$;