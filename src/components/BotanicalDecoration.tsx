import React from 'react';

interface BotanicalProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'side-left' | 'side-right';
  className?: string;
}

export const BotanicalDecoration: React.FC<BotanicalProps> = ({ position = 'top-left', className = '' }) => {
  if (position === 'top-left') {
    return (
      <div className={`pointer-events-none select-none overflow-hidden absolute top-0 left-0 w-44 sm:w-64 h-44 sm:h-64 z-0 ${className}`}>
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-90">
          {/* Curving Vine Branches */}
          <path
            d="M-20 -10 C30 20 60 70 95 120 C125 160 145 195 180 230"
            stroke="#2b2623"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M20 -10 C50 40 85 55 130 65 C165 72 195 90 220 115"
            stroke="#2b2623"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M60 80 C80 115 75 155 105 190 C120 210 135 225 150 240"
            stroke="#2b2623"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Delicate Vine Tendrils (Curling Spirals) */}
          <path
            d="M130 65 Q165 50 170 30 Q172 15 158 16 Q146 18 150 30 Q154 38 162 36"
            stroke="#5b7b68"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M95 120 Q125 110 145 125 Q158 135 152 148 Q144 156 135 148 Q130 140 138 134"
            stroke="#5b7b68"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M150 200 Q180 205 195 190 Q205 178 195 170 Q186 166 182 176"
            stroke="#5b7b68"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Vine Leaves (Sage Green & Terracotta Accents) */}
          {/* Leaf 1 */}
          <path
            d="M30 20 C15 5 45 -15 65 5 C75 25 50 35 30 20 Z"
            fill="#5b7b68"
            stroke="#2b2623"
            strokeWidth="2"
          />
          <path d="M35 16 Q50 10 60 7" stroke="#2b2623" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          {/* Leaf 2 */}
          <path
            d="M75 50 C95 30 120 40 115 65 C100 80 80 70 75 50 Z"
            fill="#c47a5d"
            stroke="#2b2623"
            strokeWidth="2"
          />
          <path d="M80 54 Q98 52 110 58" stroke="#2b2623" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          {/* Leaf 3 */}
          <path
            d="M50 100 C30 115 25 145 45 150 C65 152 70 125 50 100 Z"
            fill="#5b7b68"
            stroke="#2b2623"
            strokeWidth="2"
          />

          {/* Leaf 4 */}
          <path
            d="M110 145 C135 135 155 155 145 175 C125 185 110 165 110 145 Z"
            fill="#5b7b68"
            stroke="#2b2623"
            strokeWidth="2"
          />

          {/* Leaf 5 */}
          <path
            d="M165 90 C185 75 210 85 205 105 C190 120 170 110 165 90 Z"
            fill="#5b7b68"
            stroke="#2b2623"
            strokeWidth="2"
          />

          {/* MAIN FLOWER 1 (Terracotta Blooming 5-Petal Flower at intersection) */}
          <g transform="translate(95, 85)">
            {/* Petals */}
            <circle cx="0" cy="-14" r="11" fill="#c47a5d" stroke="#2b2623" strokeWidth="2" />
            <circle cx="13" cy="-4" r="11" fill="#c47a5d" stroke="#2b2623" strokeWidth="2" />
            <circle cx="8" cy="12" r="11" fill="#c47a5d" stroke="#2b2623" strokeWidth="2" />
            <circle cx="-8" cy="12" r="11" fill="#c47a5d" stroke="#2b2623" strokeWidth="2" />
            <circle cx="-13" cy="-4" r="11" fill="#c47a5d" stroke="#2b2623" strokeWidth="2" />
            {/* Flower Center */}
            <circle cx="0" cy="0" r="7.5" fill="#fcfbf7" stroke="#2b2623" strokeWidth="2" />
            <circle cx="0" cy="0" r="4" fill="#e89d7b" />
            {/* Stamen dots */}
            <circle cx="-2" cy="-2" r="1" fill="#2b2623" />
            <circle cx="2" cy="-2" r="1" fill="#2b2623" />
            <circle cx="0" cy="2" r="1" fill="#2b2623" />
          </g>

          {/* FLOWER 2 (Warm Peach/Ochre Open Blossom) */}
          <g transform="translate(180, 120) rotate(20)">
            <ellipse cx="0" cy="-11" rx="9" ry="10" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.8" />
            <ellipse cx="10" cy="-3" rx="9" ry="10" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.8" />
            <ellipse cx="6" cy="10" rx="9" ry="10" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.8" />
            <ellipse cx="-6" cy="10" rx="9" ry="10" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.8" />
            <ellipse cx="-10" cy="-3" rx="9" ry="10" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.8" />
            <circle cx="0" cy="0" r="6" fill="#fcfbf7" stroke="#2b2623" strokeWidth="1.8" />
            <circle cx="0" cy="0" r="3" fill="#c47a5d" />
          </g>

          {/* FLOWER 3 (Side Blossom at the lower vine) */}
          <g transform="translate(145, 195) rotate(-30)">
            <ellipse cx="-8" cy="-5" rx="7" ry="9" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.8" />
            <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.8" />
            <ellipse cx="8" cy="-5" rx="7" ry="9" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.8" />
            <path d="M-10 2 C-5 12 5 12 10 2 Z" fill="#5b7b68" stroke="#2b2623" strokeWidth="1.8" />
          </g>

          {/* Little Floral Flower Buds along vines */}
          <g transform="translate(140, 45)">
            <ellipse cx="0" cy="0" rx="5" ry="7" transform="rotate(35)" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.6" />
            <path d="M-4 5 C-1 9 5 8 6 3" stroke="#2b2623" strokeWidth="1.6" fill="#5b7b68" />
          </g>
          <g transform="translate(70, 160)">
            <ellipse cx="0" cy="0" rx="4.5" ry="6.5" transform="rotate(-40)" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.6" />
            <path d="M-3 4 C-1 8 4 7 5 2" stroke="#2b2623" strokeWidth="1.6" fill="#5b7b68" />
          </g>
          <g transform="translate(205, 140)">
            <ellipse cx="0" cy="0" rx="4" ry="6" transform="rotate(50)" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    );
  }

  if (position === 'top-right') {
    return (
      <div className={`pointer-events-none select-none overflow-hidden absolute top-0 right-0 w-44 sm:w-64 h-44 sm:h-64 z-0 ${className}`}>
        <svg viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-90">
          {/* Mirrored Curving Vine Branches */}
          <path
            d="M260 -10 C210 20 180 70 145 120 C115 160 95 195 60 230"
            stroke="#2b2623"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M220 -10 C190 40 155 55 110 65 C75 72 45 90 20 115"
            stroke="#2b2623"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M180 80 C160 115 165 155 135 190 C120 210 105 225 90 240"
            stroke="#2b2623"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Mirrored Vine Tendrils (Curling Spirals) */}
          <path
            d="M110 65 Q75 50 70 30 Q68 15 82 16 Q94 18 90 30 Q86 38 78 36"
            stroke="#5b7b68"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M145 120 Q115 110 95 125 Q82 135 88 148 Q96 156 105 148 Q110 140 102 134"
            stroke="#5b7b68"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M90 200 Q60 205 45 190 Q35 178 45 170 Q54 166 58 176"
            stroke="#5b7b68"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />

          {/* Vine Leaves */}
          <path
            d="M210 20 C225 5 195 -15 175 5 C165 25 190 35 210 20 Z"
            fill="#5b7b68"
            stroke="#2b2623"
            strokeWidth="2"
          />
          <path d="M205 16 Q190 10 180 7" stroke="#2b2623" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          <path
            d="M165 50 C145 30 120 40 125 65 C140 80 160 70 165 50 Z"
            fill="#c47a5d"
            stroke="#2b2623"
            strokeWidth="2"
          />
          <path d="M160 54 Q142 52 130 58" stroke="#2b2623" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          <path
            d="M190 100 C210 115 215 145 195 150 C175 152 170 125 190 100 Z"
            fill="#5b7b68"
            stroke="#2b2623"
            strokeWidth="2"
          />

          <path
            d="M130 145 C105 135 85 155 95 175 C115 185 130 165 130 145 Z"
            fill="#5b7b68"
            stroke="#2b2623"
            strokeWidth="2"
          />

          <path
            d="M75 90 C55 75 30 85 35 105 C50 120 70 110 75 90 Z"
            fill="#5b7b68"
            stroke="#2b2623"
            strokeWidth="2"
          />

          {/* MAIN FLOWER 1 */}
          <g transform="translate(145, 85)">
            <circle cx="0" cy="-14" r="11" fill="#c47a5d" stroke="#2b2623" strokeWidth="2" />
            <circle cx="-13" cy="-4" r="11" fill="#c47a5d" stroke="#2b2623" strokeWidth="2" />
            <circle cx="-8" cy="12" r="11" fill="#c47a5d" stroke="#2b2623" strokeWidth="2" />
            <circle cx="8" cy="12" r="11" fill="#c47a5d" stroke="#2b2623" strokeWidth="2" />
            <circle cx="13" cy="-4" r="11" fill="#c47a5d" stroke="#2b2623" strokeWidth="2" />
            <circle cx="0" cy="0" r="7.5" fill="#fcfbf7" stroke="#2b2623" strokeWidth="2" />
            <circle cx="0" cy="0" r="4" fill="#e89d7b" />
            <circle cx="2" cy="-2" r="1" fill="#2b2623" />
            <circle cx="-2" cy="-2" r="1" fill="#2b2623" />
            <circle cx="0" cy="2" r="1" fill="#2b2623" />
          </g>

          {/* FLOWER 2 */}
          <g transform="translate(60, 120) rotate(-20)">
            <ellipse cx="0" cy="-11" rx="9" ry="10" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.8" />
            <ellipse cx="-10" cy="-3" rx="9" ry="10" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.8" />
            <ellipse cx="-6" cy="10" rx="9" ry="10" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.8" />
            <ellipse cx="6" cy="10" rx="9" ry="10" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.8" />
            <ellipse cx="10" cy="-3" rx="9" ry="10" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.8" />
            <circle cx="0" cy="0" r="6" fill="#fcfbf7" stroke="#2b2623" strokeWidth="1.8" />
            <circle cx="0" cy="0" r="3" fill="#c47a5d" />
          </g>

          {/* FLOWER 3 */}
          <g transform="translate(95, 195) rotate(30)">
            <ellipse cx="8" cy="-5" rx="7" ry="9" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.8" />
            <ellipse cx="0" cy="-10" rx="7" ry="10" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.8" />
            <ellipse cx="-8" cy="-5" rx="7" ry="9" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.8" />
            <path d="M10 2 C5 12 -5 12 -10 2 Z" fill="#5b7b68" stroke="#2b2623" strokeWidth="1.8" />
          </g>

          {/* Buds */}
          <g transform="translate(100, 45)">
            <ellipse cx="0" cy="0" rx="5" ry="7" transform="rotate(-35)" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.6" />
            <path d="M4 5 C1 9 -5 8 -6 3" stroke="#2b2623" strokeWidth="1.6" fill="#5b7b68" />
          </g>
          <g transform="translate(170, 160)">
            <ellipse cx="0" cy="0" rx="4.5" ry="6.5" transform="rotate(40)" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.6" />
            <path d="M3 4 C1 8 -4 7 -5 2" stroke="#2b2623" strokeWidth="1.6" fill="#5b7b68" />
          </g>
          <g transform="translate(35, 140)">
            <ellipse cx="0" cy="0" rx="4" ry="6" transform="rotate(-50)" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    );
  }

  if (position === 'side-left') {
    return (
      <div className={`pointer-events-none select-none overflow-hidden absolute left-0 w-28 sm:w-40 h-56 z-0 ${className}`}>
        <svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-80">
          {/* Wavy Vine */}
          <path
            d="M-10 10 Q40 50 25 100 Q10 145 40 185"
            stroke="#2b2623"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Spiraling tendrils */}
          <path d="M25 100 Q45 85 55 95 Q60 105 50 110 Q42 108 45 100" stroke="#5b7b68" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M40 185 Q65 175 70 190" stroke="#5b7b68" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          {/* Leaves */}
          <path d="M10 30 C28 18 48 32 40 52 C24 58 10 44 10 30 Z" fill="#5b7b68" stroke="#2b2623" strokeWidth="1.8" />
          <path d="M15 125 C35 110 55 128 48 145 C30 152 15 138 15 125 Z" fill="#5b7b68" stroke="#2b2623" strokeWidth="1.8" />

          {/* Side Vine Flower 1 */}
          <g transform="translate(30, 75)">
            <circle cx="0" cy="-8" r="6" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.5" />
            <circle cx="8" cy="-2" r="6" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.5" />
            <circle cx="5" cy="7" r="6" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.5" />
            <circle cx="-5" cy="7" r="6" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.5" />
            <circle cx="-8" cy="-2" r="6" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="4.5" fill="#fcfbf7" stroke="#2b2623" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="2" fill="#e2a87a" />
          </g>

          {/* Side Vine Flower 2 */}
          <g transform="translate(25, 160) rotate(15)">
            <ellipse cx="-5" cy="-4" rx="5" ry="6" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.4" />
            <ellipse cx="0" cy="-7" rx="5" ry="7" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.4" />
            <ellipse cx="5" cy="-4" rx="5" ry="6" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.4" />
            <path d="M-6 2 C-3 8 3 8 6 2 Z" fill="#5b7b68" stroke="#2b2623" strokeWidth="1.4" />
          </g>
        </svg>
      </div>
    );
  }

  if (position === 'side-right') {
    return (
      <div className={`pointer-events-none select-none overflow-hidden absolute right-0 w-28 sm:w-40 h-56 z-0 ${className}`}>
        <svg viewBox="0 0 120 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full opacity-80">
          {/* Mirrored Wavy Vine */}
          <path
            d="M130 10 Q80 50 95 100 Q110 145 80 185"
            stroke="#2b2623"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Spiraling tendrils */}
          <path d="M95 100 Q75 85 65 95 Q60 105 70 110 Q78 108 75 100" stroke="#5b7b68" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M80 185 Q55 175 50 190" stroke="#5b7b68" strokeWidth="1.4" strokeLinecap="round" fill="none" />

          {/* Leaves */}
          <path d="M110 30 C92 18 72 32 80 52 C96 58 110 44 110 30 Z" fill="#5b7b68" stroke="#2b2623" strokeWidth="1.8" />
          <path d="M105 125 C85 110 65 128 72 145 C90 152 105 138 105 125 Z" fill="#5b7b68" stroke="#2b2623" strokeWidth="1.8" />

          {/* Side Vine Flower 1 */}
          <g transform="translate(90, 75)">
            <circle cx="0" cy="-8" r="6" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.5" />
            <circle cx="-8" cy="-2" r="6" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.5" />
            <circle cx="-5" cy="7" r="6" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.5" />
            <circle cx="5" cy="7" r="6" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.5" />
            <circle cx="8" cy="-2" r="6" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="4.5" fill="#fcfbf7" stroke="#2b2623" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="2" fill="#e2a87a" />
          </g>

          {/* Side Vine Flower 2 */}
          <g transform="translate(95, 160) rotate(-15)">
            <ellipse cx="5" cy="-4" rx="5" ry="6" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.4" />
            <ellipse cx="0" cy="-7" rx="5" ry="7" fill="#c47a5d" stroke="#2b2623" strokeWidth="1.4" />
            <ellipse cx="-5" cy="-4" rx="5" ry="6" fill="#e2a87a" stroke="#2b2623" strokeWidth="1.4" />
            <path d="M6 2 C3 8 -3 8 -6 2 Z" fill="#5b7b68" stroke="#2b2623" strokeWidth="1.4" />
          </g>
        </svg>
      </div>
    );
  }

  return null;
};

