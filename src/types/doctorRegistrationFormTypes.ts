export interface IEducation {
  degree: string;
  institution: string;
  yearOfCompletion: number|string;
}

export interface ICertificate {
  name: string;
  issuedBy: string;
  yearOfIssue: number|string;
}

export interface ClinicAddress {
  clinicName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface DoctorFormValues {
  fullName: string;
  gender: string;
  email: string;
  mobile: string;
   profileImage?: string |File
  departmentId: string;
  department?: string; // for display (populated name)
  experience: number;
  specialization?: string;
  availability?: string[];
  clinicAddress?: ClinicAddress;
  education: IEducation[];
  certifications: ICertificate[];
  licenseNumber: string;
  licenseDocument: File  | string;
  IDProofDocument: File  | string;
}
