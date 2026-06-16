export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'cleansers' | 'serums' | 'moisturizers' | 'sunscreen' | 'masks';
  description: string;
  longDescription: string;
  ingredients: string[];
  skinType: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  usageTips: string;
  benefits: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface QuizAnswers {
  skinType: string;
  primaryConcern: string;
  sensitivities: string;
  routineCommitment: string;
  ageGroup: string;
}

export interface QuizResult {
  summary: string;
  dailyRoutine: {
    morning: { stepName: string; purpose: string; instructions: string }[];
    night: { stepName: string; purpose: string; instructions: string }[];
  };
  lifestyleAdvice: string[];
}
