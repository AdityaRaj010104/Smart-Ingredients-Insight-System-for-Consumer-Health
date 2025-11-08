// src/lib/constants.js

export const APP_NAME = "NutriScan";

export const APP_TAGLINE = "Smart Nutrition, Personalized Shopping";

export const APP_DESCRIPTION = "Your AI-powered grocery companion that understands your health needs, dietary preferences, and wellness goals. Shop smarter, eat healthier.";

export const FEATURES = [
  {
    title: "AI-Powered Nutrition",
    description: "Advanced algorithms analyze your health profile to recommend perfect products tailored just for you.",
    icon: "brain"
  },
  {
    title: "Instant Scanning",
    description: "Scan product barcodes to instantly check nutritional compatibility with your dietary needs and allergens.",
    icon: "scan"
  },
  {
    title: "Smart Recommendations",
    description: "Get personalized product suggestions based on your health goals, preferences, and shopping history.",
    icon: "sparkles"
  },
  {
    title: "Allergen Detection",
    description: "Automatic alerts for ingredients that don't match your allergen profile. Shop with confidence.",
    icon: "shield"
  },
  {
    title: "Lightning Delivery",
    description: "Fresh, quality products delivered to your doorstep in under 15 minutes. Health can't wait.",
    icon: "zap"
  },
  {
    title: "Health Tracking",
    description: "Monitor your nutrition intake and get insights on how your shopping aligns with your wellness goals.",
    icon: "activity"
  }
];

export const STATS = [
  { value: "4", label: "Happy Users" },
  //{ value: "15 Min", label: "Avg Delivery" },
  { value: "1k+", label: "Products" },
  { value: "4.2★", label: "User Rating" }
];

export const TESTIMONIALS = [
  {
    name: "Jayant Kumar",
    role: "Diabetes Management",
    content: "NutriScan has completely transformed how I shop. It alerts me about hidden sugars and recommends perfect alternatives. My blood sugar levels have never been better!",
    avatar: "PS"
  },
  {
    name: "Aditya Raj",
    role: "Fitness Enthusiast",
    content: "As someone focused on building muscle, finding high-protein, clean products was tough. NutriScan makes it effortless. The personalized recommendations are spot-on!",
    avatar: "RM"
  },
  {
    name: "Dhruv Jain",
    role: "Vegan Lifestyle",
    content: "Finally, a platform that truly understands vegan nutrition! No more reading endless labels. NutriScan does it all and delivers fresh produce super fast.",
    avatar: "AG"
  }
];

export const FAQS = [
  {
    question: "How does NutriScan personalize my shopping experience?",
    answer: "NutriScan uses advanced AI to analyze your health profile, dietary preferences, allergens, and wellness goals. Our algorithm then curates product recommendations specifically for you, filters out incompatible items, and suggests healthier alternatives."
  },
  {
    question: "What dietary preferences and health conditions do you support?",
    answer: "We support vegetarian, non-vegetarian, and vegan diets. Our platform helps manage obesity, diabetes, PCOS, thyroid issues, heart health, and general wellness. We also filter for 20+ common allergens including dairy, gluten, nuts, soy, and more."
  },
  {
    question: "How does the barcode scanning feature work?",
    answer: "Simply scan any product barcode with your phone camera. NutriScan instantly analyzes the ingredients against your profile, highlights potential allergens, rates nutritional compatibility, and suggests better alternatives if available."
  },
  {
    question: "How fast is delivery and what areas do you serve?",
    answer: "We offer lightning-fast delivery in 10-15 minutes across major metro cities in India. We're rapidly expanding to more locations. Check your area's availability during signup."
  },
  {
    question: "Can I update my health profile and preferences later?",
    answer: "Absolutely! Your health journey evolves, and so should your profile. You can update your dietary preferences, allergens, health goals, and measurements anytime from your dashboard settings."
  },
  {
    question: "Is my health information secure?",
    answer: "Yes! We take your privacy seriously. All health data is encrypted end-to-end and never shared with third parties. We use it solely to personalize your shopping experience."
  }
];

export const DIET_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Vegan'];

export const ALLERGEN_OPTIONS = [
  'Chickpea', 'Dairy', 'Egg', 'Gluten', 
  'Lactose', 'Peanut', 'Soy', 'Tree Nuts'
];

export const HEALTH_FOCUS_OPTIONS = [
  'Weight Management', 
  'Diabetes Control', 
  'Heart Health',
  'Smart Eating',
  'Muscle Building',
  'PCOS Management'
];

export const GENDER_OPTIONS = ['Male', 'Female', 'Others'];

export const FOOTER_LINKS = {
  company: [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Blog', href: '#' }
  ],
  support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' }
  ],
  shop: [
    { label: 'Fresh Produce', href: '#' },
    { label: 'Organic Foods', href: '#' },
    { label: 'Health Supplements', href: '#' },
    { label: 'Special Diets', href: '#' }
  ]
};

export const DEMO_CREDENTIALS = {
  email: 'user@gmail.com',
  username: 'user',
  password: 'user'
};