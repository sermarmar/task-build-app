import { icons, type LucideProps } from 'lucide-react';

export const DynamicIcon = ({ name, ...props }: { name: string } & LucideProps) => {
  const IconComponent = icons[name as keyof typeof icons];
  
  if (!IconComponent) return null;
  
  return <IconComponent {...props} />;
};