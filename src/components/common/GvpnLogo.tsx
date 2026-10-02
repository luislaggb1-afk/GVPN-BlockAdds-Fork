import React from 'react';

interface GvpnLogoProps {
  className?: string;
  isDark?: boolean;
  inverted?: boolean;
  variant?: 'header' | 'button';
}

export const GvpnLogo: React.FC<GvpnLogoProps> = ({
  className = 'w-5 h-5',
  inverted = false,
  variant = 'header',
}) => {
  // 'header': Original GVPN.svg with white outer border, light blue (#a8bff8) inner shield, dark cross & letters (#000e1f)
  // 'button': GVPN (1).svg with dark navy outer border (#000e1f), deep blue core (#0d1844), light blue cross (#a8bff8), and crisp white letters (#FFFFFF)
  const isButtonMode = variant === 'button' || inverted;

  const outerAccentColor = isButtonMode ? '#000e1f' : '#FFFFFF';
  const outerShieldColor = isButtonMode ? '#000e1f' : '#FFFFFF';
  const innerShieldColor = isButtonMode ? '#0d1844' : '#a8bff8';
  const crossColor = isButtonMode ? '#a8bff8' : '#000e1f';
  const letterColor = isButtonMode ? '#FFFFFF' : '#000e1f';

  return (
    <svg
      className={className}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Left Accent Arc with Square Dot */}
      <rect
        x="6"
        y="290"
        width="20"
        height="20"
        transform="rotate(-30 6 290)"
        fill={outerAccentColor}
        rx="2"
      />
      <path
        d="M 18,320 C 50,405 110,465 160,488"
        stroke={outerAccentColor}
        strokeWidth="16"
        strokeLinecap="round"
      />

      {/* Outer Right Accent Arc with Square Dot */}
      <rect
        x="475"
        y="58"
        width="20"
        height="20"
        fill={outerAccentColor}
        rx="2"
      />
      <path
        d="M 484,90 V 255"
        stroke={outerAccentColor}
        strokeWidth="16"
        strokeLinecap="round"
      />

      {/* Main Outer Shield Frame */}
      <path
        d="M 250,10 L 462,78 L 462,245 C 462,370 360,455 250,490 C 140,455 38,370 38,245 L 38,78 Z"
        fill={outerShieldColor}
      />

      {/* Inner Shield Body */}
      <path
        d="M 250,85 L 412,132 L 412,240 C 412,342 332,418 250,450 C 168,418 88,342 88,240 L 88,132 Z"
        fill={innerShieldColor}
      />

      {/* 4 Quadrants Inner Cross */}
      <line
        x1="250"
        y1="85"
        x2="250"
        y2="450"
        stroke={crossColor}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="88"
        y1="240"
        x2="412"
        y2="240"
        stroke={crossColor}
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* GVPN Lettering around shield frame */}
      <g
        fill={letterColor}
        fontFamily="Arial, system-ui, -apple-system, sans-serif"
        fontWeight="900"
        fontSize="31"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {/* Top-Left Slope */}
        <text x="96" y="112" transform="rotate(-17 96 112)">G</text>
        <text x="138" y="99" transform="rotate(-17 138 99)">V</text>
        <text x="180" y="86" transform="rotate(-17 180 86)">P</text>
        <text x="222" y="73" transform="rotate(-17 222 73)">N</text>

        {/* Top-Right Slope */}
        <text x="278" y="73" transform="rotate(17 278 73)">G</text>
        <text x="320" y="86" transform="rotate(17 320 86)">V</text>
        <text x="362" y="99" transform="rotate(17 362 99)">P</text>
        <text x="404" y="112" transform="rotate(17 404 112)">N</text>

        {/* Right Vertical */}
        <text x="437" y="152" transform="rotate(90 437 152)">G</text>
        <text x="437" y="196" transform="rotate(90 437 196)">V</text>
        <text x="437" y="240" transform="rotate(90 437 240)">P</text>
        <text x="437" y="284" transform="rotate(90 437 284)">N</text>

        {/* Right Bottom Slanted Curve */}
        <text x="424" y="332" transform="rotate(70 424 332)">G</text>
        <text x="396" y="378" transform="rotate(55 396 378)">V</text>
        <text x="354" y="420" transform="rotate(40 354 420)">P</text>
        <text x="298" y="454" transform="rotate(22 298 454)">N</text>

        {/* Bottom Tip */}
        <text x="236" y="468" transform="rotate(-8 236 468)">P</text>
        <text x="184" y="454" transform="rotate(-24 184 454)">N</text>

        {/* Left Bottom Slanted Curve */}
        <text x="138" y="420" transform="rotate(-42 138 420)">V</text>
        <text x="98" y="378" transform="rotate(-58 98 378)">G</text>
        <text x="74" y="332" transform="rotate(-72 74 332)">P</text>

        {/* Left Vertical */}
        <text x="63" y="284" transform="rotate(-90 63 284)">N</text>
        <text x="63" y="240" transform="rotate(-90 63 240)">G</text>
        <text x="63" y="196" transform="rotate(-90 63 196)">V</text>
        <text x="63" y="152" transform="rotate(-90 63 152)">P</text>
      </g>
    </svg>
  );
};
