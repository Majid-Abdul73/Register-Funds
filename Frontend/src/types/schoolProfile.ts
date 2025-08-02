export interface SchoolData {
  schoolName: string;
  schoolType: string;
  // Address fields
  addressLine1: string;
  addressLine2: string;
  digitalAddress: string;
  city: string;
  district: string;
  country: string;
  // Contact fields
  email: string;
  phone: string;
  postalAddress: string;
}

export interface EditableSectionProps {
  schoolData: SchoolData;
  formData: SchoolData;
  saving: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSave: () => Promise<void>;
  onCancel: () => void;
}