export interface RestaurantInfo {
  name: string;
  slogan: string;
  address: string;
  phone: string;
  email: string;
  openingHours: string;
  socials: {
    instagram: string;
    facebook: string;
    tripadvisor: string;
    maps: string;
  };
  location: {
    lat: number;
    lng: number;
  };
}
