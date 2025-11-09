// src/lib/productsData.js (Updated with NOVA scores and healthy items)

export const CATEGORIES = [
  { id: 'biscuits', name: 'Biscuits & Cookies', icon: '🍪' },
  { id: 'cakes', name: 'Cakes & Bakes', icon: '🎂' },
  { id: 'breads', name: 'Breads', icon: '🍞' },
  { id: 'chips', name: 'Chips & Namkeen', icon: '🥔' },
  { id: 'soft-drinks', name: 'Soft Drinks', icon: '🥤' },
  { id: 'juices', name: 'Juices & Fruit Drinks', icon: '🧃' },
  { id: 'milk', name: 'Flavoured Milk', icon: '🥛' },
  { id: 'health-drinks', name: 'Health Drinks', icon: '💪' },
  { id: 'chocolates', name: 'Chocolates & Sweets', icon: '🍫' },
  { id: 'noodles', name: 'Noodles & Pasta', icon: '🍜' },
  { id: 'spreads', name: 'Ketchup, Dips & Spreads', icon: '🍯' },
  { id: 'breakfast', name: 'Breakfast Essentials', icon: '🥣' },
  { id: 'grains-pulses', name: 'Grains & Pulses', icon: '🌾' },
  { id: 'nuts-seeds', name: 'Nuts & Seeds', icon: '🥜' },
  { id: 'dry-fruits', name: 'Dry Fruits', icon: '🍇' }
];

