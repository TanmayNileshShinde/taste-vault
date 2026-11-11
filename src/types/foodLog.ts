export type OrderSource = 'Swiggy' | 'Zomato' | 'Dine-in' | 'Takeaway' | 'Other';

export type FoodVerdict = 'Loved It' | 'Good' | 'Average' | 'Never Again';

export interface FoodItem {
  id: string;
  name: string;
  category: 'Main Course' | 'Appetizer' | 'Dessert' | 'Beverage' | 'Breakfast' | 'Fast Food' | 'Snacks' | string;
  price?: number;
  rating: number; // 1 - 5
  verdict: FoodVerdict;
  doNotRepeat: boolean; // Flag to remind user to try something new
  notes?: string;
  tags?: string[];
}

export interface FoodEntry {
  id: string;
  restaurantId: string;
  restaurantName: string;
  orderDate: string; // YYYY-MM-DD
  orderSource: OrderSource;
  billTotal?: number;
  receiptNotes?: string;
  billImageUrl?: string;
  items: FoodItem[];
}

export interface Restaurant {
  id: string;
  name: string;
  location?: string;
  cuisine: string[];
  visitedCount: number;
  lastVisited: string;
  overallRating: number;
}

export interface WishlistItem {
  id: string;
  restaurantName: string;
  restaurantId: string;
  itemName: string;
  targetPrice?: number;
  reasonToTry?: string;
}

export interface FoodLogData {
  version: string;
  lastUpdated: string;
  restaurants: Restaurant[];
  entries: FoodEntry[];
  wishlist: WishlistItem[];
}
