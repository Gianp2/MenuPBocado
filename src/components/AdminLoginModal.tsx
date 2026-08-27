import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { PuntoBocadoLogo } from './PuntoBocadoLogo';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { auth } from '../lib/firebase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setError('');
      setShowPassword(false);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError('Ingresá tu correo electrónico.');
      return;
    }

    if (!password) {
      setError('Ingresá tu contraseña.');
      return;
    }

    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      // Login correcto
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Error de autenticación:', error);

      const firebaseError = error as {
        code?: string;
        message?: string;
      };

      console.error('Código Firebase:', firebaseError?.code);
      console.error('Mensaje Firebase:', firebaseError?.message);

      switch (firebaseError?.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Correo o contraseña incorrectos.');
          break;

        case 'auth/invalid-email':
          setError('El correo electrónico no es válido.');
          break;

        case 'auth/user-disabled':
          setError('Este usuario está deshabilitado.');
          break;

        case 'auth/too-many-requests':
          setError(
            'Demasiados intentos. Esperá unos minutos e intentá nuevamente.'
          );
          break;

        case 'auth/network-request-failed':
          setError(
            'No se pudo conectar con Firebase. Verificá tu conexión a Internet.'
          );
          break;

        case 'auth/api-key-not-valid':
          setError(
            'La configuración de Firebase no es válida. Verificá la API Key del proyecto.'
          );
          break;

        case 'auth/operation-not-allowed':
          setError(
            'El acceso con correo y contraseña no está habilitado en Firebase.'
          );
          break;

        default:
          setError(
            'No se pudo iniciar sesión. Verificá tus datos e intentá nuevamente.'
          );
          break;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 15,
            }}
            transition={{
              duration: 0.25,
              ease: 'easeOut',
            }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl border border-[#ded8c9] bg-[#fbfaf6] p-6 shadow-2xl sm:p-7"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-[#8a8479] transition-colors hover:bg-[#ece6d8] hover:text-[#272624]"
              title="Cerrar"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Logo & Header */}
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="mb-3 h-16 w-16">
                <PuntoBocadoLogo
                  size="100%"
                  showShadow
                />
              </div>

              <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-[#5b7b68]/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#5b7b68]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Acceso Administrador</span>
              </div>

              <h2 className="font-['Montserrat'] text-xl font-bold text-[#272624]">
                Gestor de Carta Digital
              </h2>

              <p className="mt-1 text-xs text-[#706b61]">
                Ingresá con tu cuenta de administrador para editar precios,
                platos, ingredientes y categorías.
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="mb-1.5 block text-xs font-bold text-[#272624]"
                >
                  Correo electrónico
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8a8479]">
                    <Mail className="h-4 w-4 text-[#c65526]" />
                  </div>

                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);

                      if (error) {
                        setError('');
                      }
                    }}
                    placeholder="admin@bocado.com"
                    autoComplete="email"
                    autoFocus
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-[#d6cfbe] bg-white py-3 pl-10 pr-4 text-sm text-[#272624] shadow-xs transition-all placeholder:text-[#a09a8e] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#c65526] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="mb-1.5 block text-xs font-bold text-[#272624]"
                >
                  Contraseña de Administrador
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8a8479]">
                    <Lock className="h-4 w-4 text-[#c65526]" />
                  </div>

                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);

                      if (error) {
                        setError('');
                      }
                    }}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    disabled={isSubmitting}
                    className="w-full rounded-xl border border-[#d6cfbe] bg-white py-3 pl-10 pr-10 text-sm text-[#272624] shadow-xs transition-all placeholder:text-[#a09a8e] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#c65526] disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    disabled={isSubmitting}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-[#8a8479] hover:text-[#272624] disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      showPassword
                        ? 'Ocultar contraseña'
                        : 'Mostrar contraseña'
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-700"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />

                  <span>{error}</span>
                </motion.div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !email.trim() ||
                  !password
                }
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#c65526] px-4 py-3 text-sm font-bold tracking-wide text-white shadow-md transition-all hover:bg-[#b0481d] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    <span>Verificando...</span>
                  </>
                ) : (
                  <span>Ingresar al Panel</span>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};