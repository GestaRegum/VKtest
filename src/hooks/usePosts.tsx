// src/hooks/usePosts.ts
import { useInfiniteQuery } from "react-query";
import { fetchPosts } from "../api/postApi";

export const usePosts = () => {
  return useInfiniteQuery("posts", fetchPosts, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 10 ? pages.length + 1 : undefined;
    },
  });
};
