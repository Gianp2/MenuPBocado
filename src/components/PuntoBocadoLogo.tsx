import React from 'react';

interface PuntoBocadoLogoProps {
  className?: string;
  size?: number | string;
  showShadow?: boolean;
}

export const PuntoBocadoLogo: React.FC<PuntoBocadoLogoProps> = ({
  className = '',
  size = '100%',
  showShadow = true,
}) => {
  return (
    <svg
      viewBox="0 0 500 500"
      width={size}
      height={size}
      className={`select-none ${showShadow ? 'drop-shadow-md' : ''} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Clip path for the full round seal */}
        <clipPath id="pb-circle-clip">
          <circle cx="250" cy="250" r="236" />
        </clipPath>

        {/* Clip path for the plate bite effect */}
        <mask id="pb-plate-bite-mask">
          <rect width="500" height="500" fill="white" />
          {/* Bite scalloped cutouts */}
          <circle cx="316" cy="120" r="26" fill="black" />
          <circle cx="334" cy="144" r="22" fill="black" />
          <circle cx="348" cy="124" r="18" fill="black" />
          <circle cx="320" cy="100" r="16" fill="black" />
        </mask>
      </defs>

      {/* Main Container clipped to circle */}
      <g clipPath="url(#pb-circle-clip)">
        {/* Base Background: Warm Cream */}
        <rect width="500" height="500" fill="#fcf6ea" />

        {/* --- UPPER ARCS --- */}
        {/* Outer Terracotta Upper Arch */}
        <path
          d="M 14 250 A 236 236 0 0 1 486 250 L 442 250 A 192 192 0 0 0 58 250 Z"
          fill="#c65526"
        />

        {/* Cream Separator Ring */}
        <path
          d="M 58 250 A 192 192 0 0 1 442 250 L 426 250 A 176 176 0 0 0 74 250 Z"
          fill="#fcf6ea"
        />

        {/* Olive Green Arch */}
        <path
          d="M 74 250 A 176 176 0 0 1 426 250 L 396 250 A 146 146 0 0 0 104 250 Z"
          fill="#708044"
        />

        {/* Inner Cream Circular Bed */}
        <circle cx="250" cy="250" r="146" fill="#fdf8ec" />

        {/* --- THE PLATE WITH BITE --- */}
        <g mask="url(#pb-plate-bite-mask)">
          {/* Main Orange Plate */}
          <circle cx="250" cy="186" r="102" fill="#eb963d" />
          {/* Inner Rim of Plate */}
          <circle cx="250" cy="186" r="76" fill="none" stroke="#d8842c" strokeWidth="4.5" opacity="0.9" />
          {/* Center Plate Glow */}
          <circle cx="250" cy="186" r="62" fill="#f0a14d" opacity="0.35" />
        </g>

        {/* Bite Crumbs (Floating above bite area) */}
        <g fill="#6e2814">
          <circle cx="312" cy="116" r="4.5" />
          <circle cx="332" cy="112" r="3.5" />
          <circle cx="344" cy="126" r="4" />
          <circle cx="356" cy="138" r="3" />
          <circle cx="328" cy="98" r="3.2" />
        </g>

        {/* --- CUTLERY (FORK & SPOON) --- */}
        {/* FORK (Left) */}
        <g transform="translate(208, 186)">
          {/* Outer stroke / silhouette */}
          <g fill="#6e2814">
            {/* Handle */}
            <path d="M -5 20 C -5 60 -7 68 0 72 C 7 68 5 60 5 20 Z" />
            {/* Fork Base & Tines Head */}
            <path d="M -16 -42 C -16 -12 -12 20 0 20 C 12 20 16 -12 16 -42 C 12 -42 10 -30 8 -18 C 6 -30 5 -42 2 -42 C -1 -42 -2 -30 -4 -18 C -6 -30 -8 -42 -16 -42 Z" />
          </g>
          {/* Inner Cream Fork Fill */}
          <g fill="#fffaf0">
            <path d="M -3 20 C -3 58 -4 65 0 68 C 4 65 3 58 3 20 Z" />
            {/* Tines */}
            <rect x="-14" y="-40" width="3.2" height="26" rx="1.6" />
            <rect x="-6" y="-40" width="3.2" height="26" rx="1.6" />
            <rect x="2.8" y="-40" width="3.2" height="26" rx="1.6" />
            <rect x="10.8" y="-40" width="3.2" height="26" rx="1.6" />
            <path d="M -14 -14 C -14 10 -8 16 0 16 C 8 16 14 10 14 -14 Z" />
          </g>
        </g>

        {/* SPOON (Right) */}
        <g transform="translate(292, 186)">
          {/* Outer stroke / silhouette */}
          <g fill="#6e2814">
            {/* Handle */}
            <path d="M -5 20 C -5 60 -7 68 0 72 C 7 68 5 60 5 20 Z" />
            {/* Spoon Oval Head */}
            <ellipse cx="0" cy="-22" rx="20" ry="28" />
            {/* Neck connection */}
            <path d="M -10 -4 C -8 12 -6 18 0 20 C 6 18 8 12 10 -4 Z" />
          </g>
          {/* Inner Cream Spoon Fill */}
          <g fill="#fffaf0">
            <path d="M -3 20 C -3 58 -4 65 0 68 C 4 65 3 58 3 20 Z" />
            <ellipse cx="0" cy="-22" rx="15.5" ry="23.5" />
            <path d="M -7 -4 C -5 10 -4 14 0 16 C 4 14 5 10 7 -4 Z" />
          </g>
        </g>

        {/* --- LOWER ARC & BORDERS --- */}
        {/* Lower Terracotta Arch */}
        <path
          d="M 14 250 A 236 236 0 0 0 486 250 L 442 250 A 192 192 0 0 1 58 250 Z"
          fill="#c65526"
        />

        {/* Bottom Olive accent strip inside lower band */}
        <path
          d="M 104 380 A 176 176 0 0 0 396 380 L 412 404 A 200 200 0 0 1 88 404 Z"
          fill="#708044"
          opacity="0.8"
        />

        {/* Bottom Inner Terracotta Arc Fill */}
        <path
          d="M 92 396 A 192 192 0 0 0 408 396 L 436 430 A 224 224 0 0 1 64 430 Z"
          fill="#c65526"
        />

        {/* --- MIDDLE CREAM BANNER & TYPOGRAPHY --- */}
        {/* Banner Background */}
        <rect
          x="30"
          y="262"
          width="440"
          height="112"
          fill="#fcf6ea"
        />
        {/* Banner Top and Bottom Crisp Separator Lines */}
        <line x1="30" y1="262" x2="470" y2="262" stroke="#c65526" strokeWidth="4" />
        <line x1="30" y1="374" x2="470" y2="374" stroke="#c65526" strokeWidth="4" />

        {/* MAIN TEXT: PUNTO BOCADO */}
        <text
          x="250"
          y="324"
          textAnchor="middle"
          fill="#6e2814"
          fontFamily="'Montserrat', 'Arial Black', sans-serif"
          fontWeight="900"
          fontSize="43"
          letterSpacing="2.5"
        >
          PUNTO BOCADO
        </text>

        {/* SUBTITLE: DESAYUNOS • VIANDAS • COMIDAS • CAFÉ */}
        <text
          x="250"
          y="354"
          textAnchor="middle"
          fill="#6e2814"
          fontFamily="'Montserrat', sans-serif"
          fontWeight="800"
          fontSize="14.5"
          letterSpacing="1.2"
        >
          DESAYUNOS • VIANDAS • COMIDAS • CAFÉ
        </text>
      </g>

      {/* --- OUTER CIRCULAR BORDERS --- */}
      {/* Outer Main Terracotta Border */}
      <circle
        cx="250"
        cy="250"
        r="236"
        fill="none"
        stroke="#c65526"
        strokeWidth="14"
      />
      {/* Inner Thin Accent Ring */}
      <circle
        cx="250"
        cy="250"
        r="244"
        fill="none"
        stroke="#6e2814"
        strokeWidth="2.5"
        opacity="0.35"
      />
    </svg>
  );
};
