
export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
};

export type Session = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
};