export const PRODUCTS = [
  // Biscuits & Cookies
  {
    id: 1,
    name: 'Parle-G Gold Biscuits',
    category: 'biscuits',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
    novaGroup: 4,
    description: 'Classic glucose biscuits, perfect for tea time. Made with wheat flour and loved by generations.',
    nutrition: { calories: 460, protein: 8, carbs: 75, fat: 12, fiber: 2, sugar: 28, sodium: 420 },
    ingredients: ['Wheat Flour', 'Sugar', 'Palm Oil', 'Glucose Syrup', 'Milk Solids', 'Raising Agents', 'Salt', 'Artificial Flavors'],
    allergens: ['Gluten', 'Dairy'],
    dietType: 'Vegetarian',
    weight: '200g',
    brand: 'Parle'
  },
  {
    id: 2,
    name: 'Britannia Good Day Cookies',
    category: 'biscuits',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400',
    novaGroup: 4,
    description: 'Buttery cookies with cashew and chocolate chips. A delightful treat for cookie lovers.',
    nutrition: { calories: 480, protein: 6, carbs: 65, fat: 20, fiber: 1, sugar: 32, sodium: 380 },
    ingredients: ['Refined Wheat Flour', 'Sugar', 'Hydrogenated Oil', 'Cashew', 'Chocolate Chips', 'Butter', 'Raising Agents', 'Artificial Flavors', 'Preservatives'],
    allergens: ['Gluten', 'Dairy', 'Tree Nuts'],
    dietType: 'Vegetarian',
    weight: '150g',
    brand: 'Britannia'
  },
  {
    id: 3,
    name: 'Oreo Chocolate Cookies',
    category: 'biscuits',
    image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400',
    novaGroup: 4,
    description: 'Iconic chocolate sandwich cookies with vanilla cream filling.',
    nutrition: { calories: 470, protein: 4, carbs: 71, fat: 18, fiber: 2, sugar: 38, sodium: 450 },
    ingredients: ['Sugar', 'Wheat Flour', 'Palm Oil', 'Cocoa Powder', 'High Fructose Corn Syrup', 'Leavening', 'Soy Lecithin', 'Artificial Flavors', 'Artificial Colors'],
    allergens: ['Gluten', 'Dairy', 'Soy'],
    dietType: 'Vegetarian',
    weight: '120g',
    brand: 'Cadbury'
  },

  // Breads
  {
    id: 6,
    name: 'Whole Wheat Bread',
    category: 'breads',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    novaGroup: 3,
    description: 'Healthy whole wheat bread, high in fiber and nutrients.',
    nutrition: { calories: 250, protein: 10, carbs: 48, fat: 3, fiber: 8, sugar: 4, sodium: 380 },
    ingredients: ['Whole Wheat Flour', 'Water', 'Yeast', 'Salt', 'Sugar', 'Wheat Gluten'],
    allergens: ['Gluten'],
    dietType: 'Vegetarian',
    weight: '400g',
    brand: 'Harvest Gold'
  },
  {
    id: 7,
    name: 'Multigrain Bread',
    category: 'breads',
    image: 'https://images.unsplash.com/photo-1598373182133-52452f7691ef?w=400',
    novaGroup: 3,
    description: 'Nutritious multigrain bread with seeds and whole grains.',
    nutrition: { calories: 260, protein: 11, carbs: 45, fat: 4, fiber: 9, sugar: 3, sodium: 340 },
    ingredients: ['Whole Wheat Flour', 'Oats', 'Flax Seeds', 'Sunflower Seeds', 'Water', 'Yeast', 'Salt', 'Honey'],
    allergens: ['Gluten'],
    dietType: 'Vegetarian',
    weight: '400g',
    brand: 'Modern'
  },

  // Chips & Namkeen
  {
    id: 8,
    name: 'Lays Classic Salted Chips',
    category: 'chips',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400',
    novaGroup: 4,
    description: 'Crispy potato chips with perfect salt seasoning.',
    nutrition: { calories: 536, protein: 6, carbs: 50, fat: 35, fiber: 4, sugar: 2, sodium: 640 },
    ingredients: ['Potatoes', 'Vegetable Oil', 'Salt', 'MSG', 'Preservatives'],
    allergens: [],
    dietType: 'Vegetarian',
    weight: '52g',
    brand: 'Lays'
  },
  {
    id: 9,
    name: 'Haldirams Aloo Bhujia',
    category: 'chips',
    image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
    novaGroup: 4,
    description: 'Traditional Indian savory snack made from potato and spices.',
    nutrition: { calories: 520, protein: 10, carbs: 48, fat: 32, fiber: 5, sugar: 3, sodium: 780 },
    ingredients: ['Chickpea Flour', 'Potato', 'Vegetable Oil', 'Salt', 'Spices', 'Preservatives'],
    allergens: ['Chickpea'],
    dietType: 'Vegetarian',
    weight: '200g',
    brand: 'Haldirams'
  },

  // Soft Drinks
  {
    id: 10,
    name: 'Coca Cola',
    category: 'soft-drinks',
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    novaGroup: 4,
    description: 'Classic cola soft drink, refreshing and fizzy.',
    nutrition: { calories: 140, protein: 0, carbs: 39, fat: 0, fiber: 0, sugar: 39, sodium: 45 },
    ingredients: ['Carbonated Water', 'High Fructose Corn Syrup', 'Caramel Color', 'Phosphoric Acid', 'Natural Flavors', 'Caffeine'],
    allergens: [],
    dietType: 'Vegetarian',
    weight: '600ml',
    brand: 'Coca Cola'
  },

  // Juices
  {
    id: 12,
    name: 'Real Orange Juice',
    category: 'juices',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400',
    novaGroup: 3,
    description: '100% real orange juice with no added sugar.',
    nutrition: { calories: 180, protein: 2, carbs: 42, fat: 0, fiber: 1, sugar: 38, sodium: 10 },
    ingredients: ['Orange Juice', 'Water', 'Vitamin C'],
    allergens: [],
    dietType: 'Vegetarian',
    weight: '1L',
    brand: 'Real'
  },

  // Flavoured Milk
  {
    id: 14,
    name: 'Amul Chocolate Milk',
    category: 'milk',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    novaGroup: 3,
    description: 'Rich chocolate flavored milk, loved by kids and adults.',
    nutrition: { calories: 150, protein: 8, carbs: 24, fat: 3, fiber: 0, sugar: 22, sodium: 120 },
    ingredients: ['Milk', 'Sugar', 'Cocoa Powder', 'Stabilizers'],
    allergens: ['Dairy'],
    dietType: 'Vegetarian',
    weight: '200ml',
    brand: 'Amul'
  },

  // Health Drinks
  {
    id: 16,
    name: 'Horlicks Classic Malt',
    category: 'health-drinks',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400',
    novaGroup: 4,
    description: 'Nutritious health drink with 23 vital nutrients.',
    nutrition: { calories: 377, protein: 14, carbs: 74, fat: 2, fiber: 5, sugar: 42, sodium: 280 },
    ingredients: ['Malted Barley', 'Wheat Flour', 'Milk Solids', 'Sugar', 'Minerals', 'Vitamins', 'Artificial Flavors'],
    allergens: ['Dairy', 'Gluten'],
    dietType: 'Vegetarian',
    weight: '500g',
    brand: 'Horlicks'
  },

  // Chocolates
  {
    id: 18,
    name: 'Dairy Milk Silk',
    category: 'chocolates',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=400',
    novaGroup: 4,
    description: 'Smooth and creamy milk chocolate bar.',
    nutrition: { calories: 545, protein: 7, carbs: 56, fat: 32, fiber: 3, sugar: 52, sodium: 85 },
    ingredients: ['Sugar', 'Milk Solids', 'Cocoa Butter', 'Cocoa Solids', 'Vegetable Fats', 'Emulsifiers', 'Artificial Flavors'],
    allergens: ['Dairy', 'Soy'],
    dietType: 'Vegetarian',
    weight: '60g',
    brand: 'Cadbury'
  },

  // Noodles
  {
    id: 20,
    name: 'Maggi Masala Noodles',
    category: 'noodles',
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400',
    novaGroup: 4,
    description: 'India\'s favorite 2-minute masala noodles.',
    nutrition: { calories: 392, protein: 9, carbs: 62, fat: 12, fiber: 3, sugar: 4, sodium: 1120 },
    ingredients: ['Wheat Flour', 'Palm Oil', 'Salt', 'Spices', 'Flavor Enhancer (MSG)', 'Preservatives', 'Artificial Colors'],
    allergens: ['Gluten'],
    dietType: 'Vegetarian',
    weight: '70g',
    brand: 'Nestle'
  },

  // Spreads
  {
    id: 22,
    name: 'Kissan Tomato Ketchup',
    category: 'spreads',
    image: 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?w=400',
    novaGroup: 4,
    description: 'Classic tomato ketchup made from fresh tomatoes.',
    nutrition: { calories: 100, protein: 1, carbs: 25, fat: 0, fiber: 1, sugar: 22, sodium: 620 },
    ingredients: ['Tomatoes', 'Sugar', 'Salt', 'Acetic Acid', 'Spices', 'Preservatives'],
    allergens: [],
    dietType: 'Vegetarian',
    weight: '500g',
    brand: 'Kissan'
  },

  // Breakfast
  {
    id: 24,
    name: 'Kelloggs Corn Flakes',
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1509315811345-672d83ef2fbc?w=400',
    novaGroup: 4,
    description: 'Crispy corn flakes, perfect breakfast cereal.',
    nutrition: { calories: 357, protein: 7, carbs: 84, fat: 1, fiber: 3, sugar: 8, sodium: 720 },
    ingredients: ['Corn', 'Sugar', 'Salt', 'Barley Malt Extract', 'Vitamins', 'Minerals'],
    allergens: ['Gluten'],
    dietType: 'Vegetarian',
    weight: '475g',
    brand: 'Kelloggs'
  },
  {
    id: 25,
    name: 'Quaker Oats',
    category: 'breakfast',
    image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400',
    novaGroup: 1,
    description: 'Healthy whole grain oats, rich in fiber.',
    nutrition: { calories: 379, protein: 13, carbs: 67, fat: 7, fiber: 11, sugar: 1, sodium: 5 },
    ingredients: ['Whole Grain Oats'],
    allergens: ['Gluten'],
    dietType: 'Vegetarian',
    weight: '1kg',
    brand: 'Quaker'
  },

  // Grains & Pulses (NOVA Group 1)
  {
    id: 26,
    name: 'Organic Brown Rice',
    category: 'grains-pulses',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    novaGroup: 1,
    description: 'Whole grain brown rice, rich in nutrients and fiber.',
    nutrition: { calories: 370, protein: 8, carbs: 77, fat: 3, fiber: 4, sugar: 0, sodium: 1 },
    ingredients: ['Organic Brown Rice'],
    allergens: [],
    dietType: 'Vegan',
    weight: '1kg',
    brand: '24 Mantra'
  },
  {
    id: 27,
    name: 'Toor Dal (Pigeon Peas)',
    category: 'grains-pulses',
    image: 'https://images.unsplash.com/photo-1596797882870-0d2c8b5d9f87?w=400',
    novaGroup: 1,
    description: 'Pure toor dal, high in protein and essential nutrients.',
    nutrition: { calories: 335, protein: 22, carbs: 62, fat: 2, fiber: 15, sugar: 2, sodium: 5 },
    ingredients: ['Toor Dal'],
    allergens: [],
    dietType: 'Vegan',
    weight: '1kg',
    brand: 'Aashirvaad'
  },
  {
    id: 28,
    name: 'Moong Dal (Green Gram)',
    category: 'grains-pulses',
    image: 'https://images.unsplash.com/photo-1589476705239-509c6e4d7d7e?w=400',
    novaGroup: 1,
    description: 'Nutritious moong dal, easy to digest and protein-rich.',
    nutrition: { calories: 347, protein: 24, carbs: 63, fat: 1, fiber: 16, sugar: 2, sodium: 2 },
    ingredients: ['Moong Dal'],
    allergens: [],
    dietType: 'Vegan',
    weight: '500g',
    brand: 'Tata Sampann'
  },
  {
    id: 29,
    name: 'Quinoa',
    category: 'grains-pulses',
    image: 'https://images.unsplash.com/photo-1586540907082-c66e8b5f5b6c?w=400',
    novaGroup: 1,
    description: 'Complete protein superfood, gluten-free and nutrient-dense.',
    nutrition: { calories: 368, protein: 14, carbs: 64, fat: 6, fiber: 7, sugar: 0, sodium: 5 },
    ingredients: ['Quinoa'],
    allergens: [],
    dietType: 'Vegan',
    weight: '500g',
    brand: 'Organic India'
  },
  {
    id: 30,
    name: 'Rajma (Kidney Beans)',
    category: 'grains-pulses',
    image: 'https://images.unsplash.com/photo-1583641583-84df0a1f0e49?w=400',
    novaGroup: 1,
    description: 'Red kidney beans, excellent source of plant protein and fiber.',
    nutrition: { calories: 333, protein: 24, carbs: 60, fat: 1, fiber: 25, sugar: 2, sodium: 2 },
    ingredients: ['Red Kidney Beans'],
    allergens: [],
    dietType: 'Vegan',
    weight: '500g',
    brand: 'Aashirvaad'
  },
  {
    id: 31,
    name: 'Chana Dal (Split Chickpeas)',
    category: 'grains-pulses',
    image: 'https://images.unsplash.com/photo-1607965743866-bf96f4efc463?w=400',
    novaGroup: 1,
    description: 'Split Bengal gram, rich in protein and dietary fiber.',
    nutrition: { calories: 364, protein: 20, carbs: 61, fat: 6, fiber: 17, sugar: 10, sodium: 6 },
    ingredients: ['Chana Dal'],
    allergens: [],
    dietType: 'Vegan',
    weight: '1kg',
    brand: 'Tata Sampann'
  },

  // Nuts & Seeds (NOVA Group 1)
  {
    id: 32,
    name: 'Raw Almonds',
    category: 'nuts-seeds',
    image: 'https://images.unsplash.com/photo-1508736793122-f516e3ba5569?w=400',
    novaGroup: 1,
    description: 'Premium quality raw almonds, rich in vitamin E and healthy fats.',
    nutrition: { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 13, sugar: 4, sodium: 1 },
    ingredients: ['Raw Almonds'],
    allergens: ['Tree Nuts'],
    dietType: 'Vegan',
    weight: '500g',
    brand: 'Nutraj'
  },
  {
    id: 33,
    name: 'Raw Cashews',
    category: 'nuts-seeds',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
    novaGroup: 1,
    description: 'Whole cashew nuts, creamy texture and rich in minerals.',
    nutrition: { calories: 553, protein: 18, carbs: 30, fat: 44, fiber: 3, sugar: 6, sodium: 12 },
    ingredients: ['Raw Cashews'],
    allergens: ['Tree Nuts'],
    dietType: 'Vegan',
    weight: '500g',
    brand: 'Nutraj'
  },
  {
    id: 34,
    name: 'Raw Walnuts',
    category: 'nuts-seeds',
    image: 'https://images.unsplash.com/photo-1622484211946-e92994d7e4ec?w=400',
    novaGroup: 1,
    description: 'Premium walnuts, excellent source of omega-3 fatty acids.',
    nutrition: { calories: 654, protein: 15, carbs: 14, fat: 65, fiber: 7, sugar: 3, sodium: 2 },
    ingredients: ['Raw Walnuts'],
    allergens: ['Tree Nuts'],
    dietType: 'Vegan',
    weight: '250g',
    brand: 'Happilo'
  },
  {
    id: 35,
    name: 'Chia Seeds',
    category: 'nuts-seeds',
    image: 'https://images.unsplash.com/photo-1615485500834-bc10199bc1c4?w=400',
    novaGroup: 1,
    description: 'Superfood seeds packed with omega-3, fiber and protein.',
    nutrition: { calories: 486, protein: 17, carbs: 42, fat: 31, fiber: 34, sugar: 0, sodium: 16 },
    ingredients: ['Chia Seeds'],
    allergens: [],
    dietType: 'Vegan',
    weight: '250g',
    brand: 'Organic India'
  },
  {
    id: 36,
    name: 'Flax Seeds',
    category: 'nuts-seeds',
    image: 'https://images.unsplash.com/photo-1619166844654-b21b6a5f8e54?w=400',
    novaGroup: 1,
    description: 'Golden flax seeds, rich in lignans and omega-3 fatty acids.',
    nutrition: { calories: 534, protein: 18, carbs: 29, fat: 42, fiber: 27, sugar: 2, sodium: 30 },
    ingredients: ['Flax Seeds'],
    allergens: [],
    dietType: 'Vegan',
    weight: '500g',
    brand: '24 Mantra'
  },
  {
    id: 37,
    name: 'Pumpkin Seeds',
    category: 'nuts-seeds',
    image: 'https://images.unsplash.com/photo-1605041411727-32f3ac6e3e0f?w=400',
    novaGroup: 1,
    description: 'Raw pumpkin seeds, high in magnesium and zinc.',
    nutrition: { calories: 559, protein: 30, carbs: 11, fat: 49, fiber: 6, sugar: 1, sodium: 7 },
    ingredients: ['Pumpkin Seeds'],
    allergens: [],
    dietType: 'Vegan',
    weight: '200g',
    brand: 'Happilo'
  },
  {
    id: 38,
    name: 'Sunflower Seeds',
    category: 'nuts-seeds',
    image: 'https://images.unsplash.com/photo-1612275706851-e93fd26b8598?w=400',
    novaGroup: 1,
    description: 'Raw sunflower seeds, rich in vitamin E and selenium.',
    nutrition: { calories: 584, protein: 21, carbs: 20, fat: 51, fiber: 9, sugar: 3, sodium: 9 },
    ingredients: ['Sunflower Seeds'],
    allergens: [],
    dietType: 'Vegan',
    weight: '250g',
    brand: 'Nutraj'
  },

  // Dry Fruits (NOVA Group 1)
  {
    id: 39,
    name: 'Dried Dates',
    category: 'dry-fruits',
    image: 'https://images.unsplash.com/photo-1628557032869-e5c7c204e7e1?w=400',
    novaGroup: 1,
    description: 'Natural dried dates, sweet and nutritious energy booster.',
    nutrition: { calories: 277, protein: 2, carbs: 75, fat: 0, fiber: 8, sugar: 66, sodium: 1 },
    ingredients: ['Dried Dates'],
    allergens: [],
    dietType: 'Vegan',
    weight: '500g',
    brand: 'Happilo'
  },
  {
    id: 40,
    name: 'Dried Figs (Anjeer)',
    category: 'dry-fruits',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
    novaGroup: 1,
    description: 'Premium dried figs, excellent source of fiber and minerals.',
    nutrition: { calories: 249, protein: 3, carbs: 64, fat: 1, fiber: 10, sugar: 48, sodium: 10 },
    ingredients: ['Dried Figs'],
    allergens: [],
    dietType: 'Vegan',
    weight: '250g',
    brand: 'Nutraj'
  },
  {
    id: 41,
    name: 'Raisins (Kishmish)',
    category: 'dry-fruits',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400',
    novaGroup: 1,
    description: 'Sun-dried raisins, naturally sweet and iron-rich.',
    nutrition: { calories: 299, protein: 3, carbs: 79, fat: 0, fiber: 4, sugar: 59, sodium: 11 },
    ingredients: ['Dried Grapes'],
    allergens: [],
    dietType: 'Vegan',
    weight: '500g',
    brand: 'Happilo'
  },
  {
    id: 42,
    name: 'Dried Apricots',
    category: 'dry-fruits',
    image: 'https://images.unsplash.com/photo-1627533449674-b990aa1b53c0?w=400',
    novaGroup: 1,
    description: 'Naturally dried apricots, rich in vitamin A and potassium.',
    nutrition: { calories: 241, protein: 3, carbs: 63, fat: 1, fiber: 7, sugar: 53, sodium: 10 },
    ingredients: ['Dried Apricots'],
    allergens: [],
    dietType: 'Vegan',
    weight: '250g',
    brand: 'Nutraj'
  },
  {
    id: 43,
    name: 'Dried Prunes',
    category: 'dry-fruits',
    image: 'https://images.unsplash.com/photo-1607623488235-89a7e1b21954?w=400',
    novaGroup: 1,
    description: 'Dried plums, natural laxative and rich in antioxidants.',
    nutrition: { calories: 240, protein: 2, carbs: 64, fat: 0, fiber: 7, sugar: 38, sodium: 2 },
    ingredients: ['Dried Plums'],
    allergens: [],
    dietType: 'Vegan',
    weight: '250g',
    brand: 'Happilo'
  },
  {
    id: 44,
    name: 'Mixed Dry Fruits',
    category: 'dry-fruits',
    image: 'https://images.unsplash.com/photo-1568906729119-5e63d5e68e1d?w=400',
    novaGroup: 1,
    description: 'Premium mix of almonds, cashews, raisins and walnuts.',
    nutrition: { calories: 520, protein: 15, carbs: 35, fat: 38, fiber: 8, sugar: 20, sodium: 5 },
    ingredients: ['Almonds', 'Cashews', 'Raisins', 'Walnuts'],
    allergens: ['Tree Nuts'],
    dietType: 'Vegan',
    weight: '500g',
    brand: 'Nutraj'
  }
];

export const getProductsByCategory = (categoryId) => {
  return PRODUCTS.filter(product => product.category === categoryId);
};

export const searchProducts = (query) => {
  const lowerQuery = query.toLowerCase();
  return PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.brand.toLowerCase().includes(lowerQuery) ||
    product.category.toLowerCase().includes(lowerQuery)
  );
};

export const getProductById = (id) => {
  return PRODUCTS.find(product => product.id === parseInt(id));
};