import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Vote from "./pages/Vote";
import Result from "./pages/Result";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Check token validity on app load
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp < Date.now() / 1000) {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          setToken(null);
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        setToken(null);
      }
    }
  }, [token]);

  // Listen for storage changes to update token state
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events from the same tab
    window.addEventListener('tokenUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenUpdated', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/vote" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vote" element={token ? <Vote /> : <Navigate to="/login" />} />
        <Route path="/results" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;
