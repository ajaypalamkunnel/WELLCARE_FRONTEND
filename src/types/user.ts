

 
 interface IPersonalInfo {
    age: number;
    gender: "male" | "female";
    blood_group: string;
    allergies:string;
    chronic_disease:string;
}
export interface IAddress {
    houseName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}
 interface IUser {
    _id?: string;
    fullName: string;
    email: string;
    mobile?: string;
    specialization?:string;
    status?: number;
    address?:IAddress;
    personalInfo?:IPersonalInfo
    profileUrl?:string;
    isVerified?: boolean;
    updatedAt?: Date;
    createdAt?: Date;

}

export default IUser