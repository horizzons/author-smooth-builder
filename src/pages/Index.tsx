
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Index: React.FC = () => {
  const { session } = useAuth();

  return (
    <div className="container mx-auto px-4">
      <section className="py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 leading-tight">Create Your Professional Author Website in Minutes</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          AuthorCraft helps authors build beautiful websites with tools designed specifically for writers.
          Showcase your books, blog, and connect with your readers.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {session.user ? (
            <Button size="lg" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link to="/auth?tab=register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            </>
          )}
        </div>
      </section>
      
      <section className="py-16 grid md:grid-cols-3 gap-8">
        <div className="text-center p-6 rounded-lg border border-border">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Book Showcase</h3>
          <p className="text-muted-foreground">
            Display your books with cover images, descriptions, and purchase links.
          </p>
        </div>
        
        <div className="text-center p-6 rounded-lg border border-border">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Integrated Blog</h3>
          <p className="text-muted-foreground">
            Share your writing journey, updates, and connect with your readers.
          </p>
        </div>
        
        <div className="text-center p-6 rounded-lg border border-border">
          <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-primary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 3.75H6.912a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H15M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859M12 3v8.25m0 0l-3-3m3 3l3-3"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Newsletter Signup</h3>
          <p className="text-muted-foreground">
            Grow your audience with integrated email newsletter subscriptions.
          </p>
        </div>
      </section>
      
      <section className="py-16 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Create Your Author Website?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of authors who have built their online presence with AuthorCraft. No technical skills required.
          </p>
          <Button size="lg" asChild>
            <Link to="/auth?tab=register">Start Building Today</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
