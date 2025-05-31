import { useMutation, useQueryClient } from "react-query";
import { updatePost, deletePost } from "../api/postApi";
import { message } from "antd";
import { Post } from "../types";

export const usePostMutations = (postId: string) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    (updatedPost: Post) => updatePost(postId, updatedPost),
    {
      onSuccess: () => {
        message.success("Пост успешно обновлен");
        queryClient.invalidateQueries("posts");
      },
      onError: (error: any) => {
        message.error(`Ошибка при обновлении: ${error.message}`);
      },
    }
  );

  const deleteMutation = useMutation(() => deletePost(postId), {
    onSuccess: () => {
      message.success("Пост успешно удален");
      queryClient.invalidateQueries("posts");
    },
    onError: (error: any) => {
      message.error(`Ошибка при удалении: ${error.message}`);
    },
  });

  return { updateMutation, deleteMutation };
};
