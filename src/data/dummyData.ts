// ===== Types =====
export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  orders: Order[];
}

export interface Category {
  id: string;
  name: string;
}
export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
}

export interface Product {
  id: string;
  sku: string; // ✅ REQUIRED (authoritative item key)
  subcategoryId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  rating: number;
}

export interface Inventory {
  id: string;
  productId: string; // keep for joins
  sku: string; // ✅ REQUIRED (inventory keyed by sku + city)
  city: string;
  stock: number;
}

export interface Offer {
  id: string;
  offerName: string;
  discountPercent: number;
  categoryId: string | null;
  productId: string | null;
  validFrom: string;
  validTo: string;
  description?: string;
  image?: string;
}

export interface CartItem {
  productId: string; // keep
  sku: string; // ✅ REQUIRED
  quantity: number;
  priceSnapshot: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  status: "active" | "completed";
}

export interface OrderItem {
  productId: string; // keep
  sku: string; // ✅ REQUIRED
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  orderDate: string;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  items: OrderItem[];
}

// ===== User =====
export const USER: User = {
  id: "u1",
  name: "Ravi",
  email: "ravi@example.com",
  city: "Delhi",
  orders: [],
};

// ===== Master lists =====
export const CATEGORIES: Category[] = [
  { id: "c_elec", name: "Electronics" },
  { id: "c_fash", name: "Fashion" },
  { id: "c_home", name: "Home" },
  { id: "c_beauty", name: "Beauty" },
  { id: "c_grocery", name: "Grocery" },
];

export const SUBCATEGORIES: SubCategory[] = [
  { id: "s_mobiles", categoryId: "c_elec", name: "Mobiles" },
  { id: "s_laptops", categoryId: "c_elec", name: "Laptops" },
  { id: "s_clothing", categoryId: "c_fash", name: "Clothing" },
];

// ===== PRODUCTS (with SKUs) =====
export const PRODUCTS: Product[] = [
  {
    id: "p_georgette_saree",
    sku: "SAR-GEO-BOL-WHT-001",
    subcategoryId: "s_clothing",
    name: "Georgette Saree",
    description: "Self Design Bollywood Georgette Saree",
    price: 499,
    rating: 4.3,
    image:
      "https://rukminim2.flixcart.com/image/832/832/xif0q/sari/g/q/k/free-rainbow-white-10-skycraftx-unstitched-original-imah8868z7sqhmb8.jpeg?q=70&crop=false",
  },
  {
    id: "p_jwel_set",
    sku: "JW-ALY-GLD-SET-001",
    subcategoryId: "s_clothing",
    name: "Gold Jewel Set",
    description: "Alloy Gold-plated Gold Jewel Set",
    price: 323,
    rating: 4.3,
    image:
      "https://rukminim2.flixcart.com/image/832/832/xif0q/jewellery-set/d/h/f/-original-imahexaj9m2rmkvs.jpeg?q=70&crop=false",
  },
  {
    id: "p_iphone15",
    sku: "IPH-15-128-BLK",
    subcategoryId: "s_mobiles",
    name: "iPhone 15",
    description: "Latest iPhone 15 with A17 chip",
    price: 79999,
    rating: 4.7,
    image:
      "https://rukminim2.flixcart.com/image/704/844/xif0q/mobile/h/d/9/-original-imagtc2qzgnnuhxh.jpeg?q=90&crop=false",
  },
  {
    id: "p_samsung_s23",
    sku: "SAM-S23-128-GRN",
    subcategoryId: "s_mobiles",
    name: "Samsung Galaxy S23",
    description: "Flagship Samsung device",
    price: 59999,
    rating: 4.5,
    image:
      "https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/t/0/g/-original-imah4zp7fvqp8wev.jpeg?q=70&crop=false",
  },
  {
    id: "p_dell_xps",
    sku: "DEL-XPS13-16-512-SLV",
    subcategoryId: "s_laptops",
    name: "Dell XPS 13",
    description: "Premium ultrabook",
    price: 119999,
    rating: 4.6,
    image:
      "https://rukminim2.flixcart.com/image/416/416/xif0q/computer/d/q/e/-original-imahcn9hbfhfdtwn.jpeg?q=70&crop=false",
  },
  {
    id: "p_kurta",
    sku: "KUR-MEN-CTN-ONION",
    subcategoryId: "s_clothing",
    name: "Men's Kurta Set",
    description: "Elegant cotton kurta set",
    price: 2499,
    rating: 4.3,
    image:
      "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/o/9/v/m-hdmn97-onion-hoodler-original-imahdduzxmzggfev.jpeg?q=70",
  },
];

// ===== INVENTORY (sku + city) =====
export const INVENTORY: Inventory[] = [
  // Delhi
  {
    id: "inv1",
    productId: "p_iphone15",
    sku: "IPH-15-128-BLK",
    city: "Delhi",
    stock: 20,
  },
  {
    id: "inv2",
    productId: "p_samsung_s23",
    sku: "SAM-S23-128-GRN",
    city: "Delhi",
    stock: 15,
  },
  {
    id: "inv3",
    productId: "p_dell_xps",
    sku: "DEL-XPS13-16-512-SLV",
    city: "Delhi",
    stock: 5,
  },
  {
    id: "inv4",
    productId: "p_kurta",
    sku: "KUR-MEN-CTN-ONION",
    city: "Delhi",
    stock: 50,
  },
  {
    id: "inv5",
    productId: "p_georgette_saree",
    sku: "SAR-GEO-BOL-WHT-001",
    city: "Delhi",
    stock: 24,
  },
  {
    id: "inv6",
    productId: "p_jwel_set",
    sku: "JW-ALY-GLD-SET-001",
    city: "Delhi",
    stock: 35,
  },

  // Mumbai
  {
    id: "inv7",
    productId: "p_iphone15",
    sku: "IPH-15-128-BLK",
    city: "Mumbai",
    stock: 12,
  },
  {
    id: "inv8",
    productId: "p_samsung_s23",
    sku: "SAM-S23-128-GRN",
    city: "Mumbai",
    stock: 9,
  },
  {
    id: "inv9",
    productId: "p_dell_xps",
    sku: "DEL-XPS13-16-512-SLV",
    city: "Mumbai",
    stock: 3,
  },
  {
    id: "inv10",
    productId: "p_kurta",
    sku: "KUR-MEN-CTN-ONION",
    city: "Mumbai",
    stock: 22,
  },
  {
    id: "inv11",
    productId: "p_georgette_saree",
    sku: "SAR-GEO-BOL-WHT-001",
    city: "Mumbai",
    stock: 18,
  },
  {
    id: "inv12",
    productId: "p_jwel_set",
    sku: "JW-ALY-GLD-SET-001",
    city: "Mumbai",
    stock: 28,
  },

  // Bengaluru
  {
    id: "inv13",
    productId: "p_iphone15",
    sku: "IPH-15-128-BLK",
    city: "Bengaluru",
    stock: 16,
  },
  {
    id: "inv14",
    productId: "p_samsung_s23",
    sku: "SAM-S23-128-GRN",
    city: "Bengaluru",
    stock: 11,
  },
  {
    id: "inv15",
    productId: "p_dell_xps",
    sku: "DEL-XPS13-16-512-SLV",
    city: "Bengaluru",
    stock: 4,
  },
  {
    id: "inv16",
    productId: "p_kurta",
    sku: "KUR-MEN-CTN-ONION",
    city: "Bengaluru",
    stock: 32,
  },
  {
    id: "inv17",
    productId: "p_georgette_saree",
    sku: "SAR-GEO-BOL-WHT-001",
    city: "Bengaluru",
    stock: 20,
  },
  {
    id: "inv18",
    productId: "p_jwel_set",
    sku: "JW-ALY-GLD-SET-001",
    city: "Bengaluru",
    stock: 26,
  },

  // Kolkata
  {
    id: "inv19",
    productId: "p_iphone15",
    sku: "IPH-15-128-BLK",
    city: "Kolkata",
    stock: 8,
  },
  {
    id: "inv20",
    productId: "p_samsung_s23",
    sku: "SAM-S23-128-GRN",
    city: "Kolkata",
    stock: 7,
  },
  {
    id: "inv21",
    productId: "p_dell_xps",
    sku: "DEL-XPS13-16-512-SLV",
    city: "Kolkata",
    stock: 2,
  },
  {
    id: "inv22",
    productId: "p_kurta",
    sku: "KUR-MEN-CTN-ONION",
    city: "Kolkata",
    stock: 18,
  },
  {
    id: "inv23",
    productId: "p_georgette_saree",
    sku: "SAR-GEO-BOL-WHT-001",
    city: "Kolkata",
    stock: 12,
  },
  {
    id: "inv24",
    productId: "p_jwel_set",
    sku: "JW-ALY-GLD-SET-001",
    city: "Kolkata",
    stock: 16,
  },

  // Dehradun
  {
    id: "inv25",
    productId: "p_iphone15",
    sku: "IPH-15-128-BLK",
    city: "Dehradun",
    stock: 89,
  },
  {
    id: "inv26",
    productId: "p_samsung_s23",
    sku: "SAM-S23-128-GRN",
    city: "Dehradun",
    stock: 17,
  },
  {
    id: "inv27",
    productId: "p_dell_xps",
    sku: "DEL-XPS13-16-512-SLV",
    city: "Dehradun",
    stock: 10,
  },
  {
    id: "inv28",
    productId: "p_kurta",
    sku: "KUR-MEN-CTN-ONION",
    city: "Dehradun",
    stock: 8,
  },
  {
    id: "inv29",
    productId: "p_georgette_saree",
    sku: "SAR-GEO-BOL-WHT-001",
    city: "Dehradun",
    stock: 2,
  },
  {
    id: "inv30",
    productId: "p_jwel_set",
    sku: "JW-ALY-GLD-SET-001",
    city: "Dehradun",
    stock: 16,
  },

  // Gurugram
  {
    id: "inv31",
    productId: "p_iphone15",
    sku: "IPH-15-128-BLK",
    city: "Gurugram",
    stock: 79,
  },
  {
    id: "inv32",
    productId: "p_samsung_s23",
    sku: "SAM-S23-128-GRN",
    city: "Gurugram",
    stock: 37,
  },
  {
    id: "inv33",
    productId: "p_dell_xps",
    sku: "DEL-XPS13-16-512-SLV",
    city: "Gurugram",
    stock: 18,
  },
  {
    id: "inv34",
    productId: "p_kurta",
    sku: "KUR-MEN-CTN-ONION",
    city: "Gurugram",
    stock: 34,
  },
  {
    id: "inv35",
    productId: "p_georgette_saree",
    sku: "SAR-GEO-BOL-WHT-001",
    city: "Gurugram",
    stock: 76,
  },
  {
    id: "inv36",
    productId: "p_jwel_set",
    sku: "JW-ALY-GLD-SET-001",
    city: "Gurugram",
    stock: 6,
  },

  // Noida
  {
    id: "inv37",
    productId: "p_iphone15",
    sku: "IPH-15-128-BLK",
    city: "Noida",
    stock: 109,
  },
  {
    id: "inv38",
    productId: "p_samsung_s23",
    sku: "SAM-S23-128-GRN",
    city: "Noida",
    stock: 117,
  },
  {
    id: "inv39",
    productId: "p_dell_xps",
    sku: "DEL-XPS13-16-512-SLV",
    city: "Noida",
    stock: 210,
  },
  {
    id: "inv40",
    productId: "p_kurta",
    sku: "KUR-MEN-CTN-ONION",
    city: "Noida",
    stock: 48,
  },
  {
    id: "inv41",
    productId: "p_georgette_saree",
    sku: "SAR-GEO-BOL-WHT-001",
    city: "Noida",
    stock: 29,
  },
  {
    id: "inv42",
    productId: "p_jwel_set",
    sku: "JW-ALY-GLD-SET-001",
    city: "Noida",
    stock: 161,
  },
];

// ===== OFFERS (unchanged) =====
export const OFFERS: Offer[] = [
  {
    id: "o1",
    offerName: "10% off on Electronics",
    discountPercent: 10,
    categoryId: "c_elec",
    productId: null,
    validFrom: "2025-01-01",
    validTo: "2025-12-31",
    description: "Get 10% off on all electronics products",
    image:
      "https://media.istockphoto.com/id/1174598609/photo/set-of-contemporary-house-appliances-isolated-on-white.jpg?s=612x612&w=0&k=20&c=bBMILbCpLkhIxbL7sAAXaFOaFaSXFCt80ccHgl7iiWM=",
  },
  {
    id: "o2",
    offerName: "5% off on Dell XPS",
    discountPercent: 5,
    categoryId: null,
    productId: "p_dell_xps",
    validFrom: "2025-01-01",
    validTo: "2025-12-31",
    description: "Special discount on Dell XPS 13",
    image:
      "https://www.financialexpress.com/wp-content/uploads/2016/03/Dell-XP-main.jpg?w=374",
  },
  {
    id: "o3",
    offerName: "15% off on Mobiles",
    discountPercent: 15,
    categoryId: "c_mobiles",
    productId: null,
    validFrom: "2025-02-01",
    validTo: "2025-12-31",
    description: "Enjoy 15% discount on selected mobiles",
    image:
      "https://www.gorefurbo.com/cdn/shop/collections/Refurbished_Mobile_Phones_1.jpg?v=1695978895",
  },
  {
    id: "o4",
    offerName: "20% off on Shoes",
    discountPercent: 20,
    categoryId: "c_shoes",
    productId: null,
    validFrom: "2025-03-01",
    validTo: "2025-12-31",
    description: "Step out in style with 20% off on shoes",
    image:
      "https://media.gq.com/photos/60d21a25ab6b8cc6e9d2c80a/4:3/w_4800,h_3600,c_limit/SNEAKER_GUIDE_OPENER.jpg",
  },
  {
    id: "o5",
    offerName: "Buy 1 Get 1 Free - Accessories",
    discountPercent: 50,
    categoryId: "c_accessories",
    productId: null,
    validFrom: "2025-01-15",
    validTo: "2025-12-31",
    description: "Get an extra accessory free on purchase",
    image:
      "https://www.shutterstock.com/image-vector/buy-1-get-free-tags-600nw-2449349931.jpg",
  },
  {
    id: "o6",
    offerName: "Free Shipping on Orders Above ₹399",
    discountPercent: 1,
    categoryId: "s_clothing",
    productId: null,
    validFrom: "2025-01-01",
    validTo: "2025-12-31",
    description: "Enjoy free shipping on all orders above ₹999",
    image: "https://nkcreation.net/uploads/media/2025/slider008.png",
  },
];

// ===== Sample cart/orders (with sku) =====
export const SAMPLE_CART: Cart = {
  id: "cart1",
  userId: USER.id,
  items: [
    {
      productId: "p_iphone15",
      sku: "IPH-15-128-BLK",
      quantity: 1,
      priceSnapshot: 79999,
    },
    {
      productId: "p_kurta",
      sku: "KUR-MEN-CTN-ONION",
      quantity: 2,
      priceSnapshot: 2499,
    },
  ],
  status: "active",
};

export const ORDERS: Order[] = [
  {
    id: "ord_1234",
    userId: USER.id,
    totalAmount: 71999,
    orderDate: new Date().toISOString(),
    status: "confirmed",
    items: [
      {
        productId: "p_iphone15",
        sku: "IPH-15-128-BLK",
        quantity: 1,
        price: 71999,
      },
    ],
  },
];

// ===== City helpers =====
export function getCurrentCity(): string {
  if (typeof window === "undefined") return USER.city;
  return localStorage.getItem("city") || USER.city || "Delhi";
}

/** stock by productId (back-compat) */
export function getInventoryStock(productId: string, city?: string): number {
  const c = (city || getCurrentCity()).toLowerCase();
  const rec = INVENTORY.find(
    (i) => i.productId === productId && i.city.toLowerCase() === c
  );
  return rec?.stock ?? 0;
}

/** stock by SKU (authoritative) */
export function getInventoryStockBySku(sku: string, city?: string): number {
  const c = (city || getCurrentCity()).toLowerCase();
  const rec = INVENTORY.find(
    (i) =>
      i.sku.toLowerCase() === sku.toLowerCase() && i.city.toLowerCase() === c
  );
  return rec?.stock ?? 0;
}

/** resolve product by sku (for cart/checkout rendering) */
export function getProductBySku(sku: string) {
  const norm = sku.trim().toLowerCase();
  return PRODUCTS.find((p) => p.sku.toLowerCase() === norm);
}
