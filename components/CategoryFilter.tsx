import React from 'react';
import { Button, Dropdown } from 'flowbite-react';
import { HiFilter } from 'react-icons/hi';

interface Categoria {
  id: number;
  nome: string;
}

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  categories: Categoria[];
  loading: boolean;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  categories = [],
  loading,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange(null)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          !selectedCategory
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        Todas
      </button>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-8 w-20 rounded-full bg-gray-200"></div>
        </div>
      ) : (
        Array.isArray(categories) && categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.nome)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === category.nome
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {category.nome}
          </button>
        ))
      )}
    </div>
  );
}
