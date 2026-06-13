
// This does not really look like cHorts so learn how to fix, I guess
//https://www.w3schools.com/graphics/svg_path.asp

export const Shorts = ({ size = 24, color = "currentColor", strokeWidth = 2, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
    >
        {/* waistband top line */}
        <path d="M3 5 L21 5" />
        {/* body + leg split */}
        <path d="M3 5 L3 5.5 Q3 7 2 9.5 L2 15 Q2 17 4 17 L9 17 Q9 17 9 13.5 Q9 12 12 12 Q15 12 15 13.5 L15 17 L20 17 Q22 17 22 15 L22 9.5 Q21 7 21 5.5 L21 5 Z" />
    </svg>
);