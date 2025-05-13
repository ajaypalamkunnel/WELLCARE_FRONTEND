import axios from "axios";



export const getErrorMessage = (error:unknown):string =>{
    if(axios.isAxiosError(error)){
        return error.response?.data?.error || "An error occurred while processing your request.";
    }

    if (error instanceof Error) {
        return error.message; // Handle native JS errors
      } 
      return "An unknown error occurred.";

}