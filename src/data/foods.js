// Smart shuffle helper
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Fetch a fresh deck from MealDB every session
export async function fetchFoodDeck(deckSize = 12, categories = []) {
  console.log('categories received:', categories);

  const TYPE_CATEGORIES = ['Chicken','Beef','Seafood','Vegetarian','Dessert','Lamb','Pork','Miscellaneous','Pasta'];
  const CUISINE_AREAS = ['Indian','Italian','Mexican','Chinese','Japanese','Greek','American','Moroccan'];

  const types = categories.filter(c => TYPE_CATEGORIES.includes(c));
  const cuisines = categories.filter(c => CUISINE_AREAS.includes(c));

  const typePromises = types.map(cat =>
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`)
      .then(r => r.json()).then(d => d.meals || [])
  );

  const cuisinePromises = cuisines.map(area =>
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`)
      .then(r => r.json()).then(d => d.meals || [])
  );

  const allPromises = [...typePromises, ...cuisinePromises];

  // fallback
  if (allPromises.length === 0) {
    allPromises.push(
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken`)
        .then(r => r.json()).then(d => d.meals || []),
      fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian`)
        .then(r => r.json()).then(d => d.meals || [])
    );
  }

  const results = await Promise.all(allPromises);
  const allMeals = results.flat();

  return shuffleArray(allMeals)
    .slice(0, deckSize)
    .map(meal => ({
      id: meal.idMeal,
      name: meal.strMeal,
      image: meal.strMealThumb + '/preview',
      tags: categories.length > 0 ? categories : ['Fresh'],
      cuisine: cuisines[0] || types[0] || 'Mixed',
    }));
}

// Keep this so ResultScreen doesn't break
export function getFoodById(id, foods) {
  return foods.find((food) => food.id === id);
}
