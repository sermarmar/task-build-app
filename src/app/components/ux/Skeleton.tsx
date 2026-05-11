import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs));

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
    <div className={cn('animate-pulse rounded-md bg-primary-100/60', className)} />
);

export const SkeletonLine: React.FC<{ className?: string }> = ({ className }) => (
    <Skeleton className={cn('h-4 rounded', className)} />
);

export const SkeletonCircle: React.FC<{ className?: string }> = ({ className }) => (
    <Skeleton className={cn('rounded-full', className)} />
);
