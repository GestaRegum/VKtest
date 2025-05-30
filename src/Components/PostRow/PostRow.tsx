import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { Button, Input, Space, Popconfirm, message } from "antd";
import { API_URL } from "../../config";
import { Post, PostRowProps } from "../types";

export const PostRow: React.FC<PostRowProps> = ({ post, extraFields }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Post>(post);
  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    (updatedPost: Post) =>
      axios.put(`${API_URL}/posts/${post.id}`, updatedPost),
    {
      onSuccess: () => {
        message.success("Пост успешно обновлен");
        queryClient.invalidateQueries("posts");
        setEditing(false);
      },
      onError: (error: any) => {
        message.error(`Ошибка при обновлении: ${error.message}`);
      },
    }
  );

  const deleteMutation = useMutation(
    () => axios.delete(`${API_URL}/posts/${post.id}?_dependent=comments`),
    {
      onSuccess: () => {
        message.success("Пост успешно удален");
        queryClient.invalidateQueries("posts");
      },
      onError: (error: any) => {
        message.error(`Ошибка при удалении: ${error.message}`);
      },
    }
  );

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData(post);
    setEditing(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (editing) {
    return (
      <tr>
        {extraFields.map((field) => (
          <td key={field}>
            <Input
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData({ ...formData, [field]: e.target.value })
              }
            />
          </td>
        ))}
        <td>
          <Space>
            <Button onClick={handleSave} loading={updateMutation.isLoading}>
              Сохранить
            </Button>
            <Button onClick={handleCancel}>Отмена</Button>
          </Space>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      {extraFields.map((field) => (
        <td key={field}>{post[field] || "-"}</td>
      ))}
      <td>
        <Space>
          <Button onClick={() => setEditing(true)}>Редактировать</Button>
          <Popconfirm
            title="Удалить этот пост?"
            onConfirm={handleDelete}
            okText="Да"
            cancelText="Нет"
          >
            <Button danger loading={deleteMutation.isLoading}>
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      </td>
    </tr>
  );
};
