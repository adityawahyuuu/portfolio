export interface SocialLink {
    name: string;
    url: string;
    icon: string;
  }
  
  export interface ContactData {
    socialLinks: SocialLink[];
    email?: string;
    phone?: string;
  }
  
  export interface FormData {
    name: string;
    email: string;
    message: string;
  }
  
  