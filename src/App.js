import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeProvider';
import Login from './components/Auth/Login';
import ChangePassword from './components/Auth/ChangePassword';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import DashboardLayout from './components/Layout/DashboardLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ChangePasswordPage from './pages/Settings/ChangePasswordPage';
import AccountProfilePage from './pages/Settings/AccountProfilePage';
import PreferencesPage from './pages/Settings/PreferencesPage';
import ConferenceSettingsPage from './pages/Settings/ConferenceSettingsPage';
import ContactsPage from './pages/Contacts/ContactsPage';
import CallsPage from './pages/Calls/CallsPage';
import MessagesPage from './pages/Messages/MessagesPage';
import ConferencePage from './pages/Conference/ConferencePage';
import FaxPage from './pages/Fax/FaxPage';
import BroadcastsPage from './pages/Broadcasts/BroadcastsPage';
import VoicemailPage from './pages/Voicemail/VoicemailPage';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
      <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/change-password" element={<ChangePassword />} />
          
          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="messages" element={<MessagesPage />} />
            <Route path="calls" element={<CallsPage />} />
            <Route path="calls/recent" element={<CallsPage />} />
            <Route path="calls/history" element={<CallsPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="conference" element={<ConferencePage />} />
            <Route path="fax" element={<FaxPage />} />
            <Route path="voicemail" element={<VoicemailPage />} />
            <Route path="broadcasts" element={<BroadcastsPage />} />
            <Route path="settings" element={<div>Settings Page (Coming Soon)</div>} />
            <Route path="settings/profile" element={<AccountProfilePage />} />
            <Route path="settings/change-password" element={<ChangePasswordPage />} />
            <Route path="settings/preferences" element={<PreferencesPage />} />
            <Route path="conference-settings" element={<ConferenceSettingsPage />} />
            <Route path="settings/security" element={<div>Security Settings (Coming Soon)</div>} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;