import React from 'react';

interface DetailedSettingsIconProps {
  className?: string;
  isDark?: boolean;
}

export const DetailedSettingsIcon: React.FC<DetailedSettingsIconProps> = ({
  className = 'w-5 h-5',
  isDark = false,
}) => {
  // When inside active nav button (background #a8bff8, text #000e1f, isDark=true):
  // Outer gear is #000e1f, inner lines/center are #a8bff8
  // When on dark page next to title (background #000e1f / #0B132B, text #a8bff8, isDark=false):
  // Outer gear is #a8bff8, inner lines/center are #000e1f
  const innerColor = isDark ? '#a8bff8' : '#000e1f';

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Gear Body with teeth */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.5 2.5C9.5 2.22386 9.72386 2 10 2H14C14.2761 2 14.5 2.22386 14.5 2.5V3.86877C15.2285 4.14449 15.9084 4.53765 16.5186 5.02986L17.5147 4.03376C17.71 3.83849 18.0266 3.83849 18.2218 4.03376L20.0399 5.85178C20.2351 6.04704 20.2351 6.36362 20.0399 6.55888L19.0438 7.55498C19.536 8.16518 19.9292 8.84514 20.2049 9.57367H21.5C21.7761 9.57367 22 9.79753 22 10.0737V14.0737C22 14.3498 21.7761 14.5737 21.5 14.5737H20.2049C19.9292 15.3022 19.536 15.9822 19.0438 16.5924L20.0399 17.5885C20.2351 17.7837 20.2351 18.1003 20.0399 18.2956L18.2218 20.1136C18.0266 20.3088 17.71 20.3088 17.5147 20.1136L16.5186 19.1175C15.9084 19.6097 15.2285 20.0029 14.5 20.2786V21.6473C14.5 21.9235 14.2761 22.1473 14 22.1473H10C9.72386 22.1473 9.5 21.9235 9.5 21.6473V20.2786C8.77154 20.0029 8.09158 19.6097 7.48138 19.1175L6.48528 20.1136C6.29002 20.3088 5.97344 20.3088 5.77817 20.1136L3.96015 18.2956C3.76489 18.1003 3.76489 17.7837 3.96015 17.5885L4.95625 16.5924C4.46404 15.9822 4.07088 15.3022 3.79516 14.5737H2.5C2.22386 14.5737 2 14.3498 2 14.0737V10.0737C2 9.79753 2.22386 9.57367 2.5 9.57367H3.79516C4.07088 8.84514 4.46404 8.16518 4.95625 7.55498L3.96015 6.55888C3.76489 6.36362 3.76489 6.04704 3.96015 5.85178L5.77817 4.03376C5.97344 3.83849 6.29002 3.83849 6.48528 4.03376L7.48138 5.02986C8.09158 4.53765 8.77154 4.14449 9.5 3.86877V2.5Z"
        fill="currentColor"
      />
      {/* Concentric contrasting inner ring / track */}
      <circle cx="12" cy="12.0737" r="5.2" stroke={innerColor} strokeWidth="1.5" />
      {/* 4 Spokes connecting hub to outer rim */}
      <line x1="12" y1="6.8737" x2="12" y2="9.5737" stroke={innerColor} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="12" y1="14.5737" x2="12" y2="17.2737" stroke={innerColor} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="6.8" y1="12.0737" x2="9.5" y2="12.0737" stroke={innerColor} strokeWidth="1.6" strokeLinecap="round" />
      <line x1="14.5" y1="12.0737" x2="17.2" y2="12.0737" stroke={innerColor} strokeWidth="1.6" strokeLinecap="round" />
      {/* Center hole circle filled with inner color / cutout */}
      <circle cx="12" cy="12.0737" r="2.2" fill={innerColor} />
    </svg>
  );
};
