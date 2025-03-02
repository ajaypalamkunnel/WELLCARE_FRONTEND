

 interface IUser {
    _id?: string;
    fullName: string;
    email: string;
    mobile?: string;
    status?: number;
    isVerified?: boolean;
    updatedAt?: Date;
    createdAt?: Date;

}

export default IUser