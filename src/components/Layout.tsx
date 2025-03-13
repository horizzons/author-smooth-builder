import React from 'react';
import { Link } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link to="/" className="font-serif text-2xl font-bold">
            AuthorCraft
          </Link>
          <div className="ml-auto flex gap-4">
            <Link
              to="/dashboard"
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              to="/editor"
              className="text-foreground/80 transition-colors hover:text-foreground"
            >
              Editor
            </Link>
          </div>
        </div>
      </nav>
      <main className="container animate-fadeIn py-8">{children}</main>
    </div>
  );
};

export default Layout;
