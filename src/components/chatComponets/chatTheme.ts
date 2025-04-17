// chatTheme.ts

export interface ChatTheme {
    primary: string;
    primaryLight: string;
    bg: string;
  }
  
  export const userChatTheme: ChatTheme = {
    primary: "#03C03C",
    primaryLight: "#09db4b",
    bg: "#ffffff"
  };
  
  export const doctorChatTheme: ChatTheme = {
    primary: "#03045e",
    primaryLight: "#0466c8",
    bg: "#ffffff"
  };
  