import React from 'react';

export interface SidebarCategory {
  id: string;
  name: string;
  icon?: string;
  count?: number;
}

interface CategorySidebarProps {
  categories: SidebarCategory[];
  selected: string | null;
  onSelect: (id: string) => void;
  title?: string;
  accentColor?: string; // Default gold like Pluto TV
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selected,
  onSelect,
  title,
  accentColor = '#F5C518',
}) => {
  return (
    <aside className="w-56 flex-shrink-0 bg-[#0D0D12] border-r border-[#1E1E2E] h-full overflow-y-auto">
      <div className="py-4">
        {title && (
          <h2 className="px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-3">
            {title}
          </h2>
        )}

        <nav className="space-y-1 px-2">
          {categories.map((category) => {
            const isSelected = selected === category.id;

            return (
              <button
                key={category.id}
                onClick={() => onSelect(category.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all
                  ${isSelected
                    ? 'text-black font-semibold'
                    : 'text-[#9CA3AF] hover:text-white hover:bg-[#1E1E2E]'
                  }
                `}
                style={isSelected ? { backgroundColor: accentColor } : undefined}
              >
                {category.icon && (
                  <span className="text-lg flex-shrink-0">{category.icon}</span>
                )}
                <span className="flex-1 truncate text-sm">{category.name}</span>
                {category.count !== undefined && (
                  <span className={`text-xs ${isSelected ? 'text-black/60' : 'text-[#6B7280]'}`}>
                    {category.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default CategorySidebar;
