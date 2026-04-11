
/* ─── Constants ──────────────────────────────────────────────────────────── */
export const MODES = {
  pomodoro: { label: "Pomodoro",       s: 25 * 60, color: "#e85d35", ring: "stroke-[#e85d35]" },
  short:    { label: "Descanso corto", s:  5 * 60, color: "#4fa38a", ring: "stroke-[#4fa38a]" },
  long:     { label: "Descanso largo", s: 15 * 60, color: "#3e7fb5", ring: "stroke-[#3e7fb5]" },
};

export const PRIORITIES = {
  alta:  { label: "Alta",  hex: "#e85d35" },
  media: { label: "Media", hex: "#e8a535" },
  baja:  { label: "Baja",  hex: "#4fa38a" },
};

export const ESTADO_HEX = {
  "pendiente":   "#555",
  "en progreso": "#3e7fb5",
  "revisión":    "#e8a535",
  "completada":  "#4fa38a",
  "cerrada":   "#444",
};

export const CATEGORIAS = [
  { value: "trabajo",  label: "💼 Trabajo"  },
  { value: "estudio",  label: "📚 Estudio"  },
  { value: "deporte",  label: "🏃 Deporte"  },
  { value: "hogar",    label: "🏠 Hogar"    },
  { value: "personal", label: "🙋 Personal" },
  { value: "finanzas", label: "💰 Finanzas" },
  { value: "salud",    label: "🩺 Salud"    },
  { value: "otro",     label: "✦ Otro"      },
];

export const TEXT_COLORS = [
    { hex: "#000000", label: "Negro"   },
    { hex: "#e85d35", label: "Naranja"  },
    { hex: "#e8a535", label: "Ámbar"    },
    { hex: "#4fa38a", label: "Verde"    },
    { hex: "#3e7fb5", label: "Azul"     },
    { hex: "#b57be8", label: "Violeta"  },
    { hex: "#e84fa3", label: "Rosa"     },
];