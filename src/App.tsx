
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TRPCProviders } from './lib/trpc/providers';
import Header from './components/Header';
import { Toaster } from './components/ui/toaster';
import ProtectedRoute from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ui/error-boundary';
import Index from './pages/Index';
import AuthPage from './pages/Auth';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import EditorLayout from './features/editor/EditorLayout';
import './App.css';

function App() {
  return (
    <TRPCProviders>
      <AuthProvider>
        <ErrorBoundary>
          <Router basename="/">
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/editor/*" element={
                    <ProtectedRoute>
                      <EditorLayout />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
            <Toaster />
          </Router>
        </ErrorBoundary>
      </AuthProvider>
    </TRPCProviders>
  );
}

export default App;
