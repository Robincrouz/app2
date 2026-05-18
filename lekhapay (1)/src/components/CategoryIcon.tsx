import React from "react";
import { 
  Utensils, Bus, ShoppingBag, FileText, Banknote, Home, 
  Activity, GraduationCap, Film, Plane, TrendingUp, 
  MoreHorizontal, Heart, Smartphone, Target, Coffee
} from "lucide-react";

interface CategoryIconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function CategoryIcon({ name, size = 16, className = "", strokeWidth }: CategoryIconProps) {
  const icons: Record<string, any> = {
    Utensils, Bus, ShoppingBag, FileText, Banknote, Home, 
    Activity, GraduationCap, Film, Plane, TrendingUp, 
    MoreHorizontal, Heart, Smartphone, Target, Coffee
  };
  const IconComponent = icons[name] || MoreHorizontal;
  return <IconComponent size={size} className={className} strokeWidth={strokeWidth} />;
}
