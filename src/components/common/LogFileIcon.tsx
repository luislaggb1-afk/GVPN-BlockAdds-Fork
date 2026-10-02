import React from 'react';

interface LogFileIconProps {
  className?: string;
  isDark?: boolean;
}

export const LogFileIcon: React.FC<LogFileIconProps> = ({
  className = 'w-4 h-4',
  isDark = false,
}) => {
  // When isDark is true (e.g., active in navbar), lines are #a8bff8. When false, lines are dark #000e1f
  const lineColor = isDark ? '#a8bff8' : '#000e1f';

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Paper page body filled with currentColor */}
      <path
        d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
        fill="currentColor"
      />
      {/* Dog-ear fold */}
      <path
        d="M14 2V8H20"
        stroke={lineColor}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Writing text lines in dark color */}
      <path
        d="M8 12H16"
        stroke={lineColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 16H14"
        stroke={lineColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 8H10"
        stroke={lineColor}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
