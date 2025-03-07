
export interface IEducation{
    degree:string;
    institution:string;
    yearOfCompletion:string
}
interface ClinicAddress {
    clinicName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    coordinate?:[]
  }
  
export interface ICertificate{
    name:string;
    issuedBy:string;
    yearOfIssue:string
}

interface IDoctorProfileDataType {
    fullName?: string;
    email?: string;
    mobile?: string;
    profileImage?: string;
    departmentId?: string;
    availability?:string[]
    clinicAddress?:ClinicAddress
    specialization?: string;
    isVerified?:boolean
    experience?: number;
    licenseNumber?: string;
    education?:IEducation[]
    certifications?:ICertificate[];
    licenseDocument?:File|string;
    IDProofDocument?:File |string;
}

export default IDoctorProfileDataType