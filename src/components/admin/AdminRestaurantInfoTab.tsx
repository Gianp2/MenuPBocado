import React, { useState } from 'react';
import { Save, Check, KeyRound, Wifi, Phone, Clock, MapPin, Instagram, Store, Lock } from 'lucide-react';
import { RestaurantInfoType } from '../../context/MenuContext';

interface AdminRestaurantInfoTabProps {
  info: RestaurantInfoType;
  onSave: (updated: Partial<RestaurantInfoType>) => void;
}

export const AdminRestaurantInfoTab: React.FC<AdminRestaurantInfoTabProps> = ({
  info,
  onSave,
}) => {
  const [formData, setFormData] = useState<RestaurantInfoType>({ ...info });
  const [isSaved, setIsSaved] = useState(false);

  // Custom admin password change
  const [customPassword, setCustomPassword] = useState(
    () => localStorage.getItem('pb_admin_custom_password') || ''
  );
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPassword.trim()) {
      localStorage.setItem('pb_admin_custom_password', customPassword.trim());
    } else {
      localStorage.removeItem('pb_admin_custom_password');
    }
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
      {/* General Restaurant Details Form */}
      <form onSubmit={handleSubmit} className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#ded8c9] shadow-xs space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[#e8e2d4]">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-[#c65526] shrink-0" />
            <h3 className="font-bold text-sm sm:text-base text-[#272624]">
              Información del Local & Carta
            </h3>
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#c65526] hover:bg-[#b0481d] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? '¡Guardado!' : 'Guardar Cambios'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div>
            <label className="block text-xs font-bold text-[#272624] mb-1">
              Nombre del Establecimiento
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcfbf7] border border-[#ded8c9] text-xs sm:text-sm text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#272624] mb-1">
              Eslogan / Subtítulo
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcfbf7] border border-[#ded8c9] text-xs sm:text-sm text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#272624] mb-1">
            Descripción breve para el Footer y Bienvenida
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-3.5 py-2 rounded-xl bg-[#fcfbf7] border border-[#ded8c9] text-xs sm:text-sm text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
          <div>
            <label className="block text-xs font-bold text-[#272624] mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c65526]" />
              <span>Dirección</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#fcfbf7] border border-[#ded8c9] text-xs text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#272624] mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#c65526]" />
              <span>Horarios de Atención</span>
            </label>
            <input
              type="text"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#fcfbf7] border border-[#ded8c9] text-xs text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
          <div>
            <label className="block text-xs font-bold text-[#272624] mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#5b7b68]" />
              <span>Teléfono Visible</span>
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#fcfbf7] border border-[#ded8c9] text-xs text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#5b7b68]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#272624] mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#5b7b68]" />
              <span>WhatsApp (Números solo)</span>
            </label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              placeholder="5491155550199"
              className="w-full px-3.5 py-2 rounded-xl bg-[#fcfbf7] border border-[#ded8c9] text-xs text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#5b7b68]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#272624] mb-1 flex items-center gap-1.5">
              <Instagram className="w-3.5 h-3.5 text-[#c65526]" />
              <span>Instagram</span>
            </label>
            <input
              type="text"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-[#fcfbf7] border border-[#ded8c9] text-xs text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#c65526]"
            />
          </div>
        </div>

        {/* WiFi Settings */}
        <div className="pt-3.5 sm:pt-4 border-t border-[#e8e2d4]">
          <h4 className="text-xs font-bold text-[#272624] mb-2.5 sm:mb-3 flex items-center gap-1.5">
            <Wifi className="w-4 h-4 text-[#5b7b68]" />
            <span>Datos de WiFi para Clientes</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-[11px] font-bold text-[#706b61] mb-1">
                Nombre de Red WiFi (SSID)
              </label>
              <input
                type="text"
                value={formData.wifi.network}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    wifi: { ...formData.wifi, network: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-[#fcfbf7] border border-[#ded8c9] text-xs text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#5b7b68]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#706b61] mb-1">
                Contraseña de WiFi
              </label>
              <input
                type="text"
                value={formData.wifi.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    wifi: { ...formData.wifi, password: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-[#fcfbf7] border border-[#ded8c9] text-xs text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#5b7b68]"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Admin Password Change Form */}
      <form onSubmit={handleSavePassword} className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-[#ded8c9] shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[#e8e2d4] mb-3.5 sm:mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#5b7b68] shrink-0" />
            <div>
              <h3 className="font-bold text-sm sm:text-base text-[#272624]">
                Clave de Acceso del Administrador
              </h3>
              <p className="text-xs text-[#706b61]">
                Cambiá la contraseña para acceder a este panel de control.
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-[#5b7b68] hover:bg-[#4d6958] active:scale-95 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {passwordSaved ? <Check className="w-4 h-4" /> : <KeyRound className="w-4 h-4" />}
            <span>{passwordSaved ? '¡Actualizada!' : 'Actualizar Clave'}</span>
          </button>
        </div>

        <div className="max-w-sm">
          <label className="block text-xs font-bold text-[#272624] mb-1">
            Nueva Contraseña Personalizada
          </label>
          <input
            type="password"
            value={customPassword}
            onChange={(e) => setCustomPassword(e.target.value)}
            placeholder="Ingresá la nueva clave de acceso"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#fcfbf7] border border-[#ded8c9] text-xs text-[#272624] focus:outline-none focus:ring-2 focus:ring-[#5b7b68]"
          />
          <p className="text-[11px] text-[#8a8479] mt-1">
            {customPassword ? 'Se ha configurado una clave personalizada.' : 'Utilizando clave del sistema.'}
          </p>
        </div>
      </form>
    </div>
  );
};
