import { cn } from '@sglara/cn';
import { useCallback, useEffect, useState } from 'react';


export interface ColorPickerProps {
  /** Color inicial en formato hex (ej. "#4F7BE8") */
  defaultValue?: string;
  /** Valor controlado en formato hex */
  value?: string;
  /** Callback que se dispara al cambiar el color */
  onChange?: (hex: string) => void;
  /** Paleta de colores rápidos. Pasa un array vacío para ocultarla */
  palette?: string[];
  /** Mostrar u ocultar los sliders HSL */
  showSliders?: boolean;
  /** Mostrar u ocultar la barra de previsualización */
  showPreview?: boolean;
  /** Mostrar u ocultar las métricas HSL */
  showHslValues?: boolean;
  /** Mostrar u ocultar el botón de copiar */
  showCopyButton?: boolean;
  /** Texto del botón de copiar */
  copyLabel?: string;
  /** Mensaje que aparece en el toast al copiar */
  copiedMessage?: string;
  /** Clases CSS adicionales para el contenedor raíz */
  className?: string;
  /** Ancho máximo del componente en px */
  maxWidth?: number;
}
 
// ─── Paleta por defecto ───────────────────────────────────────────────────────
 
const DEFAULT_PALETTE: string[] = [
  "#E24B4A", "#D85A30", "#EF9F27", "#639922", "#1D9E75",
  "#378ADD", "#534AB7", "#D4537E", "#888780", "#2C2C2A",
  "#F09595", "#F0997B", "#FAC775", "#97C459", "#5DCAA5",
  "#85B7EB", "#AFA9EC", "#ED93B1", "#B4B2A9", "#F1EFE8",
];

// ─── Utilidades de color ──────────────────────────────────────────────────────
 
function hslToHex(h: number, s: number, l: number): string {
  const sn = s / 100;
  const ln = l / 100;
  const a = sn * Math.min(ln, 1 - ln);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round((ln - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255);
  };
  return (
    "#" +
    [f(0), f(8), f(4)]
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}
 
function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      default: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
 
function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex);
}

// ─── Subcomponente: Slider con track degradado ────────────────────────────────
 
interface HslSliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  trackStyle: string;
  thumbColor: string;
  onChange: (v: number) => void;
}
 
