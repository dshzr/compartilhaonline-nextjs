export const categories = {
  marketing: {
    name: "Marketing",
  },
  technology: {
    name: "Tecnologia",
  },
  business: {
    name: "Negócios",
  },
  education: {
    name: "Educação",
  },
  health: {
    name: "Saúde",
  },
};

export type Category = keyof typeof categories;
