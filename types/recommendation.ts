import { ImageURISource } from "react-native";

export type Recommendation = {
  id: string;
  name: string;
  mediaUsername: string;
  tags: string[];
};

export type RecommendationWithImage = Recommendation & {
  backgroundImage?: ImageURISource;
};


