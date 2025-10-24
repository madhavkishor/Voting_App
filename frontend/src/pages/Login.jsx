import { useState } from "react";
import { motion } from "framer-motion";
import { loginUser } from "../api/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Vote, User, AlertCircle } from "lucide-react";

export default function Login() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError("Name is required");

    setLoading(true);
    setError("");

    try {
      const res = await loginUser(name.trim());
      
      if (res && res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userName", name.trim());
        
        // Dispatch custom event to notify App component of token change
        window.dispatchEvent(new Event('tokenUpdated'));
        
        navigate("/vote");
      } else {
        setError(res?.msg || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center p-4 sm:p-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-card border shadow-2xl rounded-2xl p-6 sm:p-8">
          <div className="text-center mb-8">
            <motion.div
              className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <Vote className="w-8 h-8 text-primary" />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Welcome to VoteApp
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Enter your name to start voting
            </p>
          </div>

          {error && (
            <motion.div
              className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-destructive text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !name.trim()}
            >
              {loading ? (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </motion.div>
              ) : (
                "Sign In & Start Voting"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By signing in, you agree to participate in the voting process
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
