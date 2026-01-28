// Base types
export interface BaseEntity {
  id: number;
  unique_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Blog types (matching existing API structure)
export interface Blog extends BaseEntity {
  name: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  image?: string;
  date: string;
  is_published: boolean;
  is_top: boolean;
  category_id: number;
  excerpt?: string;
  featuredImage?: string;
  author?: Author;
  tags?: string[];
  publishedAt?: string;
  readTime?: number;
}

// Course types (matching actual API structure)
interface Instructor {
  id: number;
  unique_id: string;
  first_name: string;
  last_name: string;
  father_name: string;
  description: string;
  full_address: string;
  dob: string;
  image: string;
  contact_no: string;
  is_alive: number;
  is_published: number;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  book_id: number;
  recorded_by_id: number;
  description: string;
  publish_date: string;
  created_date: string;
  is_published: number;
  duration: string;
  video_quantity: number;
  resolution: string;
  space: string;
  short_video: string;
  image: string;
  created_at: string;
  updated_at: string;
  recorded_by?: Instructor; // ✅ include instructor data
}


// Author types (matching existing API structure)
export interface Author extends BaseEntity {
  first_name: string;
  last_name: string;
  father_name: string;
  grandfather_name: string;
  full_address: string;
  book_count: number;
  dob: string;
  image?: string | null;
  bio: string;
  is_published: boolean;
  contact_no?: string | null;
  is_alive: boolean;
  // Additional fields for compatibility
  name?: string;
  avatar?: string;
  email?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
  };
  specialization?: string[];
  books?: Book[];
  courses?: Course[];
}

// Book types (matching actual API structure)
export interface Book extends BaseEntity {
  book_category_id: number;
  author: Author;
  title: string;
  edition: string;
  pages: number;
  description: string;
  written_year: string;
  pdf_file: string;
  is_published: number;
  downloadable: number;
  image: string;
  is_in_library: number;
}

// Event types (matching actual API structure)
export interface Event extends BaseEntity {
  id: number;
  title: string;
  slug: string;
  image: string;
  branch_name: string;
  address: string;
  contact: string;
  description: string;
  email: string;
  whatsapp: string;
  country: string;
  created_at: string;
  updated_at: string;

  // New fields
  duration: string;
  live_link?: string;       // optional because not every event may have it
  live_link_type?: string;  // e.g. "facebook" | "youtube" | "zoom"
}

export interface ExamResult extends BaseEntity {
  slug : string,
  year : number,
  title : string,
  pdf: string

}


// Fatwa types
export interface Iftah {
  id: number;
  title: string;
  slug: string;
  question: string;
  answer: string;
  date?: string;
  note?: string;
  is_published?: number | boolean;
  is_top?: number | boolean;
  attachment?: string | null;
  mufti_id?: number;
  tag_id?: number;
  created_at?: string;
  updated_at?: string;

  mufti?: {
    id: number;
    full_name: string;
    father_name?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    image?: string | null;
    dob?: string | null;
    biography?: string | null;
    created_at?: string;
    updated_at?: string;
  };
  

  tag?: {
    id: number;
    name: string;
    created_at?: string | null;
    updated_at?: string;
  };
}

// Article types
export interface Article extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  description?: string;
  excerpt?: string;
  featuredImage?: string;
  video_url?: string;
  author?: Author;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  readTime?: number;
  viewCount?: number;
  is_published?: boolean;
}

// Graduation types
export interface Graduation extends BaseEntity {
  studentName: string;
  slug: string;
  photo?: string;
  graduationDate: string;
  course?: string;
  grade?: string;
  certificate?: string;
  testimonial?: string;
  achievements?: string[];
}


// types/awlyaa.ts

export interface Awlyaa extends BaseEntity {
  id: number;
  type: string;
  way: string;
  name: string;
  title: string;
  nickname: string;
  birth_date: string | null;
  birth_place: string | null;
  birth_city: string | null;
  birth_country: string | null;
  death_date: string | null;
  death_place: string | null;
  death_city: string | null;
  death_country: string | null;
  age_at_death: number | null;
  father_name: string | null;
  number_of_children: string | null;
  education: string | null;
  teachers: string | null;
  students: string | null;
  books_written: string | null;
  famous_works: string | null;
  profile_image: string | null;
  extra_information: string | null;
  orders_number: number | null;
  created_at: string;
  updated_at: string;
}


// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  success: boolean;
  message?: string;
}

// Navigation types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
}

// Form types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface NewsletterForm {
  email: string;
  name?: string;
}

// Awlyaa Charts types
export interface AwlyaaChart {
  id: number;
  uniqu_id: string;
  name: string;
  image: string | null;
  awlyaa_id: number | null;
  created_at: string;
  updated_at: string;
  awlyaa:  null;
  children: AwlyaaChart[];
  parents: AwlyaaChartParent[];
}

export interface AwlyaaChartParent {
  id: number;
  teacher_awlyaa_chart_id: number;
  student_awlyaa_chart_id: number;
  created_at: string;
  updated_at: string;
  teacher_chart: AwlyaaChart;
}

// Search types
export interface SearchResult {
  type: 'blog' | 'course' | 'author' | 'book' | 'event' | 'fatwa' | 'article' | ' ';
  id: string;
  title: string;
  description?: string;
  url: string;
  score: number;
  course : string
}

export interface SearchFilters {
  type?: string[];
  category?: string[];
  author?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  priceRange?: {
    min: number;
    max: number;
  };
}

// User types
export interface User extends BaseEntity {
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  preferences?: {
    language?: string;
    theme?: 'light' | 'dark';
    notifications?: boolean;
  };
}

// Common utility types
export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface LoadingState {
  status: Status;
  error?: string;
}

// Component prop types
export interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

// Shajara types
export interface Shajara extends BaseEntity {
  name: string;
  created_at: string;
  updated_at: string;
}

// Sanad types
export interface Sanad extends BaseEntity {
  name: string;
  created_at: string;
  updated_at: string;
}