import React, { useRef, useEffect, useState } from "react";

type CheckboxSize = "sm" | "md" | "lg";
type CheckboxVariant = "default" | "teal" | "coral";

interface CheckboxProps {
  label?: string;
  value?: string | number;
  description?: string;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: CheckboxSize;
  variant?: CheckboxVariant;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const sizeConfig = {
  sm: { box: "w-4 h-4 rounded-[4px]", label: "text-[13px]", desc: "text-[12px]", gap: "gap-[9px]" },
  md: { box: "w-5 h-5 rounded-[5px]", label: "text-[14px]", desc: "text-[13px]", gap: "gap-[10px]" },
  lg: { box: "w-6 h-6 rounded-[6px]", label: "text-[15px]", desc: "text-[13px]", gap: "gap-[11px]" },
};

const variantConfig = {
  default: { bg: "bg-gray-700",   border: "border-gray-700" },
  teal:    { bg: "bg-teal-700",   border: "border-teal-700" },
  coral:   { bg: "bg-orange-700", border: "border-orange-700" },
};

const CheckIcon = ({ size }: { size: CheckboxSize }) => {
  const dims = { sm: [10, 8], md: [12, 9], lg: [14, 11] }[size];
  const path = { sm: "M1 4L3.5 6.5L9 1", md: "M1 4.5L4 7.5L11 1", lg: "M1 5.5L5 9.5L13 1" }[size];
  return (
    <svg width={dims[0]} height={dims[1]} viewBox={`0 0 ${dims[0]} ${dims[1]}`} fill="none">
      <path d={path} stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const IndeterminateIcon = () => (
  <svg width="12" height="2" viewBox="0 0 12 2" fill="none">
    <path d="M1 1H11" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  value,
  description,
  checked: checkedProp,
  indeterminate = false,
  disabled = false,
  size = "md",
  variant = "default",
  onChange,
  className = "",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const s = sizeConfig[size];
  const v = variantConfig[variant];

  // Estado interno — se usa si no se pasa checked desde fuera (uncontrolled)
  const isControlled = checkedProp !== undefined;
  const [internalChecked, setInternalChecked] = useState(false);
  const checked = isControlled ? checkedProp : internalChecked;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleClick = (e: React.MouseEvent<HTMLLabelElement>) => {
      e.preventDefault(); // evita que el label dispare doble evento
      if (disabled) {
        return;
      }
      const next = !checked;
      if (!isControlled) {
        setInternalChecked(next);
      }
      onChange?.(next);
  };

  const isActive = indeterminate || checked;

  return (
    <label
      onClick={(e) => handleClick(e)}
      className={[
        "inline-flex items-start cursor-pointer select-none group",
        label ? s.gap : "",
        disabled ? "opacity-45 cursor-not-allowed pointer-events-none" : "",
        className,
      ].join(" ")}
    >
      {/* Input oculto */}
      <input
        ref={inputRef}
        type="checkbox"
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => {}} // controlado por handleClick
        className="absolute opacity-0 w-0 h-0 pointer-events-none"
      />

      {/* Caja visual */}
      <span
        className={[
          "flex-shrink-0 flex items-center justify-center border-[1.5px] mt-px",
          "transition-all duration-150 ease-out",
          "group-hover:shadow-[0_0_0_3px_theme(colors.gray.100)]",
          "group-active:scale-90",
          s.box,
          isActive
            ? `${v.bg} ${v.border} border-transparent`
            : "bg-white border-gray-300 group-hover:border-gray-400",
        ].join(" ")}
      >
        <span
          className={[
            "transition-all duration-200",
            isActive ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 -rotate-12",
          ].join(" ")}
          style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        >
          {indeterminate ? <IndeterminateIcon /> : <CheckIcon size={size} />}
        </span>
      </span>

      {/* Texto — solo si hay label */}
      {label && (
        <span className="flex flex-col gap-0.5">
          <span className={`leading-snug text-gray-900 ${s.label}`}>{label}</span>
          {description && (
            <span className={`leading-snug text-gray-500 ${s.desc}`}>{description}</span>
          )}
        </span>
      )}
    </label>
  );
};