import React from 'react';
import RegisterForm from '../../components/auth/RegisterForm';
import AuthLayout from '../../components/auth/AuthLayout';

const RegisterPage: React.FC = () => {
  return (
    <AuthLayout 
      title="Create Account" 
      description="Join the Vibez Foundation community"
      imageSrc="/images/register-bg.jpg"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage; 