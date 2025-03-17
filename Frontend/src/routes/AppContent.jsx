import React, { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import AuthLayout from '../layout/AuthLayout';
import { ProtectedRoute, PublicRoute } from './Routes';
import Loader from '../layout/Loader2';
import Signup from '../pages/authentication/signup.js';

const Tasks = lazy(() => import('../components/adminPannel/Tasks'));
const Events = lazy(() => import('../components/adminPannel/Events'));
const Login = lazy(() => import('../pages/authentication/login'));

const AppContent = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/overview" element={<ProtectedRoute component={MainLayout} />}>
          <Route index element={<Navigate to="/overview/tasks" replace />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="events" element={<Events />} />
        </Route>

        <Route path="/" element={<PublicRoute component={AuthLayout} />}>
          <Route index element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppContent;
