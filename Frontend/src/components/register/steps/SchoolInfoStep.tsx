interface SchoolInfoStepProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  validationErrors: Record<string, string>;
}

const SchoolInfoStep: React.FC<SchoolInfoStepProps> = ({ formData, handleInputChange, validationErrors }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mt-6 md:mt-14">Your School Basic Information</h2>
      <p className="text-gray-600 text-sm mb-8">
      Help your school get noticed. <br />
      Share a few details about your school to begin your fundraising journey.

      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name of School</label>
          <input
            type="text"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleInputChange}
            placeholder="Provide the name of your school"
            className={`w-full px-4 py-2.5 border ${validationErrors.schoolName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green`}
            required
          />
          {validationErrors.schoolName && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.schoolName}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Country</label>
            <select 
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border ${validationErrors.country ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green appearance-none bg-white`}
              required
            >
              <option value="">Select your country</option>
              <option value="Ghana">Ghana</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Kenya">Kenya</option>
              <option value="SouthAfrica">South Africa</option>
            </select>
            {validationErrors.country && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.country}</p>
            )}
          </div>
          <div>
            <label className="block text-sm mb-1">City</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border ${validationErrors.city ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green appearance-none bg-white`}
              required
            >
              <option value="">Select your city</option>
              <option value="Accra">Accra</option>
              <option value="Kumasi">Kumasi</option>
              <option value="Tamale">Tamale</option>
              <option value="Cape Coast">Cape Coast</option>
              <option value="Takoradi">Takoradi</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Private/Public</label>
            <select 
              name="schoolType"
              value={formData.schoolType}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-register-green appearance-none bg-white"
            >
              <option value="">Select one option</option>
              <option value="Private">Private</option>
              <option value="Public">Public</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">EMIS Code</label>
            <input
              type="text"
              name="emisCode"
              value={formData.emisCode}
              onChange={handleInputChange}
              placeholder="Provide EMIS Code"
              className={`w-full px-4 py-2.5 border ${validationErrors.emisCode ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green`}
              required
            />
            {validationErrors.emisCode && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.emisCode}</p>
            )}
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default SchoolInfoStep;