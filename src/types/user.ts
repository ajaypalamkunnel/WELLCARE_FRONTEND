

 interface IUser {
    _id?: string;
    fullName: string;
    email: string;
    mobile: string;
    password: string;
    status: number;
    isVerified: boolean;
    otp?: string | null;
    otpExpires?: Date | null;
    accessToken:string|null
    updatedAt?: Date;
    createdAt?: Date;

}

export default IUser