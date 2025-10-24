import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getVoteResults, castVote, connectSocket, disconnectSocket, getVotes } from "../api/api";
import VoteChart from "../components/VoteChart";
import VoteNotification from "../components/VoteNotification";
import UserProfile from "../components/UserProfile";
import { 
  Vote as VoteIcon, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  PieChart,
  LogOut,
  User,
  ExternalLink
} from "lucide-react";

const VOTE_OPTIONS = [
  { id: "option-a", label: "Option A", color: "#8884d8", icon: "🚩" },
  { id: "option-b", label: "Option B", color: "#82ca9d", icon: "🚩" },
  { id: "option-c", label: "Option C", color: "#ffc658", icon: "🚩" }
];

export default function Vote() {
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [chartType, setChartType] = useState("bar");
  const [notifications, setNotifications] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [userVoteHistory, setUserVoteHistory] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName");
  const navigate = useNavigate();

  const fetchResults = async () => {
    try {
      const data = await getVoteResults();
      setResults(data);
      
      // Check if current user has voted by getting all votes
      const allVotes = await getVotes(token);
      const userVoted = allVotes.some(vote => vote.name === userName);
      setHasVoted(userVoted);
      
      // Set user vote history for profile
      const userVoteHistory = allVotes
        .filter(vote => vote.name === userName)
        .map(vote => ({
          option: vote.option,
          timestamp: vote.createdAt || new Date()
        }));
      setUserVoteHistory(userVoteHistory);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  useEffect(() => {
    fetchResults();
    
    // Connect to WebSocket
    const socket = connectSocket();
    
    socket.on('connect', () => {
      setIsConnected(true);
    });
    
    socket.on('disconnect', () => {
      setIsConnected(false);
    });
    
    socket.on('voteUpdate', (data) => {
      setResults(data);
    });
    
    socket.on('newVote', (voteData) => {
      const notification = {
        id: Date.now() + Math.random(),
        ...voteData,
        autoRemove: true
      };
      setNotifications(prev => [...prev, notification]);
    });

    return () => {
      disconnectSocket();
      setIsConnected(false);
    };
  }, []);

  const handleVote = async (selectedOption) => {
    if (hasVoted) return;
    
    setLoading(true);
    setMessage("");

    try {
      const res = await castVote(token, selectedOption);
      if (res.msg) {
        setMessage(res.msg);
        setHasVoted(true);
        
        // Update user vote history
        const newVote = {
          option: selectedOption,
          timestamp: new Date()
        };
        setUserVoteHistory(prev => [newVote, ...prev]);
        
        // Show success notification
        const successNotification = {
          id: Date.now(),
          voter: userName,
          option: selectedOption,
          timestamp: new Date(),
          autoRemove: true
        };
        setNotifications(prev => [...prev, successNotification]);
      } else {
        setMessage(res.msg || "Vote failed");
      }
    } catch (error) {
      setMessage("Error casting vote. Please try again.");
      console.error("Vote error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    disconnectSocket();
    
    // Dispatch custom event to notify App component of token change
    window.dispatchEvent(new Event('tokenUpdated'));
    
    window.location.href = "/login";
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const totalVotes = results.reduce((sum, result) => sum + result.count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <motion.header 
        className="bg-card/50 backdrop-blur-sm border-b sticky top-0 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <VoteIcon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">VoteApp</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Real-time Voting</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>{totalVotes} total votes</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/results")}
                className="px-2 sm:px-3"
              >
                <TrendingUp className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Results</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProfile(!showProfile)}
                className="px-2 sm:px-3"
              >
                <User className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Profile</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="px-2 sm:px-3"
              >
                <LogOut className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
          
          {/* Mobile vote count display */}
          <div className="md:hidden mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{totalVotes} total votes</span>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Voting Section */}
          <motion.div
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Cast Your Vote
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Choose your preferred option below
                </p>
              </div>

              {message && (
                <motion.div
                  className={`flex items-center gap-2 p-3 rounded-lg mb-4 ${
                    message.includes("successfully") 
                      ? "bg-green-50 border border-green-200 text-green-800" 
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.includes("successfully") ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  <span className="text-sm">{message}</span>
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {VOTE_OPTIONS.map((option, index) => (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Button
                      onClick={() => handleVote(option.label)}
                      disabled={loading || hasVoted}
                      className="w-full h-20 sm:h-24 flex flex-col items-center justify-center gap-1 sm:gap-2 relative overflow-hidden group"
                      style={{ 
                        backgroundColor: hasVoted ? '#e5e7eb' : option.color,
                        color: hasVoted ? '#6b7280' : 'white'
                      }}
                    >
                      <motion.div
                        className="text-2xl"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {option.icon}
                      </motion.div>
                      <span className="font-semibold">{option.label}</span>
                      
                      {hasVoted && (
                        <motion.div
                          className="absolute inset-0 bg-white/20 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <CheckCircle className="w-6 h-6" />
                        </motion.div>
                      )}
                    </Button>
                  </motion.div>
                ))}
              </div>

              {hasVoted && (
                <motion.div
                  className="text-center mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-green-800 font-medium">
                    Thank you for voting!
                  </p>
                  <p className="text-green-600 text-sm mb-4">
                    Your vote has been recorded successfully.
                  </p>
                  <Button
                    onClick={() => navigate("/results")}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Live Results
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Results Chart */}
            <VoteChart 
              data={results} 
              chartType={chartType} 
              onChartTypeChange={setChartType}
              isLive={isConnected}
            />
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-4 lg:space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {showProfile && (
              <UserProfile
                user={{ name: userName }}
                onLogout={handleLogout}
                voteHistory={userVoteHistory}
              />
            )}

            {/* Live Stats */}
            <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Live Statistics
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Votes</span>
                  <span className="font-bold text-primary">{totalVotes}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Active Voters</span>
                  <span className="font-bold text-primary">{results.length}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Your Status</span>
                  <span className={`font-bold ${hasVoted ? 'text-green-600' : 'text-yellow-600'}`}>
                    {hasVoted ? 'Voted' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setChartType(chartType === 'bar' ? 'pie' : 'bar')}
                >
                  {chartType === 'bar' ? <PieChart className="w-4 h-4 mr-2" /> : <BarChart3 className="w-4 h-4 mr-2" />}
                  Switch to {chartType === 'bar' ? 'Pie' : 'Bar'} Chart
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={fetchResults}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Refresh Results
                </Button>
                
                <Button
                  variant="default"
                  className="w-full justify-start"
                  onClick={() => navigate("/results")}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Full Results
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Notifications */}
      <VoteNotification
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}
