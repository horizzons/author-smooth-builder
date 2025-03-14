
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
  console.log("App rendering, configuring routes");
  return (
    <ErrorBoundary>
      <TRPCProviders>
        <AuthProvider>
          <Router>
            <div className="flex flex-col min-h-screen">
              {/* Only show header on non-editor pages */}
              <Routes>
                <Route path="/editor/*" element={null} />
                <Route path="*" element={<Header />} />
              </Routes>
              
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<AuthPage />} />
                  
                  {/* Dashboard and Editor should be accessible without auth for now */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/editor" element={<EditorLayout />} />
                  <Route path="/editor/*" element={<EditorLayout />} />
                  
                  {/* Redirect any undefined routes to 404 page */}
                  <Route path="/not-found" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/not-found" replace />} />
                </Routes>
              </main>
            </div>
            <Toaster />
          </Router>
        </AuthProvider>
      </TRPCProviders>
    </ErrorBoundary>
  );
}

export default App;
