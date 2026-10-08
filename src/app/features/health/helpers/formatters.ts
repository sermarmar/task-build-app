export const formatNumber = (n: number, digits = 1) => n.toLocaleString('es-ES', { maximumFractionDigits: digits });

export const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m ? `${h} h ${m} min` : `${h} h`;
};

// El formulario deja NaN en los campos numéricos vacíos
export const isFilled = (n: number | null | undefined): n is number => typeof n === 'number' && Number.isFinite(n) && n > 0;
