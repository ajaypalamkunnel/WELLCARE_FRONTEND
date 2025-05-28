export interface IUser {
    id: string;
    email: string;
    fullName: string;
    isSubscribed?:boolean;
    subscriptionExpiryDate?:string
    isVerified?:boolean // is tther is any issue happend in this field change to lower v to capital V
    profileUrl?:string
    status?:number
  }


export interface IAdmin{
  id:string
  email:string
}

