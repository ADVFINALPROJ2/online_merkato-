const categories = [
  { name: 'Spices', icon: '🌶️' },
  { name: 'Textiles', icon: '🧵' },
  { name: 'Coffee', icon: '☕' },
  { name: 'Grains', icon: '🌾' },
  { name: 'Crafts', icon: '🏺' },
  { name: 'Produce', icon: '🥑' },
];

export const CategoryGrid = () => (
  <div className="grid grid-cols-3 md:grid-cols-6 gap-4 my-8">
    {categories.map((cat) => (
      <div key={cat.name} className="flex flex-col items-center p-4 bg-white rounded-xl border hover:border-blue-200 transition-colors">
        <span className="text-3xl mb-2">{cat.icon}</span>
        <span className="text-sm font-medium">{cat.name}</span>
      </div>
    ))}
  </div>
);