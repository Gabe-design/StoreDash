// react-vite/src/router/index.jsx

import { createBrowserRouter } from 'react-router-dom';
import Layout from './Layout';
// Added this for the sidebar layout on all dashboard pages
import DashboardLayout from './DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

// These are the authentication
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import LandingPage from '../components/LandingPage/LandingPage';

// These are the dashboard pages
import DashboardHome from '../components/Dashboard/DashboardHome';
import StoreSettings from '../components/StoreSettings/StoreSettings';
import ProductList from '../components/ProductList/ProductList';
import ProductForm from '../components/ProductForm/ProductForm';
import OrderList from '../components/OrderList/OrderList';
import OrderDetails from '../components/OrderDetails/OrderDetail';
import ReviewList from '../components/ReviewList/ReviewList';

// These are the public storefront pages
import PublicStore from '../components/PublicStore/PublicStore';
import PublicProduct from '../components/PublicProduct/PublicProduct';
import PublicOrderForm from '../components/PublicOrderForm/PublicOrderForm';
import PublicReviewList from '../components/PublicReviewList/PublicReviewList';
import PublicReviewForm from '../components/PublicReviewForm/PublicReviewForm';



export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Public Routes
      { path: "/", element: <LandingPage /> },
      { path: "login", element: <LoginFormPage /> },
      { path: "signup", element: <SignupFormPage /> },

      // Public Storefront
      { path: "store/:storeName", element: <PublicStore /> },
      {
        path: "store/:storeName/product/:productId",
        element: <PublicProduct />,
        children: [
          { path: "reviews", element: <PublicReviewList /> },
          { path: "reviews/new", element: <PublicReviewForm /> },
          { path: "reviews/:reviewId/edit", element: <PublicReviewForm /> },
          { path: "reviews/:reviewId/delete", element: <PublicReviewForm /> },
        ],
      },
      { path: "store/:storeName/order", element: <PublicOrderForm /> },

      // Protected Dashboard Routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: "dashboard", element: <DashboardHome /> },
              { path: "dashboard/store", element: <StoreSettings /> },
              { path: "dashboard/products", element: <ProductList /> },
              { path: "dashboard/products/new", element: <ProductForm /> },
              { path: "dashboard/products/:productId/edit", element: <ProductForm /> },
              { path: "dashboard/orders", element: <OrderList /> },
              { path: "dashboard/orders/:orderId", element: <OrderDetails /> },
              { path: "dashboard/products/:productId/reviews", element: <ReviewList /> },
            ],
          },
        ],
      },
    ],
  },
]);