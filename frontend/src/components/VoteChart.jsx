import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

export default function VoteChart({ data, chartType = 'bar', onChartTypeChange, isLive = false }) {

  // Define consistent order and color for options
  const optionOrder = [
    { name: 'Option A', color: COLORS[0] },
    { name: 'Option B', color: COLORS[1] },
    { name: 'Option C', color: COLORS[2] }
  ];

  // Create a map from data for quick lookup
  const dataMap = {};
  data.forEach(item => {
    dataMap[item._id] = item.count;
  });

  // Always include all options, even if count is 0
  const chartData = optionOrder.map(opt => ({
    name: opt.name,
    votes: dataMap[opt.name] || 0,
    fill: opt.color
  }));

  const totalVotes = chartData.reduce((sum, item) => sum + item.votes, 0);

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [value, 'Votes']}
          labelFormatter={(label) => `Option: ${label}`}
        />
        <Bar dataKey="votes" fill="#8884d8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  // Determine if there is a tie for the highest vote count
  const maxVotes = Math.max(...chartData.map(item => item.votes));
  const leaders = chartData.filter(item => item.votes === maxVotes && maxVotes > 0);
  const isTie = leaders.length > 1;

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, votes, percent }) => {
            let status = '';
            if (votes === maxVotes && maxVotes > 0) {
              status = isTie ? 'EQUAL' : 'LEADING';
            }
            return `${name}: ${votes} (${(percent * 100).toFixed(1)}%)${status ? ` - ${status}` : ''}`;
          }}
          outerRadius={80}
          fill="#8884d8"
          dataKey="votes"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [value, 'Votes']} />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <motion.div 
      className="w-full bg-card p-6 rounded-lg shadow-lg border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-foreground">Vote Results</h2>
          {isLive && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              LIVE
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChartTypeChange('bar')}
          >
            Bar Chart
          </Button>
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChartTypeChange('pie')}
          >
            Pie Chart
          </Button>
        </div>
      </div>
      
      <div className="mb-4 text-center">
        <p className="text-lg text-muted-foreground">
          Total Votes: <span className="font-bold text-primary">{totalVotes}</span>
        </p>
      </div>

      <motion.div
        key={chartType}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {chartType === 'bar' ? renderBarChart() : renderPieChart()}
      </motion.div>

      {data.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-lg">No votes yet</p>
          <p className="text-muted-foreground">Be the first to vote!</p>
        </div>
      )}
    </motion.div>
  );
}
