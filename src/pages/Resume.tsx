import React from 'react';
import { Download, Briefcase, GraduationCap, Award } from 'lucide-react';

const Resume = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Currículum</h1>
        <a 
          href="/resume.pdf" 
          download
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Download className="h-5 w-5 mr-2" />
          Descargar PDF
        </a>
      </div>

      <section className="mb-12">
        <div className="flex items-center mb-4">
          <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Experiencia Profesional</h2>
        </div>
        <div className="border-l-2 border-gray-200 pl-4 space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Consultor Logístico Funcional</h3>
            <p className="text-gray-600">Landoo • 2024 - Presente</p>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              <li>Gestión de procesos logísticos en proyectos internacionales</li>
              <li>Implementación de soluciones Odoo</li>
              <li>Optimización de cadenas de suministro</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Desarrollador de Software</h3>
            <p className="text-gray-600">Multiverse Computing • 2022 - 2023</p>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              <li>Desarrollo de soluciones cuánticas industriales</li>
              <li>Programación en Python y bibliotecas especializadas</li>
              <li>Colaboración con fabricantes de CNC</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center mb-4">
          <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Educación</h2>
        </div>
        <div className="border-l-2 border-gray-200 pl-4 space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Ingeniería en Mecatrónica</h3>
            <p className="text-gray-600">Universidad de Zaragoza • 2017 - Presente</p>
            <p className="text-gray-600">Especialización en Automatización y Control Industrial</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center mb-4">
          <Award className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Habilidades</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Computación Cuántica</h3>
            <p className="text-gray-600">Python, D-Wave, SciPy, Optimización</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Desarrollo Software</h3>
            <p className="text-gray-600">Python, C++, Odoo, PostgreSQL</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Automatización</h3>
            <p className="text-gray-600">CNC, MATLAB, Sistemas de Control</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Logística</h3>
            <p className="text-gray-600">Gestión de Procesos, Supply Chain</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Idiomas</h3>
            <p className="text-gray-600">Español (Nativo), Inglés (B1)</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Soft Skills</h3>
            <p className="text-gray-600">Liderazgo, Trabajo en Equipo, Comunicación</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resume;