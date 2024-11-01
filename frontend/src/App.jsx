import './App.css'
import AddBlog from './components/AddBlog';
import BlogList from './components/BlogList';
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SingUp";
import { Navbar } from "./components/Navbar";
// import ProtectedRoute from "./Components/ProtectedRoute";
import axios from "axios";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      axios.get('https://all-user-blogs-api.onrender.com/user', { withCredentials: true })
          .then(response => {
              if (response.data.user) {
                  setIsLoggedIn(true);
              } else {
                  setIsLoggedIn(false);
              }
          })
          .catch(() => setIsLoggedIn(false));
  }, []);
    return (
        <div>
            <h1>Blogging Website</h1>
            <AddBlog />
            <BlogList />
            <div>
          <BrowserRouter>
              <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/login" element={isLoggedIn ? <Navigate to="/home" /> : <Login setIsLoggedIn={setIsLoggedIn} />} />
                  <Route path="/signup" element={isLoggedIn ? <Navigate to="/home" /> : <SignUp setIsLoggedIn={setIsLoggedIn} />} />
              </Routes>
          </BrowserRouter>
      </div>
        </div>
    );
};

export default App;
