import { updateEmail, updatePassword, sendPasswordResetEmail, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../../../config/firebase';
import { FirebaseAuthHookProps } from '../types/security.types';

export const useFirebaseAuth = ({ updateSchoolMutation, schoolData, userId, setError }: FirebaseAuthHookProps) => {
  const handleChangeEmail = async (newEmail: string, currentPassword: string) => {
    if (!auth.currentUser) return;
    
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email || '',
        currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, newEmail);
      
      if (schoolData && userId) {
        await updateSchoolMutation.mutateAsync({
          id: userId,
          data: { email: newEmail }
        });
      }
      
      return true;
    } catch (err) {
      console.error('Error changing email:', err);
      setError('Failed to change email. Please check your password and try again.');
      return false;
    }
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (!auth.currentUser) return;
    
    try {
      if (newPassword !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email || '',
        currentPassword
      );
      
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      
      return true;
    } catch (err) {
      console.error('Error changing password:', err);
      setError('Failed to change password. Please check your current password and try again.');
      return false;
    }
  };

  const handleResetPassword = async () => {
    if (!auth.currentUser || !auth.currentUser.email) return;
    
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      return true;
    } catch (err) {
      console.error('Error resetting password:', err);
      setError('Failed to send password reset email.');
      return false;
    }
  };

  return { handleChangeEmail, handleChangePassword, handleResetPassword };
};