import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

// Import components
import FormSteps from '../components/register/FormSteps';
import ProgressIndicator from '../components/register/ProgressIndicator';
import StepHeader from '../components/register/StepHeader';

// Import types
import { FormData } from '../types/register';
export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const totalSteps = 5; // Updated to 5 steps
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>({
    schoolName: '',
    country: '',
    addressLine1: '',
    addressLine2: '',
    digitalAddress: '',
    townCity: '',
    districtRegion: '',
    postalAddress: '',
    schoolEmail: '',
    schoolContactNumber: '',
    city: '',
    schoolType: '',
    challenges: [],
    contactName: '',
    email: '',
    phone: '',
    staffId: '',
    emisCode: '', // Add EMIS Code field
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleChallengeToggle = (challenge: string) => {
    const newChallenges = formData.challenges.includes(challenge)
      ? formData.challenges.filter(c => c !== challenge)
      : [...formData.challenges, challenge];
    
    setFormData(prev => ({
      ...prev,
      challenges: newChallenges
    }));
    
    // Clear validation error when user selects challenges
    if (validationErrors['challenges'] && newChallenges.length > 0) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors['challenges'];
        return newErrors;
      });
    }
  };

  // Validation functions for each step
  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.schoolName.trim()) errors.schoolName = 'School name is required';
    if (!formData.country) errors.country = 'Country is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.schoolType) errors.schoolType = 'School type is required';
    
    // EMIS Code validation
    if (!formData.emisCode.trim()) {
      errors.emisCode = 'EMIS Code is required';
    } else if (!/^[A-Z0-9]{6,12}$/.test(formData.emisCode.trim())) {
      errors.emisCode = 'EMIS Code must be 6-12 characters long and contain only uppercase letters and numbers';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Updated validateStep2 for AddressContactStep
  const validateStep2 = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.addressLine1.trim()) errors.addressLine1 = 'Address Line 1 is required';
    if (!formData.digitalAddress.trim()) errors.digitalAddress = 'Digital Address is required';
    if (!formData.townCity.trim()) errors.townCity = 'Town/City is required';
    if (!formData.districtRegion.trim()) errors.districtRegion = 'District/Region is required';
    if (!formData.postalAddress.trim()) errors.postalAddress = 'Postal Address is required';
    
    if (!formData.schoolEmail.trim()) {
      errors.schoolEmail = 'School email is required';
    } else if (!emailRegex.test(formData.schoolEmail)) {
      errors.schoolEmail = 'Please enter a valid school email address';
    }
    
    if (!formData.schoolContactNumber.trim()) errors.schoolContactNumber = 'School contact number is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Renamed to validateStep3 for ChallengesStep
  const validateStep3 = () => {
    const errors: Record<string, string> = {};
    
    if (formData.challenges.length === 0) {
      errors.challenges = 'Please select at least one challenge';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Renamed to validateStep4 for ContactDetailsStep
  const validateStep4 = () => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.contactName.trim()) errors.contactName = 'Contact name is required';
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    
    // Enhanced Staff ID validation
    if (!formData.staffId.trim()) {
      errors.staffId = 'Staff ID is required';
    } else if (formData.staffId.trim().length < 3) {
      errors.staffId = 'Staff ID must be at least 3 characters long';
    } else if (!/^[A-Za-z0-9-_]+$/.test(formData.staffId.trim())) {
      errors.staffId = 'Staff ID can only contain letters, numbers, hyphens, and underscores';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Renamed to validateStep5 for AccountSecurityStep
  const validateStep5 = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    let isValid = false;
    
    switch (step) {
      case 1:
        isValid = validateStep1();
        break;
      case 2:
        isValid = validateStep2();
        break;
      case 3:
        isValid = validateStep3();
        break;
      case 4:
        isValid = validateStep4();
        break;
      default:
        isValid = false;
    }
    
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };

  const handleRegistration = async () => {
    if (!validateStep5()) return;
    
    try {
      setLoading(true);
      setError('');

      // Create auth user - keeping Firebase auth as requested
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Save school data to Firestore
      await setDoc(doc(db, "schools", userCredential.user.uid), {
        schoolName: formData.schoolName,
        country: formData.country,
        city: formData.city,
        schoolType: formData.schoolType,
        emisCode: formData.emisCode, // Add EMIS Code to saved data
        // Include address fields
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        digitalAddress: formData.digitalAddress,
        townCity: formData.townCity,
        districtRegion: formData.districtRegion,
        postalAddress: formData.postalAddress,
        schoolEmail: formData.schoolEmail,
        schoolContactNumber: formData.schoolContactNumber,
        challenges: formData.challenges,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        staffId: formData.staffId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Navigate to dashboard or success page
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Section */}
      <div className="w-full md:w-1/2 bg-register-light p-4 md:p-8 relative">
        <div className="max-w-md mx-auto">
          <Link to="/" className="flex items-center mb-6 md:mb-14">
            <span className="ml-1.5 font-semibold text-lg">Register</span>
            <div className="bg-register-green text-white text-xs font-semibold py-0.5 px-1.5 rounded">
              FUNDS
            </div>
          </Link>
          
          <p className="text-register-green text-sm mb-2">For School Administrators & Reps</p>
          
          {/* Step Header with title and image */}
          <StepHeader step={step} />
          
          {/* Step-specific descriptions */}
          {step === 1 && (
            <p className="text-gray-600 text-sm hidden md:block">
              Create your free account and start building your fundraising campaign.
            </p>
          )}
          
          {step === 2 && (
            <p className="text-gray-600 text-sm hidden md:block">
              Help your school get noticed by sharing your address and contact information.
            </p>
          )}
          
          {step === 3 && (
            <p className="text-gray-600 text-sm hidden md:block">
              Your input helps ensure the right support reaches your school.
            </p>
          )}
          
          {step === 4 && (
            <p className="text-gray-600 text-sm hidden md:block">
              Lorem ipsum dolor sit amet consectetur. Semper enim scelerisque in pellentesque amet
            </p>
          )}
          
          {step === 5 && (
            <p className="text-gray-600 text-sm hidden md:block">
              You're one step away from launching your school's fundraising campaign. Create a password to finish setting up your account.
            </p>
          )}

          {/* Progress dots - visible only on mobile */}
          <div className="mt-6 md:hidden">
            <ProgressIndicator step={step} totalSteps={totalSteps} isMobile={true} />
          </div>
          
          {/* Desktop progress dots */}
          <div className="hidden md:block md:absolute md:bottom-16">
            <div className="max-w-md mx-auto relative">
              <ProgressIndicator step={step} totalSteps={totalSteps} />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col">
        <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col">
          <div className="text-right mb-4 md:mb-8">
            <span className="text-sm text-gray-600">Have an account already? </span>
            <Link to="/login" className="text-sm text-gray-900 font-medium hover:text-register-green">
              Login →
            </Link>
          </div>

          {/* Form Steps */}
          <div className="flex-grow">
            <FormSteps 
              step={step}
              formData={formData}
              handleInputChange={handleInputChange}
              handleChallengeToggle={handleChallengeToggle}
              handleRegistration={handleRegistration}
              loading={loading}
              error={error}
              setFormData={setFormData}
              validationErrors={validationErrors}
            />
          </div>

          {/* Footer with Continue button and Progress bar */}
          <div className="mt-auto pt-8 pb-4">
            {/* Continue button for steps 1-4 */}
            {step < 5 && (
              <div className="flex justify-center md:justify-start mb-6">
                <button
                  onClick={handleNextStep}
                  className="bg-black text-white rounded-3xl px-6 py-2 hover:bg-black/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            )}

            {/* PROGRESS BAR WITH PERCENTAGE */}
            <div className="w-full md:w-full ">
              <div className="grid grid-cols-12 items-center gap-0">
                <div className="col-span-10">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-register-green h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${(step / totalSteps) * 100}%` }}>
                    </div>
                  </div>
                </div>
                <div className="col-span-2 pl-1">
                  <p className="text-sm font-medium text-gray-700 text-left">
                    {Math.round((step / totalSteps) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}