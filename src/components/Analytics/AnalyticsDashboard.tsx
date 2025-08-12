import React, { useState, useEffect } from 'react';
import { Card, Title, Text, Tab, TabList, Grid } from '@tremor/react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { useAnalytics } from '../../hooks/useAnalytics';
import { motion } from 'framer-motion';
import { Activity, Users, Clock, FileCheck } from 'lucide-react';

interface AnalyticsData {
  activeUsers: number;
  processedFiles: number;
  averageProcessingTime: number;
  successRate: number;
  errorRate: number;
  timelineData: Array<{
    date: string;
    users: number;
    files: number;
    errors: number;
    avgProcessingTime: number;
  }>;
  userDistribution: Array<{
    type: string;
    value: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: string;
    user: string;
    timestamp: string;
    details: Record<string, unknown>;
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const { getAnalytics, isLoading, error } = useAnalytics();
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const analyticsData = await getAnalytics();
      setData(analyticsData);
    };
    fetchData();
    // Actualizar cada 5 minutos
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center text-red-500 p-4">
        Error cargando analytics
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-8">
        <Title>Dashboard de Analytics</Title>
        <Text>Métricas y estadísticas del sistema SmartCAD Vision</Text>
      </div>

      <TabList
        defaultValue="overview"
        className="mb-8"
      >
        <Tab value="overview" text="Vista General" />
        <Tab value="users" text="Usuarios" />
        <Tab value="files" text="Archivos" />
        <Tab value="performance" text="Rendimiento" />
      </TabList>

      <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="col-span-1"
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-purple-500" />
              <div>
                <Text>Usuarios Activos</Text>
                <Title>{data.activeUsers}</Title>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="col-span-1"
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <FileCheck className="w-8 h-8 text-blue-500" />
              <div>
                <Text>Archivos Procesados</Text>
                <Title>{data.processedFiles}</Title>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="col-span-1"
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-green-500" />
              <div>
                <Text>Tiempo Promedio</Text>
                <Title>{data.averageProcessingTime}s</Title>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="col-span-1"
        >
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Activity className="w-8 h-8 text-yellow-500" />
              <div>
                <Text>Tasa de Éxito</Text>
                <Title>{data.successRate}%</Title>
              </div>
            </div>
          </Card>
        </motion.div>
      </Grid>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-4">
          <Title>Actividad en el Tiempo</Title>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ResponsiveLine
              data={[
                {
                  id: 'users',
                  data: data.timelineData.map(d => ({
                    x: d.date,
                    y: d.users
                  }))
                },
                {
                  id: 'files',
                  data: data.timelineData.map(d => ({
                    x: d.date,
                    y: d.files
                  }))
                }
              ]}
              margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
              xScale={{
                type: 'time',
                format: '%Y-%m-%d',
                precision: 'day',
              }}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Cantidad',
                legendOffset: -40,
              }}
              pointSize={8}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'color' }}
              enablePointLabel={true}
              enableArea={true}
            />
          </motion.div>
        </Card>

        <Card className="p-4">
          <Title>Distribución de Usuarios</Title>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ResponsivePie
              data={data.userDistribution}
              height={300}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              innerRadius={0.5}
              padAngle={0.7}
              cornerRadius={3}
              colors={{ scheme: 'purple_blue' }}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              enableArcLinkLabels={true}
              arcLinkLabelsSkipAngle={10}
              arcLinkLabelsTextColor="#333333"
            />
          </motion.div>
        </Card>

        <Card className="p-4 lg:col-span-2">
          <Title>Actividad Reciente</Title>
          <div className="mt-4 space-y-4">
            {data.recentActivity.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'file_processed' 
                      ? 'bg-green-100 text-green-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {activity.type === 'file_processed' ? <FileCheck className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                  </div>
                  <div>
                    <Text>{activity.type}</Text>
                    <Text className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </Text>
                  </div>
                </div>
                {activity.details?.error && (
                  <span className="text-red-500 text-sm">Error: {activity.details.error}</span>
                )}
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;