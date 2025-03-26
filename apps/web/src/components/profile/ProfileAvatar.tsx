import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useUploadAvatar } from '../../api/hooks';
import { useAuth } from '../../contexts/AuthContext';

interface ProfileAvatarProps {
  size?: 'small' | 'medium' | 'large';
  editable?: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  size = 'medium',
  editable = false,
}) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadAvatar, isLoading } = useUploadAvatar();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };
  
  const handleAvatarClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    
    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Upload file
    const formData = new FormData();
    formData.append('avatar', file);
    uploadAvatar(formData, {
      onSuccess: () => {
        // Clear preview URL once upload is successful
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl(null);
      },
      onError: () => {
        // Clear preview URL on error
        URL.revokeObjectURL(objectUrl);
        setPreviewUrl(null);
      },
    });
  };
  
  const avatarUrl = previewUrl || user?.avatarUrl;

  return (
    <AvatarContainer size={size} editable={editable} onClick={handleAvatarClick}>
      {avatarUrl ? (
        <AvatarImage src={avatarUrl} alt={user?.name || 'User avatar'} />
      ) : user?.name ? (
        <AvatarInitials size={size}>{getInitials(user.name)}</AvatarInitials>
      ) : (
        <DefaultAvatar />
      )}
      
      {editable && (
        <>
          <EditOverlay isLoading={isLoading}>
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <EditIcon>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </EditIcon>
            )}
          </EditOverlay>
          <HiddenInput
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />
        </>
      )}
    </AvatarContainer>
  );
};

const sizeMap = {
  small: '40px',
  medium: '80px',
  large: '120px',
};

const fontSize = {
  small: '16px',
  medium: '24px',
  large: '36px',
};

const AvatarContainer = styled.div<{
  size: 'small' | 'medium' | 'large';
  editable: boolean;
}>`
  width: ${({ size }) => sizeMap[size]};
  height: ${({ size }) => sizeMap[size]};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  cursor: ${({ editable }) => (editable ? 'pointer' : 'default')};
  border: 3px solid ${({ theme }) => theme.colors.background.light};
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarInitials = styled.div<{ size: 'small' | 'medium' | 'large' }>`
  color: ${({ theme }) => theme.colors.text.onDark};
  font-weight: 600;
  font-size: ${({ size }) => fontSize[size]};
`;

const DefaultAvatar = styled.div`
  width: 50%;
  height: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const EditOverlay = styled.div<{ isLoading: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ isLoading }) => (isLoading ? 1 : 0)};
  transition: opacity 0.2s;
  
  ${AvatarContainer}:hover & {
    opacity: 1;
  }
`;

const EditIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

export default ProfileAvatar; 