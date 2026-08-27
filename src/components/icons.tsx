import React from 'react';
import {
  UtensilsCrossed,
  PieChart,
  Layers,
  Flame,
  Sandwich,
  Square,
  CircleDot,
  Sparkles,
  Disc,
  Wine,
  Pizza,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'UtensilsCrossed':
      return <UtensilsCrossed {...props} />;
    case 'PieChart':
      return <PieChart {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    case 'Flame':
      return <Flame {...props} />;
    case 'Sandwich':
      return <Sandwich {...props} />;
    case 'Square':
      return <Square {...props} />;
    case 'CircleDot':
      return <CircleDot {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'Disc':
      return <Disc {...props} />;
    case 'Wine':
      return <Wine {...props} />;
    case 'Pizza':
      return <Pizza {...props} />;
    default:
      return <UtensilsCrossed {...props} />;
  }
};
