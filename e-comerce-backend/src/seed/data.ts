export const categories = [
  {
    name: 'Electronics',
    description: 'Latest gadgets, devices, and tech accessories',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400',
  },
  {
    name: 'Clothing',
    description: 'Fashion apparel for men, women, and kids',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400',
  },
  {
    name: 'Home & Garden',
    description: 'Furniture, decor, and outdoor living essentials',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
  },
  {
    name: 'Sports & Outdoors',
    description: 'Athletic gear and outdoor adventure equipment',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400',
  },
  {
    name: 'Books',
    description: 'Bestsellers, textbooks, and literary classics',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
  },
  {
    name: 'Beauty & Health',
    description: 'Skincare, makeup, and wellness products',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=400',
  },
  {
    name: 'Toys & Games',
    description: 'Fun toys, board games, and educational play',
    image: 'https://images.unsplash.com/photo-1558068712-7a0f0c0e0b0a?w=400',
  },
  {
    name: 'Automotive',
    description: 'Car accessories, tools, and maintenance supplies',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400',
  },
  {
    name: 'Jewelry',
    description: 'Fine jewelry, watches, and accessories',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400',
  },
  {
    name: 'Food & Beverages',
    description: 'Gourmet foods, snacks, and specialty drinks',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
  },
];

const productTemplates: Record<string, Array<{ name: string; brand: string; basePrice: number }>> = {
  Electronics: [
    { name: 'Wireless Noise-Cancelling Headphones', brand: 'SoundMax', basePrice: 249.99 },
    { name: '4K Ultra HD Smart TV 55"', brand: 'ViewTech', basePrice: 599.99 },
    { name: 'Bluetooth Portable Speaker', brand: 'AudioWave', basePrice: 79.99 },
    { name: 'Mechanical Gaming Keyboard', brand: 'GamePro', basePrice: 129.99 },
    { name: 'Wireless Charging Pad', brand: 'ChargeFast', basePrice: 34.99 },
  ],
  Clothing: [
    { name: 'Classic Fit Cotton T-Shirt', brand: 'UrbanStyle', basePrice: 24.99 },
    { name: 'Slim Fit Denim Jeans', brand: 'DenimCo', basePrice: 59.99 },
    { name: 'Waterproof Rain Jacket', brand: 'OutdoorGear', basePrice: 89.99 },
    { name: 'Merino Wool Sweater', brand: 'ComfortKnit', basePrice: 79.99 },
    { name: 'Running Athletic Shorts', brand: 'FitLife', basePrice: 34.99 },
  ],
  'Home & Garden': [
    { name: 'Modern LED Floor Lamp', brand: 'BrightHome', basePrice: 119.99 },
    { name: 'Memory Foam Pillow Set', brand: 'SleepWell', basePrice: 49.99 },
    { name: 'Stainless Steel Cookware Set', brand: 'ChefMaster', basePrice: 199.99 },
    { name: 'Indoor Plant Collection', brand: 'GreenThumb', basePrice: 39.99 },
    { name: 'Smart Thermostat', brand: 'ClimateControl', basePrice: 149.99 },
  ],
  'Sports & Outdoors': [
    { name: 'Professional Yoga Mat', brand: 'ZenFit', basePrice: 44.99 },
    { name: 'Carbon Fiber Tennis Racket', brand: 'AceSport', basePrice: 189.99 },
    { name: 'Camping Tent 4-Person', brand: 'TrailBlazer', basePrice: 159.99 },
    { name: 'Adjustable Dumbbell Set', brand: 'IronFit', basePrice: 299.99 },
    { name: 'Insulated Water Bottle', brand: 'HydroFlow', basePrice: 29.99 },
  ],
  Books: [
    { name: 'The Art of Programming', brand: 'TechPress', basePrice: 39.99 },
    { name: 'Mindful Living Guide', brand: 'WellnessPub', basePrice: 19.99 },
    { name: 'World History Encyclopedia', brand: 'KnowledgeBase', basePrice: 49.99 },
    { name: 'Creative Photography Masterclass', brand: 'VisualArts', basePrice: 34.99 },
    { name: 'Business Strategy Handbook', brand: 'BizBooks', basePrice: 29.99 },
  ],
  'Beauty & Health': [
    { name: 'Vitamin C Serum', brand: 'GlowSkin', basePrice: 32.99 },
    { name: 'Electric Toothbrush Pro', brand: 'DentalCare', basePrice: 89.99 },
    { name: 'Organic Face Moisturizer', brand: 'PureNature', basePrice: 27.99 },
    { name: 'Professional Hair Dryer', brand: 'StylePro', basePrice: 69.99 },
    { name: 'Essential Oil Diffuser', brand: 'AromaZen', basePrice: 39.99 },
  ],
  'Toys & Games': [
    { name: 'Building Blocks Set 500pc', brand: 'BlockMaster', basePrice: 49.99 },
    { name: 'Strategy Board Game', brand: 'GameNight', basePrice: 34.99 },
    { name: 'Remote Control Drone', brand: 'SkyFly', basePrice: 79.99 },
    { name: 'Educational Robot Kit', brand: 'TechKids', basePrice: 99.99 },
    { name: 'Plush Teddy Bear', brand: 'CuddleCo', basePrice: 24.99 },
  ],
  Automotive: [
    { name: 'Dash Cam HD Pro', brand: 'RoadSafe', basePrice: 129.99 },
    { name: 'Car Vacuum Cleaner', brand: 'AutoClean', basePrice: 49.99 },
    { name: 'Premium Floor Mats Set', brand: 'CarGuard', basePrice: 59.99 },
    { name: 'Jump Starter Power Bank', brand: 'PowerStart', basePrice: 89.99 },
    { name: 'Phone Mount Dashboard', brand: 'DriveTech', basePrice: 19.99 },
  ],
  Jewelry: [
    { name: 'Sterling Silver Necklace', brand: 'SilverCraft', basePrice: 79.99 },
    { name: 'Classic Gold Watch', brand: 'TimeLux', basePrice: 299.99 },
    { name: 'Diamond Stud Earrings', brand: 'GemStone', basePrice: 199.99 },
    { name: 'Leather Bracelet Set', brand: 'WristStyle', basePrice: 39.99 },
    { name: 'Pearl Pendant Necklace', brand: 'OceanGem', basePrice: 149.99 },
  ],
  'Food & Beverages': [
    { name: 'Premium Coffee Bean Blend', brand: 'RoastMaster', basePrice: 18.99 },
    { name: 'Organic Green Tea Collection', brand: 'TeaLeaf', basePrice: 14.99 },
    { name: 'Artisan Dark Chocolate Box', brand: 'ChocoDelight', basePrice: 24.99 },
    { name: 'Extra Virgin Olive Oil', brand: 'Mediterranean', basePrice: 22.99 },
    { name: 'Gourmet Spice Set', brand: 'FlavorWorld', basePrice: 29.99 },
  ],
};

export const generateProducts = (categoryMap: Record<string, string>): Array<Record<string, unknown>> => {
  const products: Array<Record<string, unknown>> = [];
  let skuIndex = 1;

  for (const [categoryName, items] of Object.entries(productTemplates)) {
    const categoryId = categoryMap[categoryName];
    items.forEach((item, idx) => {
      const priceVariation = (Math.random() * 20 - 10) / 100;
      const price = Math.round(item.basePrice * (1 + priceVariation) * 100) / 100;
      products.push({
        name: item.name,
        description: `Premium quality ${item.name.toLowerCase()} from ${item.brand}. Designed for durability and performance. Perfect for everyday use with exceptional value. Features industry-leading craftsmanship and customer satisfaction guarantee.`,
        price,
        comparePrice: Math.round(price * 1.2 * 100) / 100,
        images: [
          `https://picsum.photos/seed/${categoryName.replace(/\s/g, '')}${idx}/600/600`,
          `https://picsum.photos/seed/${categoryName.replace(/\s/g, '')}${idx}b/600/600`,
        ],
        category: categoryId,
        brand: item.brand,
        stock: Math.floor(Math.random() * 100) + 10,
        sku: `SKU-${String(skuIndex++).padStart(4, '0')}`,
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        numReviews: Math.floor(Math.random() * 50) + 5,
        isFeatured: idx === 0,
        isActive: true,
      });
    });
  }

  return products;
};

export const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin@123',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=admin',
  },
  {
    name: 'John Customer',
    email: 'customer@example.com',
    password: 'Customer@123',
    role: 'customer',
    avatar: 'https://i.pravatar.cc/150?u=customer1',
  },
  {
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    password: 'Customer@123',
    role: 'customer',
    avatar: 'https://i.pravatar.cc/150?u=customer2',
  },
  {
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    password: 'Customer@123',
    role: 'customer',
    avatar: 'https://i.pravatar.cc/150?u=customer3',
  },
  {
    name: 'Sarah Williams',
    email: 'sarah.williams@example.com',
    password: 'Customer@123',
    role: 'customer',
    avatar: 'https://i.pravatar.cc/150?u=customer4',
  },
  {
    name: 'David Brown',
    email: 'david.brown@example.com',
    password: 'Customer@123',
    role: 'customer',
    avatar: 'https://i.pravatar.cc/150?u=customer5',
  },
];
