import { useLanguage } from "../../context/LanguageContext";

interface CategoryBadgeProps {
  name: string;
  color: string;
}

export default function CategoryBadge({ name, color }: CategoryBadgeProps) {
  const { tCategory } = useLanguage();

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {tCategory(name)}
    </span>
  );
}
