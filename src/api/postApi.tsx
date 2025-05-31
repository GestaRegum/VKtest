import axios from "axios";
import { API_URL } from "../config";
import { Post, PostInput } from "../types";

export const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const res = await axios.get(`${API_URL}/posts`, {
    params: {
      _page: pageParam,
      _limit: 10,
    },
  });
  return res.data as Post[];
};

export const updatePost = (postId: string, updatedPost: Post) => {
  return axios.put(`${API_URL}/posts/${postId}`, updatedPost);
};

export const deletePost = (postId: string) => {
  return axios.delete(`${API_URL}/posts/${postId}?_dependent=comments`);
};

export const createPost = (newPost: PostInput) => {
  return axios.post(`${API_URL}/posts`, newPost);
};
