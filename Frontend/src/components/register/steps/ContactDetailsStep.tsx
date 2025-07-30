interface ContactDetailsStepProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  validationErrors: Record<string, string>;
}

const ContactDetailsStep: React.FC<ContactDetailsStepProps> = ({ formData, handleInputChange, validationErrors }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mt-6 md:mt-14">Contact Person Details</h2>
      <p className="text-gray-600 text-sm mb-8">
        Add your school's contact person to complete verification and build trust with potential donors.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name of School Administrator or Representative <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            placeholder="Provide your name"
            className={`w-full px-4 py-2.5 border ${validationErrors.contactName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green`}
            required
          />
          {validationErrors.contactName && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.contactName}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="email@gmail.com"
              className={`w-full px-4 py-2.5 border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green`}
              required
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Phone Number <span className="text-red-500">*</span></label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+233 (555) 000-0000"
              className={`w-full px-4 py-2.5 border ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green`}
              required
            />
            {validationErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
            )}
          </div>

           <div>
          <label className="block text-sm mb-1">Staff ID</label>
          <input
            type="text"
            name="staffId"
            value={formData.staffId}
            onChange={handleInputChange}
            placeholder="Provide your staff ID"
            className={`w-full px-4 py-2.5 border ${validationErrors.staffId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-register-green`}
          />
          {validationErrors.staffId && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.staffId}</p>
          )}
        </div>
        
        </div>

       
      </div>
    </div>
  );
};

export default ContactDetailsStep;