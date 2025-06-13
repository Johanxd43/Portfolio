import React from 'react';
import { Download, Briefcase, GraduationCap, Award, MapPin, Mail, Phone } from 'lucide-react';

const Resume = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Currículum</h1>
        <a 
          href="/Portfolio/Johan_CV_ES.pdf" 
          download
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Download className="h-5 w-5 mr-2" />
          Descargar PDF
        </a>
      </div>

      {/* Información de contacto */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Información de Contacto</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-gray-700">johan-willi@hotmail.com</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-gray-700">(+34) 629903206</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-gray-700">Donostia – San Sebastian</span>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center mb-4">
          <Briefcase className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Experiencia Profesional</h2>
        </div>
        <div className="border-l-2 border-gray-200 pl-4 space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Consultor Logístico Funcional</h3>
            <p className="text-gray-600">Landoo • Enero 2024 - Diciembre 2024</p>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              <li>Gestión de procesos logísticos en proyectos internacionales</li>
              <li>Implementación de soluciones Odoo para optimización empresarial</li>
              <li>Optimización de cadenas de suministro y flujos de trabajo</li>
              <li>Coordinación con equipos multidisciplinarios en entornos globales</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Desarrollador de Software</h3>
            <p className="text-gray-600">Multiverse Computing • Septiembre 2022 - Diciembre 2023</p>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              <li>Desarrollo de soluciones cuánticas para la industria utilizando Python</li>
              <li>Programación con bibliotecas especializadas en computación cuántica</li>
              <li>Colaboración directa con fabricantes de maquinaria CNC</li>
              <li>Optimización de algoritmos para procesos industriales</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Operador de Almacén</h3>
            <p className="text-gray-600">Beauty by Dia, S.A • Enero 2022 - Agosto 2022</p>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              <li>Supervisión del lugar de trabajo y coordinación de equipos</li>
              <li>Preparación eficiente de pedidos y gestión de inventarios</li>
              <li>Despacho de materiales y control de calidad</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Asistente Cualificado</h3>
            <p className="text-gray-600">Latexco • Marzo 2017 - Diciembre 2021</p>
            <ul className="mt-2 list-disc list-inside text-gray-600">
              <li>Adaptación a la previsión de producción diaria</li>
              <li>Realización de tareas de mantenimiento preventivo</li>
              <li>Limpieza e inspección especializada de maquinaria industrial</li>
              <li>Cumplimiento de estándares de seguridad y calidad</li>
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
            <p className="text-sm text-gray-500 mt-1">Enfoque en sistemas integrados de hardware y software para aplicaciones industriales</p>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center mb-4">
          <Award className="h-6 w-6 text-blue-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Habilidades y Competencias</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Computación Cuántica</h3>
            <p className="text-gray-600 text-sm">Python, D-Wave Ocean SDK, Qiskit, SciPy, Algoritmos de Optimización</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Desarrollo de Software</h3>
            <p className="text-gray-600 text-sm">Python, C++, JavaScript, Odoo, PostgreSQL, Git</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Automatización Industrial</h3>
            <p className="text-gray-600 text-sm">Sistemas CNC, MATLAB, Control de Procesos, Robótica</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Gestión Logística</h3>
            <p className="text-gray-600 text-sm">Supply Chain Management, Optimización de Procesos, Gestión de Proyectos</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Idiomas</h3>
            <p className="text-gray-600 text-sm">Español (Nativo), Inglés (Nivel B1 - Intermedio)</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Habilidades Blandas</h3>
            <p className="text-gray-600 text-sm">Liderazgo de Equipos, Comunicación Efectiva, Resolución de Problemas</p>
          </div>
        </div>
      </section>

      {/* Sección adicional de competencias técnicas */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Competencias Técnicas Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Tecnologías Emergentes</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Algoritmos cuánticos para optimización industrial</li>
              <li>• Integración de IA en procesos manufactureros</li>
              <li>• Sistemas de control inteligente</li>
            </ul>
          </div>
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Gestión y Liderazgo</h3>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• Coordinación de equipos multidisciplinarios</li>
              <li>• Gestión de proyectos internacionales</li>
              <li>• Implementación de mejoras continuas</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Resume;
