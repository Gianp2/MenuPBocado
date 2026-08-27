import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  Wifi,
  Copy,
  Check,
  QrCode,
} from 'lucide-react';
import { RestaurantInfoType } from '../context/MenuContext';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQR: () => void;
  restaurantInfo: RestaurantInfoType;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  onOpenQR,
  restaurantInfo,
}) => {
  useLockBodyScroll(isOpen);

  const [copiedWifi, setCopiedWifi] = useState(false);

  if (!isOpen) return null;

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(restaurantInfo.wifi.password);
    setCopiedWifi(true);

    setTimeout(() => {
      setCopiedWifi(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-sm bg-[#fcfbf7] border border-[#dcd6c7] rounded-2xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-[#e8e2d4] pb-3">
          <div>
            <h3 className="font-extrabold text-base uppercase tracking-wider text-[#272624] font-['Montserrat']">
              {restaurantInfo.name}
            </h3>

            <span className="text-xs text-[#787369]">
              Información del Salón
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-[#ede8db] text-[#66625a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Info Rows */}
        <div className="space-y-3 text-xs sm:text-sm text-[#3d3a35]">

          {/* Horarios */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#e6e1d5]">
            <Clock className="w-4 h-4 text-[#b26649] shrink-0 mt-0.5" />

            <div className="w-full">
              <span className="font-bold text-[#272624] block mb-2">
                Horarios de Atención
              </span>

              <div className="space-y-2.5">

                {/* Lunes a sábado */}
                <div>
                  <span className="block text-xs font-semibold text-[#3d3a35] mb-1">
                    Lunes a sábado
                  </span>

                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-[#66625a]">
                      07:30 – 13:30
                    </span>

                    <span className="text-xs text-[#66625a]">
                      17:00 – 23:30
                    </span>
                  </div>
                </div>

                {/* Separador */}
                <div className="border-t border-[#eee9df]" />

                {/* Domingo */}
                <div>
                  <span className="block text-xs font-semibold text-[#3d3a35] mb-1">
                    Domingos
                  </span>

                  <span className="text-xs text-[#66625a]">
                    18:30 – 23:30
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-[#e6e1d5]">
            <MapPin className="w-4 h-4 text-[#b26649] shrink-0 mt-0.5" />

            <div>
              <span className="font-bold text-[#272624] block">
                Dirección
              </span>

              <span className="text-xs text-[#66625a]">
                {restaurantInfo.address}
              </span>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-[#e6e1d5]">
            <Phone className="w-4 h-4 text-[#b26649] shrink-0 mt-0.5" />

            <div>
              <span className="font-bold text-[#272624] block">
                Contacto & Reservas
              </span>

              <span className="text-xs text-[#66625a]">
                {restaurantInfo.phone}
              </span>
            </div>
          </div>

          {/* WiFi */}
          <div className="p-3 rounded-xl bg-[#5b7b68]/10 border border-[#5b7b68]/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-[#5b7b68] font-bold text-xs uppercase tracking-wider">
                <Wifi className="w-4 h-4" />
                <span>WiFi Clientes</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-[#d6cfbe]">
              <div>
                <span className="text-[#66625a] block text-[11px]">
                  Red:{' '}
                  <strong className="text-[#272624]">
                    {restaurantInfo.wifi.network}
                  </strong>
                </span>

                <span className="text-[#66625a] block text-[11px]">
                  Clave:{' '}
                  <strong className="text-[#b26649]">
                    {restaurantInfo.wifi.password}
                  </strong>
                </span>
              </div>

              <button
                onClick={handleCopyWifi}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#5b7b68] text-white font-medium text-xs transition-colors cursor-pointer"
              >
                {copiedWifi ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-[#e8e2d4]">
          <button
            onClick={() => {
              onClose();
              onOpenQR();
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#f0ebe0] text-[#272624] font-bold text-xs border border-[#ded8c9] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-[0.99]"
          >
            <QrCode className="w-4 h-4 text-[#b26649]" />
            <span>Ver Carta Digital QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};

