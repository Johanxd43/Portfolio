import React from 'react';
import { Download, Briefcase, GraduationCap, Award, MapPin, Mail, Phone } from 'lucide-react';
import DecryptedText from '../components/DecryptedText';
import TerminalBreadcrumbs from '../components/TerminalBreadcrumbs';
import SkillsUniverse from '../components/SkillsUniverse';

const Resume = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white py-16 relative">
      {/* Tech Grid Background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <TerminalBreadcrumbs />

        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center">
            <h1 className="sr-only">Currículum</h1>
            <DecryptedText
              text="Currículum Vitae"
              className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500"
            />
          </div>
          <a
            href="/Portfolio/Johan_CV_ES.pdf"
            download
            className="flex items-center px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 hover:border-blue-400 transition-all backdrop-blur-sm"
          >
            <Download className="h-5 w-5 mr-2" />
            Descargar PDF
          </a>
        </div>

        {/* Información de contacto */}
        <section className="mb-12 bg-gray-900/50 border border-gray-800 p-6 rounded-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-gray-200 mb-4 flex items-center">
            <span className="text-purple-400 mr-2">#</span> Información de Contacto
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center">
            <Mail className="h-5 w-5 text-cyan-400 mr-2" />
            <span className="text-gray-300">johan-willi@hotmail.com</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-5 w-5 text-cyan-400 mr-2" />
            <span className="text-gray-300">(+34) 629903206</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-cyan-400 mr-2" />
            <span className="text-gray-300">Donostia – San Sebastian</span>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center mb-6">
          <Briefcase className="h-6 w-6 text-purple-400 mr-3" />
          <h2 className="text-2xl font-bold text-gray-200">Experiencia Profesional</h2>
        </div>
        <div className="border-l-2 border-gray-800 pl-6 space-y-12">
          <div className="relative">
            <span className="absolute -left-[29px] top-2 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-gray-900" />
            <h3 className="text-xl font-semibold text-cyan-300">Consultor Logístico Funcional</h3>
            <p className="text-gray-400 mb-2">Landoo • Enero 2024 - Diciembre 2024</p>
            <ul className="mt-2 space-y-2 text-gray-300">
              <li>• Gestión de procesos logísticos en proyectos internacionales</li>
              <li>• Implementación de soluciones Odoo para optimización empresarial</li>
              <li>• Optimización de cadenas de suministro y flujos de trabajo</li>
              <li>• Coordinación con equipos multidisciplinarios en entornos globales</li>
            </ul>
          </div>
          <div className="relative">
            <span className="absolute -left-[29px] top-2 w-3 h-3 rounded-full bg-purple-500/50 ring-4 ring-gray-900" />
            <h3 className="text-xl font-semibold text-cyan-300">Desarrollador de Software</h3>
            <p className="text-gray-400 mb-2">Multiverse Computing • Septiembre 2022 - Diciembre 2023</p>
            <ul className="mt-2 space-y-2 text-gray-300">
              <li>• Desarrollo de soluciones cuánticas para la industria utilizando Python</li>
              <li>• Programación con bibliotecas especializadas en computación cuántica</li>
              <li>• Colaboración directa con fabricantes de maquinaria CNC</li>
              <li>• Optimización de algoritmos para procesos industriales</li>
            </ul>
          </div>
          <div className="relative">
            <span className="absolute -left-[29px] top-2 w-3 h-3 rounded-full bg-gray-700 ring-4 ring-gray-900" />
            <h3 className="text-xl font-semibold text-gray-300">Operador de Almacén</h3>
            <p className="text-gray-500 mb-2">Beauty by Dia, S.A • Enero 2022 - Agosto 2022</p>
            <ul className="mt-2 space-y-2 text-gray-400">
              <li>• Supervisión del lugar de trabajo y coordinación de equipos</li>
              <li>• Preparación eficiente de pedidos y gestión de inventarios</li>
              <li>• Despacho de materiales y control de calidad</li>
            </ul>
          </div>
          <div className="relative">
            <span className="absolute -left-[29px] top-2 w-3 h-3 rounded-full bg-gray-700 ring-4 ring-gray-900" />
            <h3 className="text-xl font-semibold text-gray-300">Asistente Cualificado</h3>
            <p className="text-gray-500 mb-2">Latexco • Marzo 2017 - Diciembre 2021</p>
            <ul className="mt-2 space-y-2 text-gray-400">
              <li>• Adaptación a la previsión de producción diaria</li>
              <li>• Realización de tareas de mantenimiento preventivo</li>
              <li>• Limpieza e inspección especializada de maquinaria industrial</li>
              <li>• Cumplimiento de estándares de seguridad y calidad</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center mb-6">
          <GraduationCap className="h-6 w-6 text-purple-400 mr-3" />
          <h2 className="text-2xl font-bold text-gray-200">Educación</h2>
        </div>
        <div className="border-l-2 border-gray-800 pl-6 space-y-8">
          <div className="relative">
             <span className="absolute -left-[29px] top-2 w-3 h-3 rounded-full bg-purple-500 ring-4 ring-gray-900" />
            <h3 className="text-xl font-semibold text-cyan-300">Ingeniería en Mecatrónica</h3>
            <p className="text-gray-400">Universidad de Zaragoza • 2017 - Presente</p>
            <p className="text-gray-400">Especialización en Automatización y Control Industrial</p>
            <p className="text-sm text-gray-500 mt-1">Enfoque en sistemas integrados de hardware y software para aplicaciones industriales</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center mb-6">
          <Award className="h-6 w-6 text-purple-400 mr-3" />
          <h2 className="text-2xl font-bold text-gray-200">Habilidades y Competencias</h2>
        </div>

        {/* 3D Skills Cloud */}
        <SkillsUniverse />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-lg hover:border-purple-500/50 transition-colors">
            <h3 className="font-semibold text-cyan-300 mb-2">Computación Cuántica</h3>
            <p className="text-gray-400 text-sm">Python, D-Wave Ocean SDK, Qiskit, SciPy, Algoritmos de Optimización</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-lg hover:border-purple-500/50 transition-colors">
            <h3 className="font-semibold text-cyan-300 mb-2">Desarrollo de Software</h3>
            <p className="text-gray-400 text-sm">Python, C++, JavaScript, Odoo, PostgreSQL, Git</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-lg hover:border-purple-500/50 transition-colors">
            <h3 className="font-semibold text-cyan-300 mb-2">Automatización Industrial</h3>
            <p className="text-gray-400 text-sm">Sistemas CNC, MATLAB, Control de Procesos, Robótica</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-lg hover:border-purple-500/50 transition-colors">
            <h3 className="font-semibold text-cyan-300 mb-2">Gestión Logística</h3>
            <p className="text-gray-400 text-sm">Supply Chain Management, Optimización de Procesos, Gestión de Proyectos</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-lg hover:border-purple-500/50 transition-colors">
            <h3 className="font-semibold text-cyan-300 mb-2">Idiomas</h3>
            <p className="text-gray-400 text-sm">Español (Nativo), Inglés (Nivel B1 - Intermedio)</p>
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-lg hover:border-purple-500/50 transition-colors">
            <h3 className="font-semibold text-cyan-300 mb-2">Habilidades Blandas</h3>
            <p className="text-gray-400 text-sm">Liderazgo de Equipos, Comunicación Efectiva, Resolución de Problemas</p>
          </div>
        </div>
      </section>

      {/* Sección adicional de competencias técnicas */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold text-gray-200 mb-6">Competencias Técnicas Destacadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-blue-300 mb-3">Tecnologías Emergentes</h3>
            <ul className="text-blue-200/80 text-sm space-y-1">
              <li>• Algoritmos cuánticos para optimización industrial</li>
              <li>• Integración de IA en procesos manufactureros</li>
              <li>• Sistemas de control inteligente</li>
            </ul>
          </div>
          <div className="bg-gradient-to-br from-green-900/20 to-teal-900/20 border border-green-800/30 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-green-300 mb-3">Gestión y Liderazgo</h3>
            <ul className="text-green-200/80 text-sm space-y-1">
              <li>• Coordinación de equipos multidisciplinarios</li>
              <li>• Gestión de proyectos internacionales</li>
              <li>• Implementación de mejoras continuas</li>
            </ul>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Resume;