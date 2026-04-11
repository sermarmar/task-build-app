import { useState, useId } from "react";
 
// ─── Types ────────────────────────────────────────────────────────────────────
 
type CheckboxSize = "sm" | "md" | "lg";
type CheckboxVariant = "default" | "teal" | "coral";
 
interface CheckboxProps {
  /** Label text shown next to the box */
  label: string;
  value?: string | number;
  /** Optional description shown below the label (card style) */
  description?: string;
  /** Controlled checked state */
  checked?: boolean;
  /** Indeterminate state (overrides checked visually) */
  indeterminate?: boolean;
  /** Disable interaction */
  disabled?: boolean;
  /** Visual size */
  size?: CheckboxSize;
  /** Color variant */
  variant?: CheckboxVariant;
  /** onChange handler */
  onChange?: (checked: boolean) => void;
  /** Additional class names on the root element */
  className?: string;
}
 
// ─── Variant maps ─────────────────────────────────────────────────────────────
 
const variantBox: Record<CheckboxVariant, string> = {
  default: "border-violet-400 bg-violet-600 group-hover:border-violet-500",
  teal:    "border-teal-400  bg-teal-600  group-hover:border-teal-500",
  coral:   "border-orange-400 bg-orange-600 group-hover:border-orange-500",
};
 
const variantHoverBorder: Record<CheckboxVariant, string> = {
  default: "group-hover:border-violet-400",
  teal:    "group-hover:border-teal-400",
  coral:   "group-hover:border-orange-400",
};
 
const variantCardBorder: Record<CheckboxVariant, string> = {
  default: "border-violet-500",
  teal:    "border-teal-500",
  coral:   "border-orange-500",
};
 
const variantCardBg: Record<CheckboxVariant, string> = {
  default: "bg-violet-50/40 dark:bg-violet-950/20",
  teal:    "bg-teal-50/40   dark:bg-teal-950/20",
  coral:   "bg-orange-50/40 dark:bg-orange-950/20",
};
 
// ─── Size maps ────────────────────────────────────────────────────────────────
 
const sizeBox: Record<CheckboxSize, string> = {
  sm: "w-4 h-4 rounded-[5px]",
  md: "w-[22px] h-[22px] rounded-[7px]",
  lg: "w-7 h-7 rounded-[9px]",
};
 
const sizeLabel: Record<CheckboxSize, string> = {
  sm: "text-sm",
  md: "text-[15px]",
  lg: "text-[17px]",
};
 
const sizeIcon: Record<CheckboxSize, { w: number; h: number; strokeW: string; points: string }> = {
  sm: { w: 9,  h: 9,  strokeW: "2",   points: "1.5,5 4.5,8 10.5,1.5" },
  md: { w: 12, h: 12, strokeW: "2.2", points: "1.5,5 4.5,8 10.5,1.5" },
  lg: { w: 15, h: 15, strokeW: "2.4", points: "1.5,5 4.5,8 10.5,1.5" },
};
 
// ─── Keyframe injection (once) ────────────────────────────────────────────────
 
const STYLE_ID = "cb-keyframes";
if (typeof document !== "undefined" && !document.getElementById(STYLE_ID)) {
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = `
    @keyframes cb-pop {
      0%   { transform: scale(1); }
      40%  { transform: scale(1.18); }
      70%  { transform: scale(0.93); }
      100% { transform: scale(1); }
    }
    @keyframes cb-tick {
      from { stroke-dashoffset: 16; }
      to   { stroke-dashoffset: 0; }
    }
    @keyframes cb-dash {
      from { stroke-dashoffset: 8; }
      to   { stroke-dashoffset: 0; }
    }
    .cb-pop    { animation: cb-pop  0.25s cubic-bezier(.36,.07,.19,.97) both; }
    .cb-tick   { stroke-dasharray: 16; stroke-dashoffset: 0;
                 animation: cb-tick 0.28s cubic-bezier(0.6,0.04,0.98,0.335) both; }
    .cb-dash   { stroke-dasharray: 8;  stroke-dashoffset: 0;
                 animation: cb-dash 0.22s ease both; }
    .cb-unchecked { stroke-dasharray: 16; stroke-dashoffset: 16; }
    .cb-undash    { stroke-dasharray: 8;  stroke-dashoffset: 8; }
  `;
  document.head.appendChild(s);
}
 
// ─── Tick / Dash SVG icons ────────────────────────────────────────────────────
 
interface TickProps { size: CheckboxSize; animate: boolean }
 
