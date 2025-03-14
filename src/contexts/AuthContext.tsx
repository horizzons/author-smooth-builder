
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, Session } from '@/types/auth';

type AuthContextType = {
  session: Session;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data.session) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, avatar_url')
            .eq('id', data.session.user.id)
            .single();

          if (profileError) throw profileError;

          setSession({
            user: {
              id: data.session.user.id,
              email: data.session.user.email!,
              firstName: profileData?.first_name || undefined,
              lastName: profileData?.last_name || undefined,
              avatarUrl: profileData?.avatar_url || undefined,
            },
            isLoading: false,
            error: null,
          });
        } else {
          setSession({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setSession({
          user: null,
          isLoading: false,
          error: error as Error,
        });
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('id', session.user.id)
              .single();

            if (profileError) throw profileError;

            setSession({
              user: {
                id: session.user.id,
                email: session.user.email!,
                firstName: profileData?.first_name || undefined,
                lastName: profileData?.last_name || undefined,
                avatarUrl: profileData?.avatar_url || undefined,
              },
              isLoading: false,
              error: null,
            });
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setSession({
              user: {
                id: session.user.id,
                email: session.user.email!,
              },
              isLoading: false,
              error: error as Error,
            });
          }
        } else {
          setSession({
            user: null,
            isLoading: false,
            error: null,
          });
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    firstName?: string,
    lastName?: string
  ) => {
    try {
      setSession((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
      });

      setSession({
        user: null, // User needs to verify email
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('Error signing up:', error);
      toast({
        variant: "destructive",
        title: "Error creating account",
        description: error.message || "An unknown error occurred",
      });
      
      setSession((prev) => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setSession((prev) => ({ ...prev, isLoading: true, error: null }));
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Signed in successfully!",
        description: `Welcome back, ${data.user.email}!`,
      });
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast({
        variant: "destructive",
        title: "Error signing in",
        description: error.message || "An unknown error occurred",
      });
      
      setSession((prev) => ({
        ...prev,
        isLoading: false,
        error: error as Error,
      }));
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message || "An unknown error occurred",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions to reset your password.",
      });
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        variant: "destructive",
        title: "Error resetting password",
        description: error.message || "An unknown error occurred",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
