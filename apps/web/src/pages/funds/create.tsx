import React, { useState } from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import { useCreateFund } from '../../api/hooks';
import FormInput from '../../components/auth/FormInput';
import Button from '../../components/auth/Button';

const CreateFundPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { mutate: createFund, isLoading } = useCreateFund();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    fundAdvisor: {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: '',
        country: 'USA',
      },
    },
  });
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    description: '',
    'fundAdvisor.firstName': '',
    'fundAdvisor.lastName': '',
    'fundAdvisor.email': '',
    'fundAdvisor.address.line1': '',
    'fundAdvisor.address.city': '',
    'fundAdvisor.address.state': '',
    'fundAdvisor.address.zip': '',
    'fundAdvisor.address.country': '',
  });
  
  // User is not authenticated - the auth context will redirect
  if (authLoading || !user) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested object properties
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      
      if (grandchild) {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: {
              ...prev[parent as keyof typeof prev][child],
              [grandchild]: value,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user types
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const errors = { ...formErrors };
    
    // Validate required fields
    if (!formData.name) {
      errors.name = 'Fund name is required';
      isValid = false;
    }
    
    if (!formData.description) {
      errors.description = 'Fund description is required';
      isValid = false;
    }
    
    if (!formData.fundAdvisor.firstName) {
      errors['fundAdvisor.firstName'] = 'First name is required';
      isValid = false;
    }
    
    if (!formData.fundAdvisor.lastName) {
      errors['fundAdvisor.lastName'] = 'Last name is required';
      isValid = false;
    }
    
    if (!formData.fundAdvisor.email) {
      errors['fundAdvisor.email'] = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.fundAdvisor.email)) {
      errors['fundAdvisor.email'] = 'Email is invalid';
      isValid = false;
    }
    
    if (!formData.fundAdvisor.address.line1) {
      errors['fundAdvisor.address.line1'] = 'Address is required';
      isValid = false;
    }
    
    if (!formData.fundAdvisor.address.city) {
      errors['fundAdvisor.address.city'] = 'City is required';
      isValid = false;
    }
    
    if (!formData.fundAdvisor.address.state) {
      errors['fundAdvisor.address.state'] = 'State is required';
      isValid = false;
    }
    
    if (!formData.fundAdvisor.address.zip) {
      errors['fundAdvisor.address.zip'] = 'ZIP code is required';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      createFund(
        {
          name: formData.name,
          description: formData.description,
          // In a real implementation, you would send the complete fundAdvisor object
        },
        {
          onSuccess: (data) => {
            router.push(`/funds/${data.id}`);
          },
        }
      );
    }
  };
  
  return (
    <>
      <Head>
        <title>Create a Fund | Vibez Foundation</title>
        <meta name="description" content="Create a new Donor-Advised Fund with Vibez Foundation" />
      </Head>
      
      <PageContainer>
        <Header>
          <Title>Create a New Fund</Title>
          <Subtitle>
            Setting up your Donor-Advised Fund allows you to support the causes you care about.
          </Subtitle>
        </Header>
        
        <FormContainer>
          <Form onSubmit={handleSubmit}>
            <SectionTitle>Fund Information</SectionTitle>
            
            <FormInput
              id="name"
              name="name"
              label="Fund Name"
              placeholder="e.g., Smith Family Foundation, Ocean Conservation Fund"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
              required
            />
            
            <TextAreaContainer>
              <Label htmlFor="description">
                Fund Description <Required>*</Required>
              </Label>
              <TextArea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the purpose of your fund and the causes you'd like to support..."
                rows={4}
                hasError={!!formErrors.description}
              />
              {formErrors.description && (
                <ErrorMessage>{formErrors.description}</ErrorMessage>
              )}
              <CharCount limit={500} count={formData.description.length} />
            </TextAreaContainer>
            
            <SectionTitle>Fund Advisor Information</SectionTitle>
            <SubtitleText>
              Fund advisors are authorized to recommend grants from this fund.
            </SubtitleText>
            
            <TwoColumnGrid>
              <FormInput
                id="fundAdvisor.firstName"
                name="fundAdvisor.firstName"
                label="First Name"
                value={formData.fundAdvisor.firstName}
                onChange={handleChange}
                error={formErrors['fundAdvisor.firstName']}
                required
              />
              
              <FormInput
                id="fundAdvisor.lastName"
                name="fundAdvisor.lastName"
                label="Last Name"
                value={formData.fundAdvisor.lastName}
                onChange={handleChange}
                error={formErrors['fundAdvisor.lastName']}
                required
              />
            </TwoColumnGrid>
            
            <FormInput
              id="fundAdvisor.email"
              name="fundAdvisor.email"
              label="Email"
              type="email"
              value={formData.fundAdvisor.email}
              onChange={handleChange}
              error={formErrors['fundAdvisor.email']}
              required
            />
            
            <SectionTitle>Advisor Address</SectionTitle>
            
            <FormInput
              id="fundAdvisor.address.line1"
              name="fundAdvisor.address.line1"
              label="Address Line 1"
              value={formData.fundAdvisor.address.line1}
              onChange={handleChange}
              error={formErrors['fundAdvisor.address.line1']}
              required
            />
            
            <FormInput
              id="fundAdvisor.address.line2"
              name="fundAdvisor.address.line2"
              label="Address Line 2"
              value={formData.fundAdvisor.address.line2}
              onChange={handleChange}
            />
            
            <ThreeColumnGrid>
              <FormInput
                id="fundAdvisor.address.city"
                name="fundAdvisor.address.city"
                label="City"
                value={formData.fundAdvisor.address.city}
                onChange={handleChange}
                error={formErrors['fundAdvisor.address.city']}
                required
              />
              
              <FormInput
                id="fundAdvisor.address.state"
                name="fundAdvisor.address.state"
                label="State"
                value={formData.fundAdvisor.address.state}
                onChange={handleChange}
                error={formErrors['fundAdvisor.address.state']}
                required
              />
              
              <FormInput
                id="fundAdvisor.address.zip"
                name="fundAdvisor.address.zip"
                label="ZIP Code"
                value={formData.fundAdvisor.address.zip}
                onChange={handleChange}
                error={formErrors['fundAdvisor.address.zip']}
                required
              />
            </ThreeColumnGrid>
            
            <FormInput
              id="fundAdvisor.address.country"
              name="fundAdvisor.address.country"
              label="Country"
              value={formData.fundAdvisor.address.country}
              onChange={handleChange}
              error={formErrors['fundAdvisor.address.country']}
              required
            />
            
            <DisclaimerText>
              By creating a fund, you agree to our <a href="/terms">Terms of Service</a> and 
              acknowledge that all contributions to the fund are irrevocable and 
              eligible for a tax deduction in accordance with Endaoment's 501(c)(3) status.
            </DisclaimerText>
            
            <ButtonContainer>
              <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
                Create Fund
              </Button>
            </ButtonContainer>
          </Form>
          
          <SidePanel>
            <SidePanelContent>
              <SidePanelTitle>About Donor-Advised Funds</SidePanelTitle>
              <SidePanelText>
                A Donor-Advised Fund (DAF) is a charitable giving account that allows you to:
              </SidePanelText>
              
              <FeatureList>
                <FeatureItem>
                  <FeatureIcon>🏝️</FeatureIcon>
                  <FeatureText>
                    <strong>Contribute now, decide later</strong> where to grant your funds to qualified nonprofits.
                  </FeatureText>
                </FeatureItem>
                
                <FeatureItem>
                  <FeatureIcon>💰</FeatureIcon>
                  <FeatureText>
                    <strong>Receive an immediate tax deduction</strong> for your contributions.
                  </FeatureText>
                </FeatureItem>
                
                <FeatureItem>
                  <FeatureIcon>📈</FeatureIcon>
                  <FeatureText>
                    <strong>Potentially grow your charitable impact</strong> through investment options.
                  </FeatureText>
                </FeatureItem>
                
                <FeatureItem>
                  <FeatureIcon>🌎</FeatureIcon>
                  <FeatureText>
                    <strong>Simplify your giving</strong> with one tax receipt for all contributions.
                  </FeatureText>
                </FeatureItem>
              </FeatureList>
              
              <QuoteBlock>
                "Vibez Foundation DAFs make philanthropy accessible and enjoyable, with a 
                tropical twist that reminds us to care for our planet."
              </QuoteBlock>
              
              <SidePanelText>
                Need help? <a href="/contact">Contact our team</a> for assistance.
              </SidePanelText>
            </SidePanelContent>
          </SidePanel>
        </FormContainer>
      </PageContainer>
    </>
  );
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  
  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  max-width: 600px;