function Tick({ size, animate }: TickProps) {
  const { w, h, strokeW, points } = sizeIcon[size];
  return (
    <svg width={w} height={h} viewBox="0 0 12 10" fill="none" aria-hidden>
      <polyline
        points={points}
        stroke="white"
        strokeWidth={strokeW}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? "cb-tick" : "cb-unchecked"}
        key={animate ? "checked" : "unchecked"}
      />
    </svg>
  );
}
 
function Dash({ size, animate }: { size: CheckboxSize; animate: boolean }) {
  const { w, h, strokeW } = sizeIcon[size];
  return (
    <svg width={w} height={h} viewBox="0 0 12 10" fill="none" aria-hidden>
      <line
        x1="2" y1="5" x2="10" y2="5"
        stroke="white"
        strokeWidth={strokeW}
        strokeLinecap="round"
        className={animate ? "cb-dash" : "cb-undash"}
        key={animate ? "indeterminate" : "idle"}
      />
    </svg>
  );
}
 
// ─── Main Checkbox component ──────────────────────────────────────────────────
 
export function Checkbox({
  label,
  value,
  description,
  checked = false,
  indeterminate = false,
  disabled = false,
  size = "md",
  variant = "default",
  onChange,
  className = "",
}: CheckboxProps) {
  const id = useId();
  const [animKey, setAnimKey] = useState(0);
  const hasDesc = Boolean(description);
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (disabled) return;
    setAnimKey((k) => k + 1);
    onChange?.(e.target.checked);
  };
 
  // Visual states
  const isChecked = !indeterminate && checked;
  const isIndet   = indeterminate;
  const isActive  = isChecked || isIndet;
 
  // Box classes
  const boxBase =
    "relative flex items-center justify-center flex-shrink-0 border-[1.5px] transition-all duration-200 select-none";
  const boxColor = isActive
    ? `${variantBox[variant]} border-transparent`
    : `border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 ${variantHoverBorder[variant]}`;
  const boxHover = !disabled ? "group-hover:scale-105" : "";
  const boxActive = !disabled ? "group-active:scale-95" : "";
  //const boxDisabled = disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer";
 
  // Card wrapper (when description exists)
  const cardBase =
    "flex items-start gap-3 rounded-xl border p-3 transition-all duration-200";
  const cardColor = isActive
    ? `${variantCardBorder[variant]} ${variantCardBg[variant]}`
    : `border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 ${
        !disabled ? `hover:${variantCardBorder[variant]}` : ""
      }`;
 
  const rootTag = hasDesc ? (
    <label
      htmlFor={id}
      className={`group flex ${hasDesc ? cardBase + " " + cardColor : "items-center gap-3"} ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className}`}
    >
      {/* Box */}
      <div
        key={animKey}
        className={[boxBase, sizeBox[size], boxColor, boxHover, boxActive, isActive ? "cb-pop" : "", "mt-0.5"].join(" ")}
        aria-hidden
      >
        {isIndet
          ? <Dash  size={size} animate={isIndet}  key={`d-${animKey}`} />
          : <Tick  size={size} animate={isChecked} key={`t-${animKey}`} />
        }
      </div>
 
      {/* Text */}
      <div className="flex flex-col gap-0.5">
        <span className={`font-medium ${sizeLabel[size]} text-gray-800 dark:text-gray-100 transition-colors duration-200`}>
          {label}
        </span>
        {description && (
          <span className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            {description}
          </span>
        )}
      </div>
 
      {/* Hidden native input for a11y */}
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
        value={value}
        aria-checked={isIndet ? "mixed" : checked}
      />
    </label>
  ) : (
    <label
      htmlFor={id}
      className={`group inline-flex items-center gap-3 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className}`}
    >
      <div
        key={animKey}
        className={[boxBase, sizeBox[size], boxColor, boxHover, boxActive, isActive ? "cb-pop" : ""].join(" ")}
        aria-hidden
      >
        {isIndet
          ? <Dash size={size} animate={isIndet}  key={`d-${animKey}`} />
          : <Tick size={size} animate={isChecked} key={`t-${animKey}`} />
        }
      </div>
 
      <span className={`${sizeLabel[size]} text-gray-700 dark:text-gray-300 transition-colors duration-200 ${isChecked ? "text-gray-900 dark:text-gray-100" : ""}`}>
        {label}
      </span>
 
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        className="sr-only"
        value={value}
        aria-checked={isIndet ? "mixed" : checked}
      />
    </label>
  );
 
  return rootTag;
}