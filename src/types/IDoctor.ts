
export interface IReview {
    patientId: string;
    rating: number;
    reviewText: string;
    createdAt: Date;
}


export interface IRating {
    averageRating: number;
    totalReviews: number;
}

export interface IEducation {
    degree: string;
    institution: string;
    yearOfCompletion: number;
}

export interface ICertification {
    name: string;
    issuedBy: string;
    yearOfIssue: number;
}

export interface ILocation {
    type: string;
    coordinates: number[];
}

export interface IClinicAddress {
    clinicName: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    location: ILocation;
}
export interface IDepartment{
    _id:string
    name:string
}

export interface IDoctor extends Document {
    _id: string
    fullName: string;
    email: string;
    password: string
    mobile: string;
    specialization: string;
    departmentId: IDepartment;
    experience: number;
    gender:string;
    rating: IRating[];
    reviews: IReview[];
    profileImage: string;
    education: IEducation[];
    certifications: ICertification[];
    currentSubscriptionId?: string;
    isSubscribed: boolean;
    subscriptionExpiryDate?: Date;
    availability: string[]
    clinicAddress?: IClinicAddress;
    licenseNumber: string;
    licenseDocument: string;
    IDProofDocument: string;
    isVerified: boolean;
    status: number;// -1 => blocked 0 => not verified 1 => verified
    createdAt: Date;
    updatedAt: Date;
    
}


export default IDoctor