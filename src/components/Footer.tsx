import React from 'react';
import { RestaurantInfoType } from '../context/MenuContext';
import { RestaurantBadge } from './RestaurantBadge';
import { BotanicalDecoration } from './BotanicalDecoration';
import {
  MapPin,
  Clock,
  Phone,
  Instagram,
  QrCode,
  ExternalLink,
} from 'lucide-react';

interface FooterProps {
  onOpenQR: () => void;
  onOpenInfo: () => void;
  onAdminTrigger?: () => void;
  restaurantInfo: RestaurantInfoType;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenQR,
  onOpenInfo,
  onAdminTrigger,
  restaurantInfo,
}) => {
  // ============================================================
  // LINKS
  // ============================================================

  // WhatsApp
  const whatsappNumber = restaurantInfo.whatsappNumber
    ? restaurantInfo.whatsappNumber.replace(/\D/g, '')
    : '';

  const whatsappLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}`
    : '';

  // Instagram
  const instagramLink = restaurantInfo.instagram
    ? restaurantInfo.instagram.startsWith('http')
      ? restaurantInfo.instagram
      : `https://www.instagram.com/${restaurantInfo.instagram
          .replace('@', '')
          .replace(/\/+$/, '')}/`
    : '';

  return (
    <footer className="relative bg-[#f5f2e9] border-t border-[#e2dccf] min-h-[100dvh] w-full flex flex-col justify-between py-12 sm:py-16 px-4 sm:px-8 overflow-hidden text-[#555149]">

      <BotanicalDecoration
        position="side-left"
        className="top-12 opacity-60"
      />

      <BotanicalDecoration
        position="side-right"
        className="top-12 opacity-60"
      />

      {/* Top Spacer for vertical balance */}
      <div className="hidden sm:block" />

      <div className="relative z-10 max-w-xl mx-auto text-center w-full my-auto py-6">

        {/* ========================================================
            CREST
        ======================================================== */}

        <div className="mb-4">
          <RestaurantBadge size="md" />
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#706b61] max-w-sm mx-auto mb-6 leading-relaxed">
          {restaurantInfo.description}
        </p>

        {/* ========================================================
            INFO GRID
        ======================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm text-left max-w-md mx-auto mb-8 bg-white/80 p-4 sm:p-5 rounded-2xl border border-[#ded8c9] shadow-xs">

          {/* Horarios */}
          <div className="flex items-start gap-2.5">

            <Clock className="w-4 h-4 text-[#b26649] shrink-0 mt-0.5" />

            <div>
              <span className="font-bold text-[#272624] block">
                Horarios
              </span>

              <span className="text-[#555149]">
                {restaurantInfo.hours}
              </span>
            </div>

          </div>

          {/* Ubicación */}
          <div className="flex items-start gap-2.5">

            <MapPin className="w-4 h-4 text-[#b26649] shrink-0 mt-0.5" />

            <div>
              <span className="font-bold text-[#272624] block">
                Ubicación
              </span>

              <span className="text-[#555149]">
                {restaurantInfo.address}
              </span>
            </div>

          </div>

          {/* ======================================================
              CONTACTO / WHATSAPP
          ====================================================== */}

          {whatsappLink ? (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 rounded-lg p-1.5 -m-1.5 hover:bg-[#f5f2e9] transition-colors group cursor-pointer"
              aria-label="Contactar por WhatsApp"
            >

              <Phone className="w-4 h-4 text-[#5b7b68] shrink-0 mt-0.5" />

              <div className="min-w-0">

                <span className="font-bold text-[#272624] block">
                  Contacto & Reservas
                </span>

                <span className="text-[#555149] inline-flex items-center gap-1">
                  {restaurantInfo.phone || restaurantInfo.whatsappNumber}

                  <ExternalLink className="w-3 h-3 text-[#5b7b68] opacity-60 group-hover:opacity-100 transition-opacity" />
                </span>

              </div>

            </a>
          ) : (
            <div className="flex items-start gap-2.5">

              <Phone className="w-4 h-4 text-[#5b7b68] shrink-0 mt-0.5" />

              <div>

                <span className="font-bold text-[#272624] block">
                  Contacto & Reservas
                </span>

                <span className="text-[#555149]">
                  {restaurantInfo.phone}
                </span>

              </div>

            </div>
          )}

          {/* ======================================================
              INSTAGRAM
          ====================================================== */}

          {instagramLink ? (
            <a
              href={instagramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2.5 rounded-lg p-1.5 -m-1.5 hover:bg-[#f5f2e9] transition-colors group cursor-pointer"
              aria-label="Visitar Instagram"
            >

              <Instagram className="w-4 h-4 text-[#b26649] shrink-0 mt-0.5" />

              <div className="min-w-0">

                <span className="font-bold text-[#272624] block">
                  Instagram
                </span>

                <span className="text-[#555149] inline-flex items-center gap-1 break-all">
                  {restaurantInfo.instagram}

                  <ExternalLink className="w-3 h-3 text-[#b26649] opacity-60 group-hover:opacity-100 transition-opacity shrink-0" />
                </span>

              </div>

            </a>
          ) : (
            <div className="flex items-start gap-2.5">

              <Instagram className="w-4 h-4 text-[#b26649] shrink-0 mt-0.5" />

              <div>

                <span className="font-bold text-[#272624] block">
                  Instagram
                </span>

                <span className="text-[#555149]">
                  No disponible
                </span>

              </div>

            </div>
          )}

        </div>

        {/* ========================================================
            ACTION BUTTONS
        ======================================================== */}

        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">

          <button
            onClick={onOpenQR}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#d6cfbe] text-xs sm:text-sm font-bold text-[#272624] hover:bg-[#ede8db] transition-colors shadow-xs cursor-pointer active:scale-95"
          >

            <QrCode className="w-4 h-4 text-[#b26649]" />

            <span>
              Compartir Carta Digital
            </span>

          </button>

        </div>

      </div>

      {/* ============================================================
          COPYRIGHT
      ============================================================ */}

      <div className="relative z-10 max-w-xl mx-auto text-center w-full pt-4 border-t border-[#e5dfd2]">

        <p className="text-[11px] sm:text-xs text-[#8c867b]">

          <button
            type="button"
            onClick={onAdminTrigger}
            className="inline-block text-inherit hover:text-[#383530] focus:outline-none transition-colors cursor-default select-none active:opacity-60"
            title=""
          >
            © {new Date().getFullYear()} {restaurantInfo.name}.
          </button>{' '}

          Todos los derechos reservados.

        </p>

      </div>

    </footer>
  );
};
