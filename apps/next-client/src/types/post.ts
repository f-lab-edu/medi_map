
export type Params = {
  id: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  userId: string;
  createdAt: string;
  author: string;
};

export type Comment = {
  id: number;
  content: string;
  userId: string;
  createdAt: string;
  author: string;
};

