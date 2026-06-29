import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { LandingPage } from "../pages/public/LandingPage";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { VerifyEmail } from "../pages/auth/VerifyEmail";
import { ForgotPassword } from "../pages/auth/ForgotPassword";
import { ResetPassword } from "../pages/auth/ResetPassword";
import { Unauthorized } from "../pages/Unauthorized";

import { ClientDashboard } from "../pages/client/ClientDashboard";
import { ClientAnalytics } from "../pages/client/ClientAnalytics";
import { ClientTalentPool } from "../pages/client/ClientTalentPool";

import { FreelancerDashboard } from "../pages/freelancer/FreelancerDashboard";
import { FreelancerAnalytics } from "../pages/freelancer/FreelancerAnalytics";

import { AdminDashboard } from "../pages/admin/AdminDashboard";
import { GlobalSettings } from "../pages/admin/GlobalSettings";

import MessagesPage from "../pages/shared/MessagesPage";

import { Navigation } from "../components/layout/Navigation";
import { PublicRoute } from "./PublicRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleBasedRoute } from "./RoleBasedRoute";

const ClientPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <RoleBasedRoute allowedRoles={["CLIENT"]}>
      <Navigation>{children}</Navigation>
    </RoleBasedRoute>
  </ProtectedRoute>
);

const FreelancerPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <RoleBasedRoute allowedRoles={["FREELANCER"]}>
      <Navigation>{children}</Navigation>
    </RoleBasedRoute>
  </ProtectedRoute>
);

const AdminPage = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <RoleBasedRoute allowedRoles={["ADMIN"]}>
      <Navigation>{children}</Navigation>
    </RoleBasedRoute>
  </ProtectedRoute>
);

export const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route path="/verify-email" element={<VerifyEmail />} />

      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Client */}
      <Route
        path="/client/dashboard"
        element={
          <ClientPage>
            <ClientDashboard />
          </ClientPage>
        }
      />

      <Route
        path="/client/messages"
        element={
          <ClientPage>
            <MessagesPage />
          </ClientPage>
        }
      />

      <Route
        path="/client/messages/:conversationId"
        element={
          <ClientPage>
            <MessagesPage />
          </ClientPage>
        }
      />

      <Route
        path="/client/analytics"
        element={
          <ClientPage>
            <ClientAnalytics />
          </ClientPage>
        }
      />

      <Route
        path="/client/talent-pool"
        element={
          <ClientPage>
            <ClientTalentPool />
          </ClientPage>
        }
      />

      <Route
        path="/client/*"
        element={
          <ClientPage>
            <ClientDashboard />
          </ClientPage>
        }
      />

      {/* Freelancer */}
      <Route
        path="/freelancer/dashboard"
        element={
          <FreelancerPage>
            <FreelancerDashboard />
          </FreelancerPage>
        }
      />

      <Route
        path="/freelancer/messages"
        element={
          <FreelancerPage>
            <MessagesPage />
          </FreelancerPage>
        }
      />

      <Route
        path="/freelancer/messages/:conversationId"
        element={
          <FreelancerPage>
            <MessagesPage />
          </FreelancerPage>
        }
      />

      <Route
        path="/freelancer/analytics"
        element={
          <FreelancerPage>
            <FreelancerAnalytics />
          </FreelancerPage>
        }
      />

      <Route
        path="/freelancer/*"
        element={
          <FreelancerPage>
            <FreelancerDashboard />
          </FreelancerPage>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminPage>
            <AdminDashboard />
          </AdminPage>
        }
      />

      <Route
        path="/admin/messages"
        element={
          <AdminPage>
            <MessagesPage />
          </AdminPage>
        }
      />

      <Route
        path="/admin/messages/:conversationId"
        element={
          <AdminPage>
            <MessagesPage />
          </AdminPage>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <AdminPage>
            <GlobalSettings />
          </AdminPage>
        }
      />

      <Route
        path="/admin/*"
        element={
          <AdminPage>
            <AdminDashboard />
          </AdminPage>
        }
      />

      <Route
        path="*"
        element={
          user ? (
            user.role === "CLIENT" ? (
              <Navigate to="/client/dashboard" replace />
            ) : user.role === "FREELANCER" ? (
              <Navigate to="/freelancer/dashboard" replace />
            ) : user.role === "ADMIN" ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;