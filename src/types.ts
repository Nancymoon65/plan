export interface Seminar {
  id: string;
  title: string;
  subtitle: string;
  category: '인공지능 실무' | '노코드 자동화' | '비즈니스 스킬' | '경영 리더십';
  date: string;
  time: string;
  location: string;
  isOnlineAvailable: boolean;
  totalSeats: number;
  registeredSeats: number;
  badge: string;
  fee: string;
  speaker: {
    name: string;
    role: string;
    company: string;
    bio: string;
  };
  agenda: {
    time: string;
    title: string;
    description: string;
  }[];
  tags: string[];
}

export interface RegistrationFormData {
  seminarId: string;
  seminarTitle: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  experienceLevel: '입문 (처음 접함 / 경험 적음)' | '초급 (기본 툴 사용 경험 있음)' | '중급 (실무에서 일부 활용 중)' | '심화 (고급 기능 및 전사 도입 고민 중)';
  goals: string;
  questions: string;
  companionCount: number;
  agreePrivacy: boolean;
}

export interface AIGuideResponse {
  welcomeMessage: string;
  personalizedBenefit: string;
  preparationTips: string[];
  recommendedQuestions: string[];
  encouragement: string;
}

export interface RegistrationRecord {
  id: string;
  ticketNumber: string;
  seminarId: string;
  seminarTitle: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  experienceLevel: string;
  goals: string;
  questions: string;
  companionCount: number;
  submittedAt: string;
  sheetSynced: boolean;
  aiGuide: AIGuideResponse;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}
