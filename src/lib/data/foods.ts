import type { DietType, Food, MealSlot } from "@/lib/types";

export const FOODS: Food[] = [
  { id: "egg", name: "Egg", serving: "1 large", calories: 78, protein: 6.3, carbs: 0.6, fat: 5.3, tags: ["quick", "breakfast"], vegetarian: true, vegan: false, containsEgg: true },
  { id: "paneer", name: "Paneer", serving: "100g", calories: 265, protein: 18, carbs: 1.2, fat: 21, tags: ["quick", "lunch"], vegetarian: true, vegan: false, containsEgg: false },
  { id: "buffalo-paneer", name: "Buffalo Paneer", serving: "100g", calories: 292, protein: 20, carbs: 1, fat: 23, tags: ["dense", "dinner"], vegetarian: true, vegan: false, containsEgg: false },
  { id: "dal", name: "Dal", serving: "1 cup cooked", calories: 198, protein: 12, carbs: 34, fat: 1.5, tags: ["quick", "staple", "lunch"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "rajma", name: "Rajma", serving: "1 cup", calories: 225, protein: 15, carbs: 40, fat: 0.9, tags: ["staple", "lunch"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "chana", name: "Chana", serving: "1 cup", calories: 269, protein: 15, carbs: 45, fat: 4, tags: ["quick", "lunch"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "oats", name: "Oats", serving: "40g dry", calories: 150, protein: 5, carbs: 27, fat: 3, tags: ["breakfast"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "milk", name: "Milk", serving: "250ml", calories: 150, protein: 8, carbs: 12, fat: 8, tags: ["quick", "breakfast"], vegetarian: true, vegan: false, containsEgg: false },
  { id: "roti", name: "Roti", serving: "1 medium", calories: 120, protein: 3.5, carbs: 18, fat: 3.5, tags: ["staple", "dinner"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "rice", name: "Rice", serving: "1 cup cooked", calories: 206, protein: 4.3, carbs: 45, fat: 0.4, tags: ["staple", "lunch"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "banana", name: "Banana", serving: "1 medium", calories: 105, protein: 1.3, carbs: 27, fat: 0.4, tags: ["fruit", "snack"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "apple", name: "Apple", serving: "1 medium", calories: 95, protein: 0.5, carbs: 25, fat: 0.3, tags: ["fruit", "snack"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "dahi", name: "Dahi", serving: "200g", calories: 140, protein: 8, carbs: 10, fat: 7, tags: ["quick", "lunch"], vegetarian: true, vegan: false, containsEgg: false },
  { id: "chicken", name: "Chicken Breast", serving: "100g", calories: 165, protein: 31, carbs: 0, fat: 3.6, tags: ["dense", "dinner"], vegetarian: false, vegan: false, containsEgg: false },
  { id: "fish", name: "Fish", serving: "100g", calories: 140, protein: 26, carbs: 0, fat: 3, tags: ["dense", "dinner"], vegetarian: false, vegan: false, containsEgg: false },
  { id: "whey", name: "Whey / Plant Shake", serving: "1 scoop", calories: 120, protein: 24, carbs: 3, fat: 1.5, tags: ["quick", "snack"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "peanut", name: "Peanuts", serving: "30g", calories: 170, protein: 7, carbs: 5, fat: 14, tags: ["snack"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "sprouts", name: "Moong Sprouts", serving: "1 cup", calories: 60, protein: 6, carbs: 10, fat: 0.4, tags: ["light", "breakfast"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "poha", name: "Poha", serving: "1 plate", calories: 250, protein: 6, carbs: 45, fat: 6, tags: ["breakfast"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "idli", name: "Idli", serving: "3 pieces", calories: 180, protein: 6, carbs: 36, fat: 1, tags: ["breakfast"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "curd-rice", name: "Curd rice", serving: "1 bowl", calories: 260, protein: 8, carbs: 40, fat: 7, tags: ["lunch"], vegetarian: true, vegan: false, containsEgg: false },
  { id: "palak", name: "Palak / spinach", serving: "1 cup", calories: 40, protein: 5, carbs: 6, fat: 0.4, tags: ["dinner", "iron"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "soya", name: "Soya chunks", serving: "50g dry", calories: 170, protein: 26, carbs: 15, fat: 1, tags: ["dense", "dinner"], vegetarian: true, vegan: true, containsEgg: false },
  { id: "buttermilk", name: "Chaas", serving: "250ml", calories: 70, protein: 4, carbs: 6, fat: 3, tags: ["lunch"], vegetarian: true, vegan: false, containsEgg: false },
  { id: "almonds", name: "Almonds", serving: "10", calories: 70, protein: 2.5, carbs: 2.5, fat: 6, tags: ["snack"], vegetarian: true, vegan: true, containsEgg: false },
];

export const MEALS: MealSlot[] = ["breakfast", "lunch", "dinner", "snack"];

export function defaultMeal(foodId: string): MealSlot {
  const food = foodById(foodId);
  const tag = food?.tags.find((t) => MEALS.includes(t as MealSlot));
  return (tag as MealSlot) ?? "snack";
}

export const QUICK_ADD_IDS = ["egg", "paneer", "milk", "dal", "chana"] as const;

export function foodsForDiet(diet: DietType) {
  return FOODS.filter((food) => {
    if (diet === "vegan") return food.vegan;
    if (diet === "vegetarian") return food.vegetarian && !food.containsEgg;
    if (diet === "eggetarian") return food.vegetarian;
    return true;
  });
}

export function foodById(id: string) {
  return FOODS.find((f) => f.id === id);
}
