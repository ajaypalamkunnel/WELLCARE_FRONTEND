

 interface IUser {
    _id?: string;
    fullName: string;
    email: string;
    mobile?: string;
    specialization?:string;
    status?: number;
    profileUrl?:string
    isVerified?: boolean;
    updatedAt?: Date;
    createdAt?: Date;

}

export default IUser