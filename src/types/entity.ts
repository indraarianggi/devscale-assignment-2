export interface IBook {
  _id: string;
  title: string;
  author: string;
  genre: string;
  review: string;
  rating: number;
  progress: number;
  is_completed: number;
  photo: string;
  highlight: number;
  createdAt: number;
  updatedAt: number;
}
