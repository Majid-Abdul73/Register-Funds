interface ChallengesStepProps {
  formData: any;
  handleChallengeToggle: (challenge: string) => void;
  validationErrors: Record<string, string>;
}

const ChallengesStep: React.FC<ChallengesStepProps> = ({ formData, handleChallengeToggle, validationErrors }) => {
  const challenges = [
    'Computers & Devices', 'Capacity Building', 'Health & Wellness Support', 'Internet Connectivity',
    'School Meals & Nutrition', 'Science or STEAM Labs', 'Electricity Access', 'Infrastructure',
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mt-6 md:mt-14">What best describes the challenges your school faces?</h2>
      <p className="text-gray-600 text-sm mb-8">
        Select all that apply to help donors understand your needs better <span className="text-red-500">*</span>
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {challenges.map(challenge => (
          <button
            key={challenge}
            type="button"
            onClick={() => handleChallengeToggle(challenge)}
            className={`px-4 py-2.5 rounded-full border text-sm transition-colors ${validationErrors.challenges ? 'border-red-500' : ''} ${
              formData.challenges.includes(challenge)
                ? 'bg-register-green text-white border-register-green'
                : 'border-gray-300 text-gray-700 hover:border-register-green'
            }`}
          >
            {challenge}
          </button>
        ))}
      </div>
      
      {validationErrors.challenges && (
        <p className="text-red-500 text-xs mt-1">{validationErrors.challenges}</p>
      )}
    </div>
  );
};

export default ChallengesStep;