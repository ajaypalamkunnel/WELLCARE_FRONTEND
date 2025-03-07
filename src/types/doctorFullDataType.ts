
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
export interface IDepartment{
    _id:string
    name:string
}
interface IDoctorProfileDataType {
    _id?:string
    fullName?: string;
    email?: string;
    mobile?: string;
    profileImage?: string
    departmentId?: IDepartment;
    availability?:string[];
    gender?:string
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