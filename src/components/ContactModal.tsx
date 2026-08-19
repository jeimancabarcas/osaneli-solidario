import React, { useState } from 'react';
import { X, Send, Mail, MapPin, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Brigada de Apoyo');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const handleDone = () => {
    setSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#161d16] border border-[#46464d] w-full max-w-xl text-[#dce5d9] p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[85vh] custom-scrollbar">
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-5 right-5 text-[#c6c6ce] hover:text-[#e9c349] transition-colors p-1"
        >
          <X className="w-6 h-6" />
        </button>

        {sent ? (
          <div className="text-center py-8 space-y-5">
            <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500 text-emerald-400 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-anybody text-[24px] font-bold text-[#dce5d9] uppercase">
              Mensaje Recibido
            </h4>
            <p className="text-[14px] text-[#c6c6ce]">
              Nuestro equipo de enlace comunitario responderá a la brevedad posible. Gracias por tender la mano a Colombia.
            </p>
            <button
              onClick={handleDone}
              className="py-3 px-6 bg-[#e9c349] text-[#241a00] font-mono-tag font-bold uppercase text-[12px] tracking-wider hover:bg-[#ffe088] transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="border-b border-[#46464d] pb-4">
              <span className="font-mono-tag text-[11px] text-[#e9c349] uppercase tracking-[0.2em] font-bold">
                Enlace Directo
              </span>
              <h3 className="font-anybody text-[26px] font-bold text-[#dce5d9] uppercase tracking-tight mt-1">
                Contacto · OSANELI Solidaridad
              </h3>
              <p className="text-[14px] text-[#c6c6ce] mt-1">
                Para organizaciones de rescate, voluntarios, prensas y alianzas de apoyo.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[12px] font-mono-tag">
              <div className="p-3 bg-[#1a221a] border border-[#46464d] flex items-center gap-2 text-[#c6c6ce]">
                <Mail className="w-4 h-4 text-[#e9c349] flex-shrink-0" />
                <span className="truncate">solidaridad@osaneli.co</span>
              </div>
              <a
                href="https://wa.me/573236737646?text=Hola%20OSANELI,%20deseo%20comunicarme%20con%20ustedes."
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#1a221a] border border-[#46464d] hover:border-[#25D366] flex items-center gap-2 text-[#25D366] transition-colors"
              >
                <span className="font-bold">+57 323 6737646</span>
              </a>
              <div className="p-3 bg-[#1a221a] border border-[#46464d] flex items-center gap-2 text-[#c6c6ce]">
                <MapPin className="w-4 h-4 text-[#e9c349] flex-shrink-0" />
                <span>Cartagena, Colombia</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block mb-1">
                  Nombre o Entidad
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre o brigada"
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-3 text-[13px] focus:border-[#e9c349] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-3 text-[13px] focus:border-[#e9c349] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block mb-1">
                  Motivo
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-3 text-[13px] font-mono-tag focus:border-[#e9c349] focus:outline-none"
                >
                  <option value="Brigada de Apoyo">Brigada o Voluntariado en Terreno</option>
                  <option value="Donación Corporativa">Donación Corporativa / Institucional</option>
                  <option value="Prensa y Difusión">Prensa y Cobertura</option>
                  <option value="Consulta General">Consulta sobre Pedidos de la Colección</option>
                </select>
              </div>

              <div>
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block mb-1">
                  Mensaje
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Cuéntanos cómo podemos coordinar..."
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-3 text-[13px] focus:border-[#e9c349] focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#e9c349] text-[#241a00] font-mono-tag font-bold text-[13px] uppercase tracking-wider hover:bg-[#ffe088] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Enviar Mensaje de Enlace</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
