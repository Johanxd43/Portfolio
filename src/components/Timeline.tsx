import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
  {
    year: '2024',
    title: 'Consultor Logístico Funcional',
    company: 'Landoo',
    period: 'Enero - Diciembre 2024',
    description: 'Gestión de procesos logísticos y optimización de flujos de trabajo en proyectos internacionales. Implementación de soluciones tecnológicas (Odoo) para mejorar la eficiencia empresarial.',
    status: 'completed'
  },
  {
    year: '2022-2023',
    title: 'Desarrollador de Software',
    company: 'Multiverse Computing',
    period: 'Septiembre 2022 - Diciembre 2023',
    description: 'Desarrollo de soluciones cuánticas para la industria utilizando Python y bibliotecas especializadas. Colaboración directa con fabricantes de maquinaria CNC para optimización de procesos.',
    status: 'completed'
  },
  {
    year: '2022',
    title: 'Operador de Almacén',
    company: 'Beauty by Dia, S.A',
    period: 'Enero - Agosto 2022',
    description: 'Supervisión del lugar de trabajo y coordinación de equipos. Preparación eficiente de pedidos, gestión de inventarios y despacho de materiales.',
    status: 'completed'
  },
  {
    year: '2017-2021',
    title: 'Asistente Cualificado',
    company: 'Latexco',
    period: 'Marzo 2017 - Diciembre 2021',
    description: 'Adaptación a la previsión de producción diaria. Realización de tareas de mantenimiento preventivo, limpieza e inspección especializada de maquinaria industrial.',
    status: 'completed'
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
                className="bg-white p-6 rounded-lg shadow-xl border-l-4 border-purple-500"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-xl font-bold text-purple-600 ${index % 2 === 0 ? 'ml-auto' : ''}`}>
                    {item.year}
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.status === 'completed' ? 'Completado' : 'En curso'}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600 mb-2 font-medium">{item.company}</p>
                <p className="text-xs text-gray-500 mb-3">{item.period}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            </div>
            
            {/* Punto central */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-purple-500 shadow-lg border-2 border-white"></div>
            </div>
            
            {/* Espacio opuesto */}
            <div className="w-5/12"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}