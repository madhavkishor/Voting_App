import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, Clock } from 'lucide-react';

export default function VoteNotification({ notifications, onRemove }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-card border shadow-lg rounded-lg p-4 max-w-sm"
            onAnimationComplete={() => {
              if (notification.autoRemove) {
                setTimeout(() => onRemove(notification.id), 3000);
              }
            }}
          >
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Vote className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {notification.voter} voted for <span className="text-primary font-bold">{notification.option}</span>
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRemove(notification.id)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