function HslSlider({ label, min, max, value, trackStyle, thumbColor, onChange }: HslSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
 
  return (
    <div className="mb-3">
      <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1.5">
        {label}
      </p>
      <div className="relative w-full h-2.5 rounded-full overflow-hidden">
        <div className="absolute inset-0 rounded-full" style={{ background: trackStyle }} />
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          style={{ margin: 0 }}
        />
        <div
          className="absolute top-1/2 pointer-events-none rounded-full border-[2.5px] border-white"
          style={{
            width: 16,
            height: 16,
            left: `${pct}%`,
            transform: "translate(-50%, -50%)",
            background: thumbColor,
            boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    </div>
  );
}


export const ColorPicker: React.FC<ColorPickerProps> = ({
    defaultValue = "#4F7BE8",
    value: controlledValue,
    onChange,
    palette = DEFAULT_PALETTE,
    showSliders = true,
    showPreview = true,
    showHslValues = true,
    showCopyButton = true,
    copyLabel = "Copiar",
    copiedMessage = "Copiado al portapapeles",
    className,
    maxWidth = 340
}) => {
    const isControlled = controlledValue !== undefined;
 
    const parseInitial = (hex: string): [number, number, number] =>
        isValidHex(hex) ? hexToHsl(hex) : [220, 75, 55];
    
    const [H, setH] = useState<number>(() => parseInitial(isControlled ? controlledValue! : defaultValue)[0]);
    const [S, setS] = useState<number>(() => parseInitial(isControlled ? controlledValue! : defaultValue)[1]);
    const [L, setL] = useState<number>(() => parseInitial(isControlled ? controlledValue! : defaultValue)[2]);
    const [hexInput, setHexInput] = useState<string>(isControlled ? controlledValue! : defaultValue);
    const [toastVisible, setToastVisible] = useState(false);
    
    // Sync when controlledValue changes externally
    useEffect(() => {
        if (isControlled && controlledValue && isValidHex(controlledValue)) {
        const [nh, ns, nl] = hexToHsl(controlledValue);
        setH(nh); setS(ns); setL(nl);
        setHexInput(controlledValue.toUpperCase());
        }
    }, [controlledValue, isControlled]);
    
    const currentHex = hslToHex(H, S, L);
    
    const emitChange = useCallback(
        (h: number, s: number, l: number) => {
        const hex = hslToHex(h, s, l);
        setHexInput(hex);
        onChange?.(hex);
        },
        [onChange]
    );
    
    const handleSlider = (setter: (v: number) => void, key: "h" | "s" | "l") => (v: number) => {
        setter(v);
        const nh = key === "h" ? v : H;
        const ns = key === "s" ? v : S;
        const nl = key === "l" ? v : L;
        emitChange(nh, ns, nl);
    };
    
    const handleHexInput = (raw: string) => {
        setHexInput(raw.toUpperCase());
        const normalized = raw.startsWith("#") ? raw : `#${raw}`;
        if (isValidHex(normalized)) {
        const [nh, ns, nl] = hexToHsl(normalized);
        setH(nh); setS(ns); setL(nl);
        onChange?.(normalized.toUpperCase());
        }
    };
    
    const handleSwatch = (color: string) => {
        const [nh, ns, nl] = hexToHsl(color);
        setH(nh); setS(ns); setL(nl);
        setHexInput(color.toUpperCase());
        onChange?.(color.toUpperCase());
    };
    
    const handleCopy = async () => {
        try {
        await navigator.clipboard.writeText(currentHex);
        } catch {
        /* silently ignore */
        }
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 1800);
    };
    
    return (
        <div
        className={cn("font-sans relative", className)}
        style={{ maxWidth }}
        >
        <div className="rounded-xl border border-border bg-background overflow-hidden">
    
            {/* Preview */}
            {showPreview && (
            <div
                className="w-full h-16 transition-colors duration-200"
                style={{ background: currentHex }}
            />
            )}
    
            <div className="p-4">
    
            {/* Quick palette */}
            {palette.length > 0 && (
                <>
                <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-2">
                    Paleta rápida
                </p>
                <div
                    className="grid mb-4"
                    style={{ gridTemplateColumns: `repeat(${Math.min(palette.length, 10)}, 1fr)`, gap: 5 }}
                >
                    {palette.map((color) => (
                    <button
                        key={color}
                        title={color}
                        onClick={() => handleSwatch(color)}
                        className="aspect-square rounded-full border border-black/10 cursor-pointer transition-transform duration-100 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        style={{ background: color }}
                    />
                    ))}
                </div>
                </>
            )}
    
            {/* HSL Sliders */}
            {showSliders && (
                <>
                <HslSlider
                    label="Tono"
                    min={0} max={360} value={H}
                    trackStyle="linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)"
                    thumbColor={`hsl(${H},100%,50%)`}
                    onChange={handleSlider(setH, "h")}
                />
                <HslSlider
                    label="Saturación"
                    min={0} max={100} value={S}
                    trackStyle={`linear-gradient(to right, hsl(${H},0%,${L}%), hsl(${H},100%,${L}%))`}
                    thumbColor={currentHex}
                    onChange={handleSlider(setS, "s")}
                />
                <HslSlider
                    label="Luminosidad"
                    min={0} max={100} value={L}
                    trackStyle={`linear-gradient(to right, hsl(${H},${S}%,0%), hsl(${H},${S}%,50%), hsl(${H},${S}%,100%))`}
                    thumbColor={currentHex}
                    onChange={handleSlider(setL, "l")}
                />
                </>
            )}
    
            {/* Hex input + copy button */}
            <div className="flex items-center gap-2 mb-3">
                <div
                className="w-8 h-8 rounded-md border border-border flex-shrink-0 transition-colors duration-150"
                style={{ background: currentHex }}
                />
                <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexInput(e.target.value)}
                maxLength={7}
                className="flex-1 h-9 rounded-md border border-input bg-background px-3 font-mono text-sm tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-ring"
                />
                {showCopyButton && (
                <button
                    onClick={handleCopy}
                    className="h-9 px-3 text-sm rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring flex-shrink-0"
                >
                    {copyLabel}
                </button>
                )}
            </div>
    
            {/* HSL metrics */}
            {showHslValues && (
                <div className="grid grid-cols-3 gap-2">
                {[
                    { label: "H", value: `${H}°` },
                    { label: "S", value: `${S}%` },
                    { label: "L", value: `${L}%` },
                ].map(({ label, value }) => (
                    <div
                    key={label}
                    className="bg-muted rounded-md px-2 py-2 text-center"
                    >
                    <div className="text-[11px] text-muted-foreground mb-0.5">{label}</div>
                    <div className="text-[15px] font-medium">{value}</div>
                    </div>
                ))}
                </div>
            )}
    
            </div>
        </div>
    
        {/* Toast */}
        <div
            className={cn(
            "absolute bottom-[-48px] left-1/2 -translate-x-1/2 bg-background border border-border rounded-md px-4 py-1.5 text-sm whitespace-nowrap pointer-events-none transition-all duration-200",
            toastVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
            style={{ transform: `translateX(-50%) translateY(${toastVisible ? "0" : "8px"})` }}
        >
            {copiedMessage}
        </div>
        </div>
    );
}