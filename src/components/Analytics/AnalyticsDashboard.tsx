import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsivePie } from '@nivo/pie';
import { useAnalytics } from '../../hooks/useAnalytics';
import { motion } from 'framer-motion';
import { Activity, Users, Clock, FileCheck, Cpu, Database, Globe } from 'lucide-react';
import QuantumLoader from '../QuantumLoader';
import TerminalBreadcrumbs from '../TerminalBreadcrumbs';
import DecryptedText from '../DecryptedText';

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
      <div className="flex items-center justify-center h-screen bg-[#0a0a0f]">
        <QuantumLoader size={48} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0f] text-red-400 font-mono">
        <Activity className="w-6 h-6 mr-2 animate-pulse" />
        Error de conexión con el sistema de análisis
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-4 sm:p-8">
      {/* Tech Grid Background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-7xl mx-auto">
        <TerminalBreadcrumbs />

        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="sr-only">Dashboard de Analytics</h1>
            <DecryptedText
              text="Mission Control Center"
              className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400"
            />
            <p className="text-gray-400 font-mono text-sm mt-2 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              SYSTEM_STATUS: ONLINE
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="bg-gray-900/50 border border-gray-800 p-2 rounded-lg backdrop-blur-sm">
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="bg-gray-900/50 border border-gray-800 p-2 rounded-lg backdrop-blur-sm">
              <Database className="w-5 h-5 text-purple-400" />
            </div>
            <div className="bg-gray-900/50 border border-gray-800 p-2 rounded-lg backdrop-blur-sm">
              <Globe className="w-5 h-5 text-pink-400" />
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Users, label: "Usuarios Activos", value: data.activeUsers, color: "purple" },
            { icon: FileCheck, label: "Archivos Procesados", value: data.processedFiles, color: "cyan" },
            { icon: Cpu, label: "Tiempo de Proceso", value: `${data.averageProcessingTime}s`, color: "green" },
            { icon: Activity, label: "Eficiencia", value: `${data.successRate}%`, color: "yellow" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/40 border border-gray-800 backdrop-blur-sm p-6 rounded-xl hover:border-purple-500/30 transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 text-${stat.color}-400 group-hover:scale-110 transition-transform`} />
                <span className={`h-2 w-2 rounded-full bg-${stat.color}-500 shadow-[0_0_8px_rgba(255,255,255,0.5)]`} />
              </div>
              <div className="text-gray-400 text-sm font-mono uppercase tracking-wider">{stat.label}</div>
              <div className="text-3xl font-bold text-white mt-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-colors">
                {stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900/40 border border-gray-800 backdrop-blur-sm p-6 rounded-xl h-[400px]"
          >
            <h3 className="text-lg font-bold text-gray-200 mb-6 flex items-center">
              <Activity className="w-5 h-5 text-cyan-400 mr-2" />
              Telemetría del Sistema
            </h3>
            <div className="h-[300px]">
              <ResponsiveLine
                data={[
                  {
                    id: 'Usuarios',
                    color: '#8b5cf6',
                    data: data.timelineData.map(d => ({ x: d.date, y: d.users }))
                  },
                  {
                    id: 'Archivos',
                    color: '#06b6d4',
                    data: data.timelineData.map(d => ({ x: d.date, y: d.files }))
                  }
                ]}
                theme={{
                  axis: {
                    ticks: { text: { fill: '#9ca3af' } },
                    legend: { text: { fill: '#e5e7eb' } }
                  },
                  grid: { line: { stroke: '#374151', strokeDasharray: '4 4' } },
                  crosshair: { line: { stroke: '#f3f4f6' } }
                }}
                margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
                xScale={{ type: 'time', format: '%Y-%m-%d', precision: 'day' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
                axisLeft={{ tickSize: 5, tickPadding: 5, tickRotation: 0, legend: 'Actividad', legendOffset: -40, legendPosition: 'middle' }}
                colors={['#8b5cf6', '#06b6d4']}
                pointSize={8}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                enableArea={true}
                areaOpacity={0.1}
                useMesh={true}
                enableGridX={false}
              />
            </div>
          </motion.div>

          {/* Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/40 border border-gray-800 backdrop-blur-sm p-6 rounded-xl h-[400px]"
          >
            <h3 className="text-lg font-bold text-gray-200 mb-6 flex items-center">
              <Users className="w-5 h-5 text-purple-400 mr-2" />
              Segmentación de Usuarios
            </h3>
            <div className="h-[300px]">
              <ResponsivePie
                data={data.userDistribution}
                theme={{
                  labels: { text: { fill: '#e5e7eb' } }
                }}
                height={300}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                innerRadius={0.6}
                padAngle={0.5}
                cornerRadius={4}
                colors={['#8b5cf6', '#06b6d4', '#ec4899', '#6366f1']}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#9ca3af"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                enableArcLabels={false}
              />
            </div>
          </motion.div>

          {/* Recent Activity Log */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-gray-900/40 border border-gray-800 backdrop-blur-sm p-6 rounded-xl"
          >
            <h3 className="text-lg font-bold text-gray-200 mb-6 flex items-center">
              <TerminalBreadcrumbs />
              <span className="ml-auto text-xs font-mono text-cyan-400">./logs/recent_activity.log</span>
            </h3>
            <div className="mt-4 space-y-2 font-mono text-sm">
              {data.recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 border-l-2 border-gray-700 bg-gray-900/50 hover:bg-gray-800/50 hover:border-cyan-500 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-500">[{new Date(activity.timestamp).toLocaleTimeString()}]</span>
                    <span className={activity.type === 'file_processed' ? 'text-green-400' : 'text-purple-400'}>
                      {activity.type.toUpperCase()}
                    </span>
                    <span className="text-gray-300">USER:{activity.user}</span>
                  </div>
                  {activity.details?.error && (
                    <span className="text-red-400">[ERROR: {activity.details.error}]</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;