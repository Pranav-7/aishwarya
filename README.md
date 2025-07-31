# Aishwarya Luxury Jewelery

A professional React-based gold jewelry marketplace with Firebase integration, featuring user authentication, product catalog, shopping cart functionality, and admin panel.

## Features

### 🛍️ Customer Features
- **Product Catalog**: Browse through a beautiful collection of gold jewelry items
- **Search & Filter**: Search products by name/description and filter by category
- **Shopping Cart**: Add items to cart, manage quantities, and view order summary
- **User Authentication**: Secure signup/login with Firebase Authentication
- **Order Submission**: Submit orders that are saved to Firestore for admin review

### 👨‍💼 Admin Features
- **Admin Panel**: Manage products and view customer orders
- **Product Management**: Add new products with detailed information
- **Order Tracking**: View all customer orders with status tracking
- **Real-time Updates**: Orders are saved to Firestore in real-time

## Tech Stack

- **Frontend**: React 18 with React Router for navigation
- **UI Framework**: Material-UI (MUI) with custom gold theme
- **Backend**: Firebase (Authentication & Firestore)
- **State Management**: React Context API
- **Styling**: Material-UI components with custom theme

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Get your Firebase configuration from Project Settings
5. Update `src/firebase/config.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 3. Firestore Security Rules

Set up Firestore security rules to allow read/write access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /orders/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.js       # Navigation bar with cart badge
│   └── ProductCard.js  # Product display card
├── contexts/           # React Context providers
│   ├── AuthContext.js  # Authentication state management
│   └── CartContext.js  # Shopping cart state management
├── firebase/           # Firebase configuration
│   └── config.js       # Firebase setup
├── pages/              # Main application pages
│   ├── Home.js         # Product catalog page
│   ├── Cart.js         # Shopping cart page
│   ├── Login.js        # User login page
│   ├── Signup.js       # User registration page
│   └── AdminPanel.js   # Admin dashboard
├── App.js              # Main app component with routing
└── index.js            # App entry point
```

## Key Features Explained

### Authentication System
- Firebase Authentication with email/password
- Protected routes and user state management
- Automatic login state persistence

### Shopping Cart
- Local storage persistence
- Add/remove items with quantity management
- Real-time cart total calculation
- Order submission to Firestore

### Admin Panel
- Product management with add/edit functionality
- Order tracking with customer details
- Real-time order status updates
- Comprehensive order history

### Product Catalog
- Responsive grid layout
- Search and category filtering
- Product cards with ratings and details
- Add to cart functionality

## Customization

### Theme Customization
The app uses a custom Material-UI theme with gold accents. You can modify the theme in `src/App.js`:

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#D4AF37', // Gold color
    },
    secondary: {
      main: '#B8860B', // Darker gold
    },
  },
  // ... other theme options
});
```

### Adding New Product Categories
To add new product categories, update the category options in:
- `src/pages/Home.js` (filter dropdown)
- `src/pages/AdminPanel.js` (add product form)

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## Security Considerations

- Firebase Authentication provides secure user management
- Firestore security rules protect data access
- Input validation on forms
- Error handling for all async operations

## Future Enhancements

- Payment integration (Stripe/PayPal)
- Image upload functionality
- Advanced product filtering
- User reviews and ratings
- Email notifications
- Inventory management
- Analytics dashboard

## Support

For issues or questions, please check the Firebase documentation or create an issue in the repository.

---

**Note**: Make sure to replace the Firebase configuration with your actual project credentials before deploying to production. 