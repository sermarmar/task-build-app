import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Sin registrar las sombras del tema, twMerge no sabe que shadow-clay y shadow-none chocan
const twMerge = extendTailwindMerge({
    extend: {
        theme: {
            shadow: ['clay', 'clay-sm', 'clay-inset', 'clay-pressed'],
        },
    },
})

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))
