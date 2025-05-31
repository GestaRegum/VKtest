import { useMutation, useQueryClient } from "react-query";
import { createPost } from "../api/postApi";
import { message } from "antd";
import { PostInput } from "../types";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation((newPost: PostInput) => createPost(newPost), {
    onSuccess: () => {
      message.success("Пост успешно создан!");
      queryClient.invalidateQueries("posts");
    },
    onError: (error: any) => {
      message.error(
        `Ошибка при создании поста: ${
          error.response?.data?.message || error.message
        }`
      );
    },
  });
};
