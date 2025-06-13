import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, Loader2, Network, Zap, Bot, ArrowRight, ChevronRight } from 'lucide-react';

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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
            Ecosistema de IA Industrial
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Suite integrada de soluciones de vanguardia para la automatización e inteligencia artificial en entornos industriales
          </p>
        </motion.div>

        {/* Sistema Interconectado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl mb-16 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-1">
            <div className="bg-white p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                Sistema Interconectado
              </h2>
              <div className="flex flex-wrap justify-center items-center gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center mb-3 mx-auto shadow-lg">
                        {index === 0 && <Network className="h-8 w-8 text-purple-600" />}
                        {index === 1 && <Zap className="h-8 w-8 text-blue-600" />}
                        {index === 2 && <Bot className="h-8 w-8 text-green-600" />}
                      </div>
                      <h3 className="text-sm font-semibold text-gray-800">{project.title}</h3>
                    </div>
                    {index < projects.length - 1 && (
                      <ChevronRight className="h-6 w-6 text-gray-400 mx-4" />
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
                className="group bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 relative overflow-hidden">
                    <motion.img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-8 md:w-2/3">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {project.title}
                      </h2>
                      <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                        project.status === 'live' ? 'bg-green-100 text-green-800' :
                        project.status === 'development' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">{project.description}</p>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Características Principales</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {project.features?.map((feature, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ x: 5 }}
                            className="flex items-center space-x-2 text-gray-600"
                          >
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                            <span className="text-sm">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {project.metrics?.map((metric, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ scale: 1.05 }}
                          className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl text-center"
                        >
                          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {metric.value}
                          </div>
                          <div className="text-sm text-gray-600">{metric.label}</div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tecnologías</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <motion.span
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-gray-800 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Integraciones</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.integrations?.map((integration, index) => (
                          <motion.span
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="px-3 py-1 bg-gradient-to-r from-purple-50 to-blue-50 text-gray-800 rounded-full text-sm font-medium"
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
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                      >
                        <Github className="h-5 w-5 mr-2" />
                        <span>Ver Código</span>
                      </motion.a>
                      {project.demoAvailable && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => launchDemo(project.id)}
                          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 text-gray-800 rounded-lg hover:from-purple-200 hover:to-blue-200 transition-all duration-300"
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