export type OgCardType = "tool" | "blog" | "home";

export interface OgCardData {
  type: OgCardType;
  title: string;
  category: string;
  description?: string;
  inputFormat?: string;
  outputFormat?: string;
  readTimeMinutes?: number;
  badges: string[];
  locale: "en" | "fr";
}
