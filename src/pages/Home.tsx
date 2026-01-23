import React from 'react';
import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react';
const Background = React.lazy(() => import('../components/Background'));
import ParticleField from '../components/ParticleField';
import Timeline from '../components/Timeline';

const Home = () => {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* Tech Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-[#0a0a0f]" />

      <ParticleField />
      
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <ErrorBoundary>
            <React.Suspense fallback={<div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-purple-900" />}>
              <Canvas camera={{ position: [0, 0, 1] }}>
                <Background />
              </Canvas>
            </React.Suspense>
          </ErrorBoundary>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="/Portfolio/LinkedInProfile.jfif"
              alt="Johan Sebastián Hernández Arias"
              className="w-32 h-32 rounded-full mx-auto mb-8 object-cover ring-4 ring-purple-500 shadow-2xl"
            />
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
              Johan Sebastián Hernández Arias
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Ingeniero en Mecatrónica especializado en Computación Cuántica, Desarrollo de Software y Automatización Industrial. 
              Creando soluciones innovadoras que combinan hardware y software.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center space-x-6"
          >
            <motion.a
              whileHover={{ scale: 1.1, color: '#22d3ee', textShadow: '0 0 8px #22d3ee' }}
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-8 w-8" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, color: '#22d3ee', textShadow: '0 0 8px #22d3ee' }}
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-8 w-8" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.1, color: '#22d3ee', textShadow: '0 0 8px #22d3ee' }}
              href="mailto:johan-willi@hotmail.com"
              className="text-gray-400 transition-colors"
              aria-label="Correo electrónico"
            >
              <Mail className="h-8 w-8" />
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Timeline Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Trayectoria Profesional</h2>
            <p className="text-gray-300">Un viaje a través de mi experiencia profesional</p>
          </motion.div>
          <Timeline />
        </div>
      </section>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-purple-900">
          <ParticleField />
        </div>
      );
    }

    return this.props.children;
  }
}

export default Home;
