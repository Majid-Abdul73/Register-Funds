export interface ContactPerson {
  id?: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  staffId?: string;
}

export interface SecurityData {
  email: string;
  contactPersons?: ContactPerson[];
}

export interface SecurityDataHookProps {
  schoolData: any;
  schoolLoading: boolean;
  schoolError: any;
  userId?: string;
}

export interface FirebaseAuthHookProps {
  updateSchoolMutation: any;
  schoolData: any;
  userId?: string;
  setSuccess: (message: string) => void;
  setError: (message: string) => void;
}

export interface ContactManagementHookProps {
  updateSchoolMutation: any;
  userId?: string;
  contactPersons: ContactPerson[];
  setSuccess: (message: string) => void;
  setError: (message: string) => void;
  setShowContactModal: (show: boolean) => void;
  setEditingContact: (contact: ContactPerson | null) => void;
}