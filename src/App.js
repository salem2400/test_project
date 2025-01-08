import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DeckProvider } from './context/DeckContext';
import PrivateRoute from './components/PrivateRoute';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Decks from './pages/Decks';
import CreateDeck from './pages/CreateDeck';
import DeckView from './pages/DeckView';
import Review from './pages/Review';
import Test from './pages/Test';
import Progress from './pages/Progress';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
      <DeckProvider>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/decks" element={<PrivateRoute><Decks /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/create-deck" element={<PrivateRoute><CreateDeck /></PrivateRoute>} />
          <Route path="/deck/:id" element={<PrivateRoute><DeckView /></PrivateRoute>} />
          <Route path="/review/:id" element={<PrivateRoute><Review /></PrivateRoute>} />
          <Route path="/test/:id" element={<PrivateRoute><Test /></PrivateRoute>} />
          <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
        </Routes>
      </DeckProvider>
    </AuthProvider>
  );
}

export default App; 