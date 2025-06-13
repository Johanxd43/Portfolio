import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
  {
    year: '2024',
    title: 'Consultor Logístico Funcional',
    company: 'Landoo',
    description: 'Gestión de procesos logísticos y optimización de flujos de trabajo en proyectos internacionales. Implementación de soluciones tecnológicas (Odoo).'
  },
  {
    year: '2023',
    title: 'Desarrollador de Software',
    company: 'Multiverse Computing',
    description: 'Desarrollo de soluciones cuánticas para la industria utilizando Python y bibliotecas especializadas. Colaboración con fabricantes de maquinaria CNC.'
  },
  {
    year: '2022',
    title: 'Operador de Almacén',
    company: 'Beauty by Dia, S.A',
    description: 'Supervisión del lugar de trabajo y miembros del equipo. Preparación de pedidos y despacho de materiales.'
  },
  {
    year: '2017',
    title: 'Asistente Cualificado',
    company: 'Latexco',
    description: 'Adaptación a la previsión de producción diaria. Realización de tareas de mantenimiento, limpieza e inspección de maquinaria.'
  }
];

export default function Timeline() {
  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Línea central */}
      <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-purple-400 to-blue-500"></div>
      
      {timelineData.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.2 }}
          className="relative mb-16"
        >
          <div className={`flex items-center ${index % 2 === 0 ? 'flex-row-reverse' : ''}`}>
            {/* Contenido */}
            <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-lg shadow-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-xl font-bold text-purple-600 ${index % 2 === 0 ? 'ml-auto' : ''}`}>
                    {item.year}
                  </h3>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{item.company}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            </div>
            
            {/* Punto central */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-purple-500 shadow-lg"></div>
            </div>
            
            {/* Espacio opuesto */}
            <div className="w-5/12"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}