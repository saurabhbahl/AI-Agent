# E-Commerce REST API Documentation

Base URL: `http://localhost:5000/api`

All responses follow this format:

```json
{
  "success": true,
  "message": "Optional message",
  "data": {},
  "pagination": { "page": 1, "limit": 12, "total": 50, "totalPages": 5 },
  "errors": ["validation errors"]
}
```

## Authentication

JWT access tokens are sent via `Authorization: Bearer <token>` header.
Refresh tokens are stored in httpOnly cookies at `/api/auth/refresh`.

### POST /auth/register

Register a new customer account.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### POST /auth/login

Login and receive access token.

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

### POST /auth/refresh

Refresh access token using refresh token cookie.

### POST /auth/logout

Logout (requires auth).

### GET /auth/profile

Get current user profile (requires auth).

### PUT /auth/profile

Update profile (requires auth).

**Body:**
```json
{
  "name": "Updated Name",
  "phone": "+1234567890"
}
```

### PUT /auth/password

Change password (requires auth).

---

## Products

### GET /products

List products with filtering and pagination.

**Query params:** `page`, `limit`, `sort`, `order`, `category`, `search`, `minPrice`, `maxPrice`, `featured`

### GET /products/:id

Get product by ID.

### GET /products/slug/:slug

Get product by slug.

### GET /products/:productId/reviews

Get product reviews.

---

## Categories

### GET /categories

List active categories.

### GET /categories/:id

Get category by ID.

### GET /categories/slug/:slug

Get category by slug.

---

## Cart (Auth Required)

### GET /cart

Get user's cart.

### POST /cart

Add item to cart.

**Body:**
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

### PUT /cart/:productId

Update cart item quantity.

### DELETE /cart/:productId

Remove item from cart.

### DELETE /cart

Clear cart.

---

## Wishlist (Auth Required)

### GET /wishlist

Get user's wishlist.

### POST /wishlist

Add product to wishlist.

**Body:**
```json
{
  "productId": "product_id"
}
```

### DELETE /wishlist/:productId

Remove from wishlist.

---

## Orders (Auth Required)

### POST /orders

Create order (mock checkout).

**Body:**
```json
{
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "card"
}
```

### GET /orders/my

Get user's order history.

### GET /orders/:orderId

Get order details.

---

## Reviews (Auth Required for POST)

### POST /products/:productId/reviews

Create a review.

**Body:**
```json
{
  "rating": 5,
  "title": "Great product",
  "comment": "Highly recommend this product."
}
```

### DELETE /reviews/:id

Delete a review.

---

## Admin Endpoints (Admin Auth Required)

### GET /admin/dashboard

Dashboard statistics and sales data.

### Users

- `GET /admin/users` - List users
- `PUT /admin/users/:userId` - Update user
- `DELETE /admin/users/:userId` - Delete user

### Products

- `GET /admin/products` - List all products
- `POST /admin/products` - Create product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product
- `PATCH /admin/products/:id/inventory` - Update stock
- `GET /admin/products/inventory/low-stock` - Low stock alerts

### Categories

- `GET /admin/categories` - List all categories
- `POST /admin/categories` - Create category
- `PUT /admin/categories/:id` - Update category
- `DELETE /admin/categories/:id` - Delete category

### Orders

- `GET /admin/orders` - List all orders
- `PUT /admin/orders/:orderId/status` - Update order status

**Body:**
```json
{
  "status": "shipped"
}
```

Status values: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

---

## Health Check

### GET /health

Returns API status.

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request / Validation Error |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Rate Limited |
| 500 | Internal Server Error |
