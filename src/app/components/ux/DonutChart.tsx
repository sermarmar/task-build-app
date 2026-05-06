import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs))

interface DonutItem {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  items: DonutItem[]
  size?: number
  strokeWidth?: number
  gap?: number   // degrees of separation between segments
  centerText?: string
  className?: string
}

export const DonutChart: React.FC<DonutChartProps> = ({
  items,
  size = 160,
  strokeWidth = 20,
  gap = 4,
  centerText,
  className,
}) => {
  const cx = size / 2
  const cy = size / 2
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const gapLength = (gap / 360) * circumference

  const total = items.reduce((sum, item) => sum + item.value, 0)
  const activeItems = items.filter((item) => item.value > 0)

  const fractions = activeItems.map((item) => (total > 0 ? item.value / total : 0))

  const rotations = fractions.reduce<number[]>((acc, _f, i) => {
    const prev = i === 0 ? -90 : acc[i - 1] + fractions[i - 1] * 360
    return [...acc, prev]
  }, [])

  const segments = activeItems.map((item, i) => ({
    ...item,
    dashLength: Math.max(0, fractions[i] * circumference - gapLength),
    rotation: rotations[i],
  }))

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg width={size} height={size}>
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
          />
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={`${seg.dashLength} ${circumference}`}
              strokeDashoffset={0}
              transform={`rotate(${seg.rotation}, ${cx}, ${cy})`}
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          ))}
        </svg>
        <span className="absolute text-4xl font-semibold text-secondary-800 text-center leading-tight">
          {centerText ?? total}
        </span>
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5 text-xs min-w-0">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-primary-950/80 truncate">{item.label}</span>
            <span className="ml-auto pl-1 font-medium text-primary-950 shrink-0">
              {item.value.toFixed(2)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
