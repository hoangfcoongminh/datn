import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";

// Import components
import LoginPage from "./components/auth/LoginPage";
import SignupPage from "./components/auth/SignupPage";
import HomePage from "./components/home/HomePage";
import RecipeList from "./components/recipes/RecipeList";
import RecipeDetail from "./components/recipes/RecipeDetail";
import NotFound from "./components/common/NotFound";
import Loading from "./components/common/Loading";
import { Header, Footer } from "./components/common";
import { logout as apiLogout } from "./api/auth";
import { AddRecipePage, EditRecipePage } from "./components/recipes";
import { AddCategoryPage, CategoryPage } from "./components/categories";
import IngredientList from "./components/ingredients/IngredientList";
import { ToastContainer } from "react-toastify";

// Wrapper component to use useNavigate hook
function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (username, data) => {
    const userData = { username, ...data };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    navigate("/home");
  };

  const handleSignup = (username, data) => {
    const userData = { username, ...data };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    navigate("/home");
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {}
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/home");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  if (loading) {
    return <Loading />;
  }

  const handleHeaderNavigate = (key) => {
    if (key === "home" || key === "") navigate("/home");
    else if (key === "category") navigate("/categories");
    else if (key === "ingredient") navigate("/ingredients");
    else if (key === "recipe") navigate("/recipes");
  };

  const handleAccount = () => {
    // Chuyển sang trang quản lý tài khoản (chưa có)
    navigate("/account");
  };

  return (
    <>
      <Header
        user={user}
        onLogout={handleLogout}
        onAccount={handleAccount}
        onNavigate={handleHeaderNavigate}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route
          path="/home"
          element={
            <HomePage
              user={user}
              onLoginClick={handleLoginClick}
              onSignupClick={handleSignupClick}
              onLogout={handleLogout}
            />
          }
        />
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/home" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/home" replace />
            ) : (
              <SignupPage onSignup={handleSignup} />
            )
          }
        />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/categories/add" element={<AddCategoryPage />} />
        <Route path="/ingredients" element={<IngredientList />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/recipes/add" element={<AddRecipePage />} />
        <Route path="/recipes/edit/:id" element={<EditRecipePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
      <ToastContainer
        position="top-right"
        draggable
        pauseOnFocusLoss
        autoClose={3000}
        hideProgressBar
        newestOnTop
        pauseOnHover
      />
    </>
  );
}

export default App;
