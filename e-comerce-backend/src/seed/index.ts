import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { User } from '../models/User.model';
import { Category } from '../models/Category.model';
import { Product } from '../models/Product.model';
import { Order } from '../models/Order.model';
import { Cart } from '../models/Cart.model';
import { Wishlist } from '../models/Wishlist.model';
import { Review } from '../models/Review.model';
import { categories, generateProducts, users } from './data';
import { OrderStatus } from '../types';

const destroyData = async () => {
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    Cart.deleteMany({}),
    Wishlist.deleteMany({}),
    Review.deleteMany({}),
  ]);
  console.log('All data destroyed');
};

const importData = async () => {
  await destroyData();

  const createdUsers = await User.create(users);
  console.log(`${createdUsers.length} users created`);

  const createdCategories = await Category.create(categories);
  console.log(`${createdCategories.length} categories created`);

  const categoryMap: Record<string, string> = {};
  createdCategories.forEach((cat) => {
    categoryMap[cat.name] = cat._id.toString();
  });

  const productData = generateProducts(categoryMap);
  const createdProducts = await Product.create(productData);
  console.log(`${createdProducts.length} products created`);

  const customer = createdUsers.find((u) => u.email === 'customer@example.com');
  if (customer) {
    await Cart.create({
      user: customer._id,
      items: [
        {
          product: createdProducts[0]._id,
          quantity: 2,
          price: createdProducts[0].price,
        },
        {
          product: createdProducts[5]._id,
          quantity: 1,
          price: createdProducts[5].price,
        },
      ],
    });

    await Wishlist.create({
      user: customer._id,
      products: [createdProducts[2]._id, createdProducts[10]._id, createdProducts[20]._id],
    });

    await Review.create([
      {
        user: customer._id,
        product: createdProducts[0]._id,
        rating: 5,
        title: 'Excellent product!',
        comment: 'This product exceeded my expectations. Great quality and fast delivery.',
      },
      {
        user: customer._id,
        product: createdProducts[5]._id,
        rating: 4,
        title: 'Very good value',
        comment: 'Good quality for the price. Would recommend to others.',
      },
    ]);

    const orderItems = [
      {
        product: createdProducts[0]._id,
        name: createdProducts[0].name,
        image: createdProducts[0].images[0],
        price: createdProducts[0].price,
        quantity: 1,
      },
    ];
    const itemsPrice = orderItems[0].price;
    const taxPrice = Math.round(itemsPrice * 0.08 * 100) / 100;
    const shippingPrice = 9.99;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    await Order.create({
      user: customer._id,
      orderItems,
      shippingAddress: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      paymentMethod: 'card',
      paymentResult: {
        id: 'mock_seed_order_1',
        status: 'completed',
        updateTime: new Date().toISOString(),
        emailAddress: customer.email,
      },
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: true,
      paidAt: new Date(),
      status: OrderStatus.DELIVERED,
      isDelivered: true,
      deliveredAt: new Date(),
    });
  }

  console.log('Sample cart, wishlist, reviews, and orders created');
  console.log('\n--- Seed Credentials ---');
  console.log('Admin: admin@example.com / Admin@123');
  console.log('Customer: customer@example.com / Customer@123');
};

const run = async () => {
  try {
    await connectDB();
    if (process.argv.includes('--destroy')) {
      await destroyData();
    } else {
      await importData();
    }
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

run();
