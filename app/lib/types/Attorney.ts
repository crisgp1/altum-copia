export interface Attorney {
  id: string;
  slug?: string;
  name: string;
  position: string;
  specialization: string[];
  experience: number;
  education: string[];
  languages: string[];
  email: string;
  phone: string;
  bio: string;
  achievements: string[];
  cases: string[];
  imageUrl?: string;
  linkedIn?: string;
  isPartner: boolean;
  image: string;
  shortDescription: string;
}

export interface AttorneyCardProps {
  attorney: Attorney;
  index: number;
  isActive: boolean;
  onHover: (attorney: Attorney | null) => void;
  onClick: (attorney: Attorney) => void;
}