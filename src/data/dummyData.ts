// User
export interface User {
  id: string;
  name: string;
  email: string;
  city: string;
  orders: Order[]; // Example order IDs
}

// Category / SubCategory
export interface Category {
  id: string;
  name: string;
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
}

// Product
export interface Product {
  id: string;
  subcategoryId: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  rating: number;
}

// Inventory
export interface Inventory {
  id: string;
  productId: string;
  city: string;
  stock: number;
}

// Offer
export interface Offer {
  id: string;
  offerName: string;
  discountPercent: number;
  categoryId: string | null;
  productId: string | null;
  validFrom: string;
  validTo: string;
  description?: string; // Optional description for the offer
  image?: string; // Optional images for the offer
}

// Cart + Orders
export interface CartItem {
  productId: string;
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
  productId: string;
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

// Dummy Data
export const USER: User = {
  id: "u1",
  name: "Ravi",
  email: "ravi@example.com",
  city: "Delhi",
  orders: [], // Example order IDs
};

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

export const PRODUCTS: Product[] = [
  {
    id: "p_georgette_saree",
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
    subcategoryId: "s_mobiles",
    name: "iPhone 15",
    description: "Latest iPhone 15 with A17 chip",
    price: 79999,
    image:
      "https://rukminim2.flixcart.com/image/704/844/xif0q/mobile/h/d/9/-original-imagtc2qzgnnuhxh.jpeg?q=90&crop=false",
    rating: 4.7,
  },
  {
    id: "p_samsung_s23",
    subcategoryId: "s_mobiles",
    name: "Samsung Galaxy S23",
    description: "Flagship Samsung device",
    price: 59999,
    image:
      "https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/t/0/g/-original-imah4zp7fvqp8wev.jpeg?q=70&crop=false",
    rating: 4.5,
  },
  {
    id: "p_dell_xps",
    subcategoryId: "s_laptops",
    name: "Dell XPS 13",
    description: "Premium ultrabook",
    price: 119999,
    image:
      "https://rukminim2.flixcart.com/image/416/416/xif0q/computer/d/q/e/-original-imahcn9hbfhfdtwn.jpeg?q=70&crop=false",
    rating: 4.6,
  },
  {
    id: "p_kurta",
    subcategoryId: "s_clothing",
    name: "Men's Kurta Set",
    description: "Elegant cotton kurta set",
    price: 2499,
    image:
      "https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/o/9/v/m-hdmn97-onion-hoodler-original-imahdduzxmzggfev.jpeg?q=70",
    rating: 4.3,
  },
];

export const INVENTORY: Inventory[] = [
  { id: "inv1", productId: "p_iphone15", city: "Delhi", stock: 20 },
  { id: "inv2", productId: "p_samsung_s23", city: "Delhi", stock: 15 },
  { id: "inv3", productId: "p_dell_xps", city: "Delhi", stock: 5 },
  { id: "inv4", productId: "p_kurta", city: "Delhi", stock: 50 },
];

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
    offerName: "Free Shipping on Orders Above ₹999",
    discountPercent: 0,
    categoryId: null,
    productId: null,
    validFrom: "2025-01-01",
    validTo: "2025-12-31",
    description: "Enjoy free shipping on all orders above ₹999",
    image: "https://nkcreation.net/uploads/media/2025/slider008.png",
  },
];

export const SAMPLE_CART: Cart = {
  id: "cart1",
  userId: USER.id,
  items: [
    { productId: "p_iphone15", quantity: 1, priceSnapshot: 79999 },
    { productId: "p_kurta", quantity: 2, priceSnapshot: 2499 },
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
    items: [{ productId: "p_iphone15", quantity: 1, price: 71999 }],
  },
];
