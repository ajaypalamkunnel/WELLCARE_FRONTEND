export interface UserProfileData{
    user: {
      fullName: string;
      email?: string;
      mobile?: string;
      address?: {
        city?: string;
        country?: string;
        houseName?: string;
        postalCode?: string;
        state?: string;
        street?: string;
      };
      personalInfo?: {
        age?: number;
        gender?: string;
        blood_group?: string;
        allergies?: string;
        chronic_disease?: string;
      };
    };
    onEditProfile?: (data: UserProfileData) => void;
  }


  export interface UserProfileFormData {
    fullName: string;
    mobile?: string;
    email?:string
    city?: string;
    country?: string;
    houseName?: string;
    postalCode?: string;
    state?: string;
    street?: string;
    age?: number;
    gender?: string;
    blood_group?: string;
    allergies?: string;
    chronic_disease?: string;
}
