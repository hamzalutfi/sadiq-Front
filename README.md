# Sadiq Store - Full Stack E-commerce Application

A modern e-commerce application built with Next.js 15, TypeScript, and Tailwind CSS, now fully integrated with a backend API.

## 🚀 Features

- **Full Stack Integration**: Connected to a comprehensive backend API
- **Authentication**: Complete auth system with JWT tokens
- **Product Management**: CRUD operations for products and categories
- **Shopping Cart**: Real-time cart management with API persistence
- **Order Management**: Complete order lifecycle management
- **Admin Dashboard**: Comprehensive admin panel with analytics
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Type Safety**: Full TypeScript support throughout the application

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Backend API running on `http://localhost:5000` (or configure via environment variables)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sadiq-store
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 API Integration

The application is now fully integrated with a backend API that provides the following endpoints:

### Authentication Endpoints
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user
- `GET /api/v1/auth/verify-email/:token` - Verify email
- `POST /api/v1/auth/forgot-password` - Forgot password
- `PUT /api/v1/auth/reset-password/:token` - Reset password
- `PUT /api/v1/auth/update-password` - Update password

### User Management
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `PUT /api/v1/users/email` - Update email
- `DELETE /api/v1/users/account` - Delete account
- `PUT /api/v1/users/profile-image` - Upload profile image

### Products
- `GET /api/v1/products` - Get all products
- `POST /api/v1/products` - Create product
- `GET /api/v1/products/:id` - Get product by ID
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product
- `GET /api/v1/products/category/:slug` - Get products by category
- `POST /api/v1/products/:id/reviews` - Add product review

### Categories
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category
- `GET /api/v1/categories/:id` - Get category by ID
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Cart Management
- `GET /api/v1/cart` - Get user cart
- `DELETE /api/v1/cart` - Clear cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/:productId` - Update cart item
- `DELETE /api/v1/cart/items/:productId` - Remove from cart
- `POST /api/v1/cart/coupon` - Apply coupon
- `DELETE /api/v1/cart/coupon` - Remove coupon

### Orders
- `GET /api/v1/orders` - Get user orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/:id` - Get order by ID
- `PUT /api/v1/orders/:id/cancel` - Cancel order
- `POST /api/v1/orders/:id/refund` - Request refund

### Offers
- `GET /api/v1/offers/active` - Get active offers
- `GET /api/v1/offers` - Get all offers
- `POST /api/v1/offers` - Create offer
- `GET /api/v1/offers/:id` - Get offer by ID
- `PUT /api/v1/offers/:id` - Update offer
- `DELETE /api/v1/offers/:id` - Delete offer

### Analytics
- `GET /api/v1/analytics/revenue` - Revenue analytics
- `GET /api/v1/analytics/products` - Product analytics
- `GET /api/v1/analytics/customers` - Customer analytics
- `GET /api/v1/analytics/conversion` - Conversion analytics

### Admin Endpoints
- `GET /api/v1/admin/users` - Get all users
- `PUT /api/v1/admin/users/:id` - Update user
- `GET /api/v1/admin/orders` - Get all orders
- `PUT /api/v1/admin/orders/:id/status` - Update order status
- `POST /api/v1/admin/orders/:id/refund` - Process refund
- `GET /api/v1/admin/dashboard` - Dashboard stats
- `GET /api/v1/admin/reports/sales` - Sales report

## 🏗️ Project Structure

```
sadiq-store/
├── app/                    # Next.js 13+ app directory
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin dashboard
│   ├── account/           # User account pages
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── product/           # Product pages
│   └── store/             # Store pages
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── auth/             # Authentication components
│   └── store/            # Store-specific components
├── contexts/             # React contexts
│   ├── auth-context.tsx  # Authentication context
│   ├── cart-context.tsx  # Shopping cart context
│   ├── products-context.tsx # Products context
│   ├── orders-context.tsx # Orders context
│   └── admin-context.tsx # Admin context
├── lib/                  # Utility libraries
│   ├── api.ts           # API service layer
│   ├── config.ts        # Configuration
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## 🔐 Authentication Flow

1. **Registration**: Users can register with email, password, and phone number
2. **Login**: JWT-based authentication with token storage
3. **Token Management**: Automatic token refresh and validation
4. **Protected Routes**: Role-based access control for admin features

## 🛒 Shopping Cart

- **Real-time Updates**: Cart updates are synchronized with the backend
- **Persistent Storage**: Cart data persists across sessions
- **Coupon Support**: Apply and remove discount coupons
- **Quantity Management**: Update product quantities in real-time

## 📊 Admin Features

- **Dashboard**: Overview of sales, orders, and user statistics
- **User Management**: View and manage user accounts
- **Order Management**: Process orders and handle refunds
- **Analytics**: Comprehensive business analytics
- **Product Management**: Full CRUD operations for products

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Built-in dark mode support
- **Custom Components**: Reusable UI components

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Set environment variables for your production API

## 🔧 Configuration

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:5000/api/v1)
- `NODE_ENV`: Environment (development/production)

### API Configuration
The API service is configured in `lib/config.ts` with:
- Base URL configuration
- Request timeout settings
- Feature flags
- Upload limits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

## 🔄 Migration from Local Storage

If you're migrating from the previous local storage version:

1. **Update Context Usage**: All contexts now use API calls instead of local storage
2. **Authentication**: Users will need to register/login again
3. **Cart Data**: Cart will be empty initially and sync with backend
4. **Orders**: Order history will be loaded from the backend

The application now provides a complete full-stack e-commerce solution with real-time data synchronization and comprehensive admin capabilities. 