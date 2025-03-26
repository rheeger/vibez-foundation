import React from 'react';
import LoginForm from '../../components/auth/LoginForm';
import AuthLayout from '../../components/auth/AuthLayout';

const LoginPage: React.FC = () => {
  return (
    <AuthLayout 
      title="Login" 
      description="Sign in to your Vibez Foundation account"
      imageSrc="/images/auth-bg.jpg"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage; 