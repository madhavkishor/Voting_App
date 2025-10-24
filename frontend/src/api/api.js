import { io } from 'socket.io-client';

const API_URL = "https://real-time-voting-app-production.up.railway.app/api";
const SOCKET_URL = "https://real-time-voting-app-production.up.railway.app";

// Socket connection
let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const loginUser = async (name) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const castVote = async (token, option) => {
  const res = await fetch(`${API_URL}/vote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ option }),
  });
  return res.json();
};

export const getVotes = async (token) => {
  const res = await fetch(`${API_URL}/vote`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

export const getVoteResults = async () => {
  const res = await fetch(`${API_URL}/vote/results`);
  return res.json();
};

export const getUserVoteHistory = async (token) => {
  const res = await fetch(`${API_URL}/vote/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};

