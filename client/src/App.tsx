// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import StartScreen from "./Screens/LoginScreen";
import { AuthProvider } from "./Context/AuthContext";
import DashboardScreen from "./Screens/DashboardScreen";
import ProtectedRoute from "./SharedComponents/ProtectedRoute";
import TripScreen from "./Screens/TripScreen";
import SelectDateScreen from "./Screens/SelectDateScreen";

const App: React.FC = () => {

  return (
    <React.StrictMode>
      <AuthProvider>
      <div className="h-[100vh] w-[100vw]">
        <Router>
          <Routes>
            <Route path="/" element={<StartScreen />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardScreen/>
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute>
                  <SelectDateScreen/>
                </ProtectedRoute>
                } />
              <Route path="/trip/:id" element={
                <ProtectedRoute>
                  <TripScreen/>
                </ProtectedRoute>
                } />
              {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
        </Router>
      </div>
      </AuthProvider>
    </React.StrictMode>
  );
};

export default App;
