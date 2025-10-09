// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Components
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import PrivateRoute from "./routes/PrivateRoute";

// Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/aboutpage";
import ServicesPage from "./pages/ServicesPage";
import BookNowPage from "./pages/BookNowPage";
import DSASheetPage from "./pages/DSASheetPage";
import ChatPage from "./pages/ChatPage";
import ContactPage from "./pages/ContactPage";
import PlacementNotesPage from "./pages/PlacementNotesPage";
import ProfilePage from "./pages/ProfilePage";
import GetStartedPage from "./pages/GetStartedPage";
import JobPortalPage from "./pages/JobPortalPage";

// Auth Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Full-page auth routes (no Navbar, no Footer) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes with Navbar + Footer */}
          <Route
            path="/*"
            element={
              <>
                <Navbar />
                <div className="page-content">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/services" element={<ServicesPage />} />

                    <Route path="/dsa-sheet" element={<DSASheetPage />} />
                    <Route path="/chat" element={<ChatPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/get-started" element={<GetStartedPage />} />
                    <Route path="/jobs" element={<JobPortalPage />} />

                    {/* BookNow - static & dynamic */}
                    <Route path="/book-now" element={<BookNowPage />} />
                    <Route
                      path="/book-now/:serviceName"
                      element={<BookNowPage />}
                    />

                    <Route
                      path="/placement-notes"
                      element={<PlacementNotesPage />}
                    />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <ProfilePage />
                        </PrivateRoute>
                      }
                    />
                    <Route path="*" element={<div>Page not found</div>} />
                  </Routes>
                </div>
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
