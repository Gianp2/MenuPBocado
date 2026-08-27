import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Eye, EyeOff, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { PuntoBocadoLogo } from './PuntoBocadoLogo';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DEFAULT_PASSWORD = 'adminbocado';

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError('');
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check custom saved admin password or default 'adminbocado'
    const savedPassword = localStorage.getItem('pb_admin_custom_password') || DEFAULT_PASSWORD;

    if (
      password.trim() === savedPassword ||
      password.trim() === DEFAULT_PASSWORD ||
      password.trim() === 'adminbocado'
    ) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess();
        onClose();
      }, 300);
    } else {
      setError('Contraseña incorrecta. Verificá los caracteres e intentá nuevamente.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          onClick={onClose}
        />

        {/* Dialog Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-sm bg-[#fbfaf6] rounded-3xl border border-[#ded8c9] shadow-2xl p-6 sm:p-7 overflow-hidden z-10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-[#8a8479] hover:text-[#272624] hover:bg-[#ece6d8] transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo Crest & Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 mb-3">
              <PuntoBocadoLogo size="100%" showShadow />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5b7b68]/10 text-[#5b7b68] text-[11px] font-bold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acceso Administrador</span>
            </div>
            <h2 className="text-xl font-bold text-[#272624] font-['Montserrat']">
              Gestor de Carta Digital
            </h2>
            <p className="text-xs text-[#706b61] mt-1">
              Ingresá tu clave para editar precios, platos, ingredientes y categorías.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#272624] mb-1.5">
                Contraseña de Administrador
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8a8479]">
                  <Lock className="w-4 h-4 text-[#c65526]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="••••••••••••"
                  autoFocus
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white border border-[#d6cfbe] text-sm text-[#272624] placeholder-[#a09a8e] focus:outline-none focus:ring-2 focus:ring-[#c65526] focus:border-transparent transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8a8479] hover:text-[#272624]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !password.trim()}
              className="w-full py-3 px-4 rounded-xl bg-[#c65526] hover:bg-[#b0481d] disabled:opacity-50 text-white font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Ingresar al Panel</span>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
