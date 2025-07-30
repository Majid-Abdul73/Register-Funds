import SchoolInfoStep from './steps/SchoolInfoStep';
import ChallengesStep from './steps/ChallengesStep';
import ContactDetailsStep from './steps/ContactDetailsStep';
import AccountSecurityStep from './steps/AccountSecurityStep';
import AddressContactStep from './steps/AddressContactStep';

interface FormStepsProps {
  step: number;
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleChallengeToggle: (challenge: string) => void;
  handleRegistration: () => void;
  loading: boolean;
  error: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  validationErrors: Record<string, string>;
}

const FormSteps: React.FC<FormStepsProps> = ({
  step,
  formData,
  handleInputChange,
  handleChallengeToggle,
  handleRegistration,
  loading,
  error,
  setFormData,
  validationErrors
}) => {
  return (
    <>
      {step === 1 && (
        <SchoolInfoStep 
          formData={formData} 
          handleInputChange={handleInputChange} 
          validationErrors={validationErrors}
        />
      )}

      {step === 2 && (
        <AddressContactStep 
          formData={formData} 
          handleInputChange={handleInputChange} 
          validationErrors={validationErrors}
        />
      )}

      {step === 3 && (
        <ChallengesStep 
          formData={formData} 
          handleChallengeToggle={handleChallengeToggle} 
          validationErrors={validationErrors}
        />
      )}

      {step === 4 && (
        <ContactDetailsStep 
          formData={formData} 
          handleInputChange={handleInputChange} 
          validationErrors={validationErrors}
        />
      )}

      {step === 5 && (
        <AccountSecurityStep 
          formData={formData} 
          handleInputChange={handleInputChange} 
          setFormData={setFormData}
          handleRegistration={handleRegistration}
          loading={loading}
          error={error}
          validationErrors={validationErrors}
        />
      )}
    </>
  );
};

export default FormSteps;