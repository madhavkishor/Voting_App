import React from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Clock, Vote } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UserProfile({ user, onLogout, voteHistory = [] }) {
  return (
    <motion.div
      className="bg-card border rounded-lg p-6 shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-primary/10 p-3 rounded-full">
          <User className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
          <p className="text-muted-foreground">Voter Profile</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{voteHistory.length}</div>
          <div className="text-sm text-muted-foreground">Total Votes</div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {voteHistory.length > 0 ? 'Active' : 'Inactive'}
          </div>
          <div className="text-sm text-muted-foreground">Status</div>
        </div>
      </div>

      {voteHistory.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Vote className="w-4 h-4" />
            Recent Votes
          </h3>
          <div className="space-y-2">
            {voteHistory.slice(0, 3).map((vote, index) => (
              <motion.div
                key={index}
                className="flex justify-between items-center p-2 bg-secondary/30 rounded"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <span className="font-medium">{vote.option}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(vote.timestamp).toLocaleDateString()}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={onLogout}
        variant="outline"
        className="w-full"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </motion.div>
  );
}
