interface AddressContactStepProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  validationErrors: Record<string, string>;
}

const AddressContactStep: React.FC<AddressContactStepProps> = ({ formData, handleInputChange, validationErrors }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mt-6 md:mt-14">Your School Address & Contact Information</h2>
      <p className="text-gray-600 text-sm mb-8">
      Help your school get noticed. <br />
      Share a few details about your school to begin your fundraising journey.

      </p>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm mb-1">Address Line 1</label>
                <input
                type="text"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                placeholder="Main address info — e.g., street name, building, or landmark."
                className={`w-full px-4 py-2.5 border ${validationErrors.addressLine1 ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green`}
                required
                />
                {validationErrors.addressLine1 && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.addressLine1}</p>
                )}
            </div>

            <div>
            <label className="block text-sm mb-1">Address Line 2(optional)</label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              placeholder="Additional details — e.g., neighborhood, junction, or suburb."
              className={`w-full px-4 py-2.5 border ${validationErrors.addressLine2 ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green`}
              required
            />
            {validationErrors.addressLine2 && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.addressLine2}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Digital Address</label>
            <input
              type="text"
              name="digitalAddress"
              value={formData.digitalAddress}
              onChange={handleInputChange}
              placeholder="Enter your digital address"
              className={`w-full px-4 py-2.5 border ${validationErrors.digitalAddress ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green`}
              required
            />
            {validationErrors.digitalAddress && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.digitalAddress}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Town/City</label>
            <input
              type="text"
              name="townCity"
              value={formData.townCity}
              onChange={handleInputChange}
              placeholder="Enter your town/city"
              className={`w-full px-4 py-2.5 border ${validationErrors.townCity ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green`}
              required
            />
            {validationErrors.townCity && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.townCity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">District/Region</label>
            <input
              type="text"
              name="districtRegion"
              value={formData.districtRegion}
              onChange={handleInputChange}
              placeholder="Provide district/region"
              className={`w-full px-4 py-2.5 border ${validationErrors.districtRegion ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green`}
              required
            />
            {validationErrors.districtRegion && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.districtRegion}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Postal Address</label>
            <input
              type="text"
              name="postalAddress"
              value={formData.postalAddress}
              onChange={handleInputChange}
              placeholder="Provide Postal Address"
              className={`w-full px-4 py-2.5 border ${validationErrors.postalAddress ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green`}
              required
            />
            {validationErrors.postalAddress && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.postalAddress}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">School email address</label>
            <input
              type="text"
              name="schoolEmail"
              value={formData.schoolEmail}
              onChange={handleInputChange}
              placeholder="Provide school email address"
              className={`w-full px-4 py-2.5 border ${validationErrors.schoolEmail ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green`}
              required
            />
            {validationErrors.schoolEmail && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.schoolEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">School contact number</label>
            <input
              type="text"
              name="schoolContactNumber"
              value={formData.schoolContactNumber}
              onChange={handleInputChange}
              placeholder="Provide school contact number"
              className={`w-full px-4 py-2.5 border ${validationErrors.schoolContactNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green`}
              required
            />
            {validationErrors.schoolContactNumber && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.schoolContactNumber}</p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default AddressContactStep;