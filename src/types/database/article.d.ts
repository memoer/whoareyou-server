export interface Basic {
  id: number;
  content: string;
  creator: string;
  createdAt: string;
}

export interface OnlyCreator {
  creator: number;
}
