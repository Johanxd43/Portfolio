import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import DecryptedText from '../components/DecryptedText';
import TerminalBreadcrumbs from '../components/TerminalBreadcrumbs';
import { useToast } from '../context/ToastContext';

const Contact = () => {
  const { success } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulamos un envío exitoso
    setTimeout(() => {
      success("¡Mensaje enviado correctamente! Te contactaré pronto.");
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

        <div className="flex justify-center mb-8">
          <h1 className="sr-only">Contacto</h1>
          <DecryptedText
            text="Contacto"
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg backdrop-blur-sm mb-8">
              <h2 className="text-2xl font-bold text-gray-200 mb-4">Ponte en Contacto</h2>
              <p className="text-gray-400 mb-6">
                Estoy interesado en escuchar sobre nuevos proyectos y oportunidades.
                ¡No dudes en contactarme!
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center group">
                  <Mail className="h-6 w-6 text-cyan-400 mr-3 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-gray-200 font-medium">Email</p>
                    <a href="mailto:johan-willi@hotmail.com" className="text-gray-400 hover:text-cyan-300 transition-colors">
                      johan-willi@hotmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center group">
                  <Phone className="h-6 w-6 text-cyan-400 mr-3 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-gray-200 font-medium">Teléfono</p>
                    <a href="tel:+34629903206" className="text-gray-400 hover:text-cyan-300 transition-colors">
                      (+34) 629903206
                    </a>
                  </div>
                </div>

                <div className="flex items-center group">
                  <MapPin className="h-6 w-6 text-cyan-400 mr-3 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-gray-200 font-medium">Ubicación</p>
                    <p className="text-gray-400">Donostia – San Sebastian, España</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-lg backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-200 mb-4">Enviar Mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-600"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-600"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                  Asunto
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-600"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-600"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02]"
              >
                <Send className="h-5 w-5 mr-2" />
                Enviar Mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;