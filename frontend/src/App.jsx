import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { useTranslation } from "react-i18next"; // ✅ ADD THIS

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import CategoriesPage from './pages/CategoriesPage';
import Account from './pages/Account';
import PopularProductDetail from './PopularProductDetail';
import SearchResultsPage from './pages/SearchResultsPage';

import "./i18n";

function App() {
  const { i18n } = useTranslation();

  return (
    <UserProvider>
      {/* ✅ KEY HERE */}
      <div key={i18n.language}>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/account" element={<Account />} />
            <Route path="/popular/:name" element={<PopularProductDetail />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;