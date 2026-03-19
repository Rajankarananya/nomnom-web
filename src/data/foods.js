// Shared food data for the app
export const FOODS = [
  { id: 'pizza', key: 'pizza', name: 'Supreme Pizza', bgColor: '#8B4513', tags: ['Epic', 'Cheesy', 'Classic'] },
  { id: 'ramen', key: 'ramen', name: 'Spicy Ramen', bgColor: '#8B0000', tags: ['Hot', 'Noodles', 'Warm'] },
  { id: 'butterChicken', key: 'butterChicken', name: 'Butter Chicken', bgColor: '#D2691E', tags: ['Creamy', 'Indian', 'Spicy'] },
  { id: 'avocadoToast', key: 'avocadoToast', name: 'Avocado Toast', bgColor: '#556B2F', tags: ['Healthy', 'Trendy', 'Fresh'] },
  { id: 'tacos', key: 'tacos', name: 'Street Tacos', bgColor: '#8B4513', tags: ['Mexican', 'Crunchy', 'Fun'] },
  { id: 'sushi', key: 'sushi', name: 'Dragon Roll', bgColor: '#2F4F4F', tags: ['Fresh', 'Light', 'Japanese'] },
  { id: 'burger', key: 'burger', name: 'Smash Burger', bgColor: '#8B4513', tags: ['Juicy', 'Classic', 'American'] },
  { id: 'padThai', key: 'padThai', name: 'Pad Thai', bgColor: '#8B6914', tags: ['Thai', 'Noodles', 'Sweet'] },
  { id: 'pasta', key: 'pasta', name: 'Truffle Pasta', bgColor: '#556B2F', tags: ['Italian', 'Comfort', 'Hearty'] },
  { id: 'falafel', key: 'falafel', name: 'Falafel Wrap', bgColor: '#8B6914', tags: ['Crispy', 'Vegan', 'Fresh'] },
];

export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getFoodById(id) {
  return FOODS.find(food => food.id === id);
}
