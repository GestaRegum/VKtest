export interface CommentType {
  id: string;
  text: string;
  postId: string;
  createdAt: string;
}

export interface CommentsProps {
  postId: string;
  initialComments?: CommentType[];
}
export interface Post {
  id: string;
  title: string;
  views: number;
  comments: string;
  [key: string]: any;
}

export interface PostRowProps {
  post: Post;
  extraFields: string[];
}

export type PostInput = {
  title: string;
  views: number;
  author: string;
  category: string;
  status: string;
  [key: string]: any;
};

export type FormValues = {
  title: string;
  views: string;
  author: string;
  category: string;
  status: string;
  [key: string]: string;
};
