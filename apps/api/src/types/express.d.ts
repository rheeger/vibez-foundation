// Extend the Express Request interface with our custom properties
declare namespace Express {
  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    isVerified: boolean;
    isActive: boolean;
    roles: string[];
    [key: string]: any;
  }

  interface Request {
    user?: User;
  }
} 