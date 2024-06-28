export interface User {
    user_id: string;
    username: string;
    email: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    city: string;
    country: string;
    bio: string;
    profile: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    website: string;
    kajas_link: string;
}
  
export interface LoginResponse {
    user: User;
}
  
export interface LocationResponse {
    isFirstTimeLogin: boolean;
}

export interface ProfileData {
    first_name: string;
    last_name: string;
    country: string;
    city: string;
    bio: string;
    profile: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    website: string;
    kajasLink: string;
    artworks: Artwork[];
}

export interface Artwork {
    status: string;
    artwork_id: string;
    date_created: string;
    description: string;
    image_url: string;
    title: string;
    user_id: number;
}