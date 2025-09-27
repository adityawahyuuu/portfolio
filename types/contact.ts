export interface SocialLink {
    name: string;
    url: string;
    icon: string;
  }
  
  export interface ContactData {
    socialLinks: SocialLink[];
  }
  
  export interface FormData {
    name: string;
    email: string;
    message: string;
  }
  
  