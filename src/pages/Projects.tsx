import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Loader2, Network, Zap, Bot, ChevronRight } from 'lucide-react';
import DecryptedText from '../components/DecryptedText';
import TerminalBreadcrumbs from '../components/TerminalBreadcrumbs';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  image: string;
  githubUrl: string;
  liveUrl: string;
  demoAvailable: boolean;
  status: 'development' | 'live' | 'maintenance';
  features?: string[];
  metrics?: {
    label: string;
    value: string;
  }[];
  integrations?: string[];
}

const aiProjects: Project[] = [
  {
    id: 'smartcad-vision',
    title: "SmartCAD Vision",
    description: "Sistema avanzado de interpretación inteligente de planos industriales que utiliza visión artificial y deep learning para automatizar el proceso de análisis y extracción de información técnica.",
    technologies: ["Python", "TensorFlow", "OpenCV", "AutoCAD API", "FastAPI"],
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    githubUrl: "https://github.com",
    liveUrl: "https://demo.com",
    demoAvailable: true,
    status: 'development',
    features: [
      "Reconocimiento automático de cotas y dimensiones",
      "Extracción de metadatos y especificaciones técnicas",
      "Validación automática de estándares de diseño",
      "Exportación a formatos CAD/CAM compatibles"
    ],
    metrics: [
      { label: "Precisión de reconocimiento", value: "98.5%" },
      { label: "Tiempo promedio de procesamiento", value: "< 5s" },
      { label: "Formatos soportados", value: "15+" }
    ],
    integrations: [
      "AutoCAD", "SolidWorks", "PathOptimizer Pro", "IntelliBot Industry"
    ]
  },
  {
    id: 'pathoptimizer-pro',
    title: "PathOptimizer Pro",
    description: "Sistema híbrido de optimización de trayectorias que combina algoritmos clásicos con computación cuántica para encontrar las rutas más eficientes en procesos industriales.",
    technologies: ["Python", "D-Wave Ocean", "Three.js", "WebGL", "WebSocket"],
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    githubUrl: "https://github.com",
    liveUrl: "https://demo.com",
    demoAvailable: true,
    status: 'development',
    features: [
      "Motor de optimización híbrido cuántico-clásico",
      "Visualización 3D en tiempo real",
      "Simulación de escenarios múltiples",
      "API REST para integración industrial"
    ],
    metrics: [
      { label: "Mejora en eficiencia", value: "35%" },
      { label: "Reducción de tiempo de ciclo", value: "40%" },
      { label: "Ahorro energético", value: "25%" }
    ],
    integrations: [
      "SmartCAD Vision", "IntelliBot Industry", "Sistemas CNC"
    ]
  },
  {
    id: 'intellibot-industry',
    title: "IntelliBot Industry",
    description: "Asistente virtual especializado en manufactura que proporciona soporte técnico en tiempo real y facilita la interacción con los sistemas de automatización.",
    technologies: ["TypeScript", "OpenAI API", "React", "Node.js", "MongoDB"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    githubUrl: "https://github.com",
    liveUrl: "https://demo.com",
    demoAvailable: true,
    status: 'development',
    features: [
      "Procesamiento de lenguaje natural especializado",
      "Integración con base de conocimientos técnicos",
      "Análisis en tiempo real de datos de producción",
      "Interfaz conversacional adaptativa"
    ],
    metrics: [
      { label: "Precisión en respuestas", value: "94%" },
      { label: "Tiempo de respuesta", value: "< 1s" },
      { label: "Base de conocimiento", value: "100K+" }
    ],
    integrations: [
      "SmartCAD Vision", "PathOptimizer Pro", "ERPs industriales"
    ]
  }
];

const Projects = () => {
  const [loading, setLoading] = useState(false);
  const [projects] = useState<Project[]>(aiProjects);

  const launchDemo = async (projectId: string) => {
    try {
      setLoading(true);
      // Preparado para futura integración con sistema de demos
      console.log(`Launching demo for ${projectId}`);
    } catch (error) {
      console.error('Error launching demo:', error);
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
       {/* Tech Grid Background */}
       <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <TerminalBreadcrumbs />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-4">
            <h1 className="sr-only">Ecosistema de IA Industrial</h1>
            <DecryptedText
              text="Ecosistema de IA Industrial"
              className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500"
            />
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Suite integrada de soluciones de vanguardia para la automatización e inteligencia artificial en entornos industriales
          </p>
        </motion.div>

        {/* Sistema Interconectado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-xl mb-16 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-1">
            <div className="bg-[#0a0a0f] p-8">
              <h2 className="text-2xl font-bold text-gray-200 mb-8 text-center flex items-center justify-center">
                <Network className="mr-3 text-purple-400" /> Sistema Interconectado
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-center group cursor-pointer">
                      <div className="w-16 h-16 rounded-2xl bg-gray-800/50 border border-gray-700 flex items-center justify-center mb-3 mx-auto shadow-lg group-hover:border-purple-500/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all">
                        {index === 0 && <Network className="h-8 w-8 text-purple-400 group-hover:text-purple-300" />}
                        {index === 1 && <Zap className="h-8 w-8 text-cyan-400 group-hover:text-cyan-300" />}
                        {index === 2 && <Bot className="h-8 w-8 text-green-400 group-hover:text-green-300" />}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-400 group-hover:text-purple-300 transition-colors">{project.title}</h3>
                    </div>
                    {index < projects.length - 1 && (
                      <ChevronRight className="h-6 w-6 text-gray-600 mx-4" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 gap-12"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={item}
                className="group bg-gray-900/40 border border-gray-800/50 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.1)] hover:-translate-y-1"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 relative overflow-hidden">
                    <motion.img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
                  </div>
                  <div className="p-8 md:w-2/3">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-3xl font-bold text-gray-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all">
                        {project.title}
                      </h2>
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                        project.status === 'live' ? 'bg-green-900/30 text-green-400 border border-green-800' :
                        project.status === 'development' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-800' :
                        'bg-blue-900/30 text-blue-400 border border-blue-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-400 mb-6 leading-relaxed">{project.description}</p>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
                        <span className="w-1 h-6 bg-purple-500 mr-2 rounded-full"></span>
                        Características Principales
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {project.features?.map((feature, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ x: 5 }}
                            className="flex items-center space-x-2 text-gray-400"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                            <span className="text-sm">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {project.metrics?.map((metric, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                          className="bg-gray-800/30 border border-gray-700/50 p-4 rounded-xl text-center transition-colors"
                        >
                          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                            {metric.value}
                          </div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">{metric.label}</div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">Tecnologías</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <motion.span
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm font-medium border border-gray-700 hover:border-purple-500/50 transition-colors"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-200 mb-3">Integraciones</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.integrations?.map((integration, index) => (
                          <motion.span
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1 bg-gray-800/50 text-gray-400 rounded-full text-xs font-medium border border-gray-700/50"
                          >
                            {integration}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 border border-gray-600 transition-all duration-300"
                      >
                        <Github className="h-5 w-5 mr-2" />
                        <span>Ver Código</span>
                      </motion.a>
                      {project.demoAvailable && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => launchDemo(project.id)}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-500 hover:to-blue-500 shadow-lg shadow-purple-900/20 transition-all duration-300"
                          disabled={loading}
                        >
                          <ExternalLink className="h-5 w-5 mr-2" />
                          <span>Demo Live</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Projects;