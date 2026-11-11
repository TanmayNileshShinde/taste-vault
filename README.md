# 🍽️ TasteVault — Personal Eatery & Don't-Repeat Food Tracker

> **Never repeat a dish by mistake again.** TasteVault tracks every dish you eat across Swiggy, Zomato, cafes, and dine-in restaurants so you always explore new flavors and avoid bad meals.

Built with a tactile **Neumorphic design system**, dark/light mode, instant search recall, wishlist tracking, and automated screenshot bill parsing.

---

## ✨ Key Capabilities

1. **Instant Search & Recall**: Type any restaurant name (e.g., *Joey's Pizza*, *Café Madras*) or dish (*Biryani*, *Dosa*) to instantly see what you've ordered before, your verdict, and what you planned to try next.
2. **🚫 "Don't Repeat" Flags**: Keep food exploration exciting by flagging items you've already experienced.
3. **⚠️ Zero-Repeat Blacklist (Never Again)**: Remembers oily, bland, or overpriced dishes so you never waste money on them twice.
4. **🎯 Menu Wishlist**: Saw something mouth-watering on the menu or Swiggy? Drop it in the wishlist to order on your next visit.
5. **📸 Automated Screenshot Sync**:
   - Snap a picture of your paper bill, Swiggy order receipt, or menu card.
   - Send it to Antigravity in chat.
   - The AI automatically extracts dishes, prices, and tasting notes, updates `src/data/food-log.json`, and commits to GitHub.
6. **💾 Zero-Database / GitHub Powered**: All records live in clean JSON (`src/data/food-log.json`), backed up by local browser storage with 1-click JSON export.

---

## 🎨 Neumorphic Design System

- Soft embossed surfaces with realistic ambient lighting and depth.
- Tactile pressed/inset inputs and active state pill buttons.
- Fully responsive across mobile phones (ordering on Swiggy/Zomato) and desktop.
- Instant Dark & Light mode toggle.

---

## 🚀 Running Locally

```bash
# Clone the repository
git clone https://github.com/TanmayNileshShinde/taste-vault.git

# Enter project directory
cd taste-vault

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

---

## 📁 Data Structure (`src/data/food-log.json`)

```json
{
  "restaurants": [
    {
      "id": "joeys-pizza",
      "name": "Joey's Pizza",
      "location": "Andheri West / Malad",
      "cuisine": ["Pizza", "Italian", "Fast Food"],
      "visitedCount": 3,
      "lastVisited": "2026-11-04",
      "overallRating": 4.8
    }
  ],
  "entries": [
    {
      "id": "entry-001",
      "restaurantName": "Joey's Pizza",
      "orderDate": "2026-11-04",
      "orderSource": "Dine-in",
      "billTotal": 980,
      "items": [
        {
          "name": "Meat Craver Signature 10\"",
          "category": "Main Course",
          "price": 540,
          "rating": 5,
          "verdict": "Loved It",
          "doNotRepeat": true,
          "notes": "Loaded with barbecue chicken, sausages and mozzarella. Try Tornado Pizza next time!"
        }
      ]
    }
  ]
}
```

---

## 👤 Author

- **Tanmay Nilesh Shinde** ([@TanmayNileshShinde](https://github.com/TanmayNileshShinde))
