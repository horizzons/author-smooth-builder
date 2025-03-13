import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-8 text-center">
      <h1 className="max-w-3xl animate-slideUp font-serif text-5xl font-bold leading-tight">
        Create Your Professional Author Website in Minutes
      </h1>
      <p className="animation-delay-100 max-w-2xl animate-slideUp text-xl text-muted-foreground">
        Beautiful, customizable websites designed specifically for authors. Showcase your books,
        connect with readers, and grow your audience.
      </p>
      <Button size="lg" asChild className="animation-delay-200 animate-slideUp">
        <Link to="/dashboard">
          Get Started
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
};

export default Index;
