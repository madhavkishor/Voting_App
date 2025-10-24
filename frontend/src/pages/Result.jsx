import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getVoteResults, connectSocket, disconnectSocket } from "../api/api";
import VoteChart from "../components/VoteChart";
import VoteNotification from "../components/VoteNotification";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  BarChart3, 
  PieChart, 
  RefreshCw,
  ArrowLeft,
  Home
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Result() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");
  const [notifications, setNotifications] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isConnected, setIsConnected] = useState(false);
  const [newVoteCount, setNewVoteCount] = useState(0);
  
  const navigate = useNavigate();

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await getVoteResults();
      setResults(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    
    // Connect to WebSocket for real-time updates
    const socket = connectSocket();
    
    // Track connection status
    socket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to real-time updates');
    });
    
    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from real-time updates');
    });
    
    socket.on('voteUpdate', (data) => {
      setResults(data);
      setLastUpdate(new Date());
      setNewVoteCount(prev => prev + 1);
      
      // Show a subtle animation for new data
      setTimeout(() => {
        setNewVoteCount(0);
      }, 2000);
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

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const totalVotes = results.reduce((sum, result) => sum + result.count, 0);
  const leadingOption = results.reduce((prev, current) => 
    (prev.count > current.count) ? prev : current, { count: 0 }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Header */}
      <motion.header 
        className="bg-card/50 backdrop-blur-sm border-b sticky top-0 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/vote")}
                className="px-2 sm:px-3"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back to Vote</span>
              </Button>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-foreground">Live Results</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                    Real-time voting statistics
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2">
                <div className="sm:hidden flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{totalVotes} votes</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{totalVotes} total votes</span>
                </div>
                
                {/* Real-time indicator */}
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    {isConnected ? 'Live' : 'Offline'}
                  </span>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="px-2 sm:px-3"
              >
                <Home className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Main Results */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Results Chart */}
            <VoteChart 
              data={results} 
              chartType={chartType} 
              onChartTypeChange={setChartType}
              isLive={isConnected}
            />

            {/* Detailed Results */}
            <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Detailed Results</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchResults}
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : results.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-lg">No votes yet</p>
                  <p className="text-muted-foreground">Results will appear here once voting begins</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    // Define consistent order for options
                    const optionOrder = ['Option A', 'Option B', 'Option C'];

                    // Find the max vote count and how many options have it
                    const maxVotes = Math.max(...results.map(r => r.count));
                    const leaders = results.filter(r => r.count === maxVotes && maxVotes > 0);
                    const isTie = leaders.length > 1;

                    // Sort by vote count first, then by predefined order
                    return results
                      .sort((a, b) => {
                        // First sort by vote count (descending)
                        if (b.count !== a.count) {
                          return b.count - a.count;
                        }
                        // If vote counts are equal, sort by predefined order
                        return optionOrder.indexOf(a._id) - optionOrder.indexOf(b._id);
                      })
                      .map((result, index) => {
                        const percentage = totalVotes > 0 ? (result.count / totalVotes) * 100 : 0;
                        const isLeading = result.count === maxVotes && maxVotes > 0;
                        const statusLabel = isLeading ? (isTie ? 'EQUAL' : 'LEADING') : '';

                        return (
                          <motion.div
                            key={result._id}
                            className={`p-3 sm:p-4 rounded-lg border ${
                              isLeading ? 'border-primary bg-primary/5' : 'border-border bg-card'
                            }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex justify-between items-start sm:items-center mb-2">
                              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold ${
                                  index === 0 ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                                }`}>
                                  {index + 1}
                                </div>
                                <span className="font-semibold text-foreground text-sm sm:text-base">{result._id}</span>
                                {isLeading && (
                                  <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                                    {statusLabel}
                                  </span>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-xl sm:text-2xl font-bold text-primary">{result.count}</div>
                                <div className="text-xs sm:text-sm text-muted-foreground">
                                  {percentage.toFixed(1)}%
                                </div>
                              </div>
                            </div>

                            <div className="w-full bg-secondary rounded-full h-2">
                              <motion.div
                                className="bg-primary h-2 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                            </div>
                          </motion.div>
                        );
                      });
                  })()}
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-4 lg:space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Quick Stats */}
            <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                Quick Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Votes</span>
                  <span className="font-bold text-primary">{totalVotes}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Options</span>
                  <span className="font-bold text-primary">{results.length}</span>
                </div>
                
                {leadingOption.count > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Leading</span>
                    <span className="font-bold text-primary">{leadingOption._id}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Last Update</span>
                  <span className="font-bold text-primary text-xs">
                    {lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart Controls */}
            <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Chart Controls
              </h3>
              
              <div className="space-y-3">
                <Button
                  variant={chartType === 'bar' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setChartType('bar')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Bar Chart
                </Button>
                
                <Button
                  variant={chartType === 'pie' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setChartType('pie')}
                >
                  <PieChart className="w-4 h-4 mr-2" />
                  Pie Chart
                </Button>
              </div>
            </div>

            {/* Live Updates */}
            <div className="bg-card border rounded-2xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
                Live Updates
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Connection</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className="text-sm font-medium">
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Update</span>
                  <span className="text-sm font-medium">
                    {lastUpdate.toLocaleTimeString()}
                  </span>
                </div>
                
                {newVoteCount > 0 && (
                  <motion.div
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <span className="text-sm text-muted-foreground">New Votes</span>
                    <span className="text-sm font-bold text-green-600 animate-pulse">
                      +{newVoteCount}
                    </span>
                  </motion.div>
                )}
              </div>
              
              <p className="text-xs text-muted-foreground mt-4">
                {isConnected 
                  ? "Results update automatically as new votes come in."
                  : "Reconnecting to real-time updates..."
                }
              </p>
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