`;

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 3fr 2fr;
  }
`;

const Form = styled.form`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:first-of-type {
    margin-top: 0;
  }
`;

const SubtitleText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: -0.5rem 0 1.5rem;
`;

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 640px) {
    grid-template-columns: 3fr 2fr 2fr;
  }
`;

const TextAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
  width: 100%;
  position: relative;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Required = styled.span`
  color: ${({ theme }) => theme.colors.error};
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.error : theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background.light};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.error : theme.colors.primary.main};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => 
      hasError 
        ? `${theme.colors.error}20` 
        : `${theme.colors.primary.main}20`};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
    opacity: 0.6;
  }
`;

const CharCount = ({ limit, count }: { limit: number; count: number }) => (
  <CharacterCount isNearLimit={count > limit * 0.8} isOverLimit={count > limit}>
    {count}/{limit}
  </CharacterCount>
);

const CharacterCount = styled.div<{
  isNearLimit: boolean;
  isOverLimit: boolean;
}>`
  font-size: 0.75rem;
  text-align: right;
  margin-top: 0.5rem;
  color: ${({ theme, isNearLimit, isOverLimit }) => {
    if (isOverLimit) return theme.colors.error;
    if (isNearLimit) return theme.colors.warning;
    return theme.colors.text.secondary;
  }};
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.75rem;
  margin-top: 0.5rem;
`;

const DisclaimerText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 2rem 0;
  line-height: 1.5;
  
  a {
    color: ${({ theme }) => theme.colors.primary.main};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ButtonContainer = styled.div`
  margin-top: 2rem;
`;

const SidePanel = styled.div`
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 2rem;
  align-self: start;
`;

const SidePanelContent = styled.div`
  padding: 2rem;
`;

const SidePanelTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SidePanelText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0 0 1.5rem 0;
  line-height: 1.5;
  
  a {
    color: ${({ theme }) => theme.colors.primary.main};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
`;

const FeatureItem = styled.li`
  display: flex;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FeatureIcon = styled.div`
  width: 2rem;
  font-size: 1.25rem;
  margin-right: 0.5rem;
`;

const FeatureText = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
  line-height: 1.5;
`;

const QuoteBlock = styled.blockquote`
  font-size: 0.875rem;
  font-style: italic;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 1.5rem 0;
  padding: 1rem;
  border-left: 3px solid ${({ theme }) => theme.colors.primary.main};
  background-color: ${({ theme }) => `${theme.colors.primary.main}05`};
  border-radius: 0 ${({ theme }) => theme.borderRadius.small} ${({ theme }) => theme.borderRadius.small} 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60vh;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export default CreateFundPage; 