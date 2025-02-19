import React from "react";
import { Button } from "flowbite-react";

interface Categoria {
  id: number;
  nome: string;
}

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  categories: Categoria[];
  loading?: boolean;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  categories,
  loading = false,
}: CategoryFilterProps) {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-9 w-24 bg-gray-200 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <Button
        size="sm"
        color={selectedCategory === null ? "blue" : "gray"}
        onClick={() => onCategoryChange(null)}
      >
        Todas
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          size="sm"
          color={selectedCategory === category.nome ? "blue" : "gray"}
          onClick={() => onCategoryChange(category.nome)}
        >
          {category.nome}
        </Button>
      ))}
    </div>
  );
}
