// src/components/PostRow/PostRow.tsx
import React, { useState } from "react";
import { Button, Input, Space, Popconfirm } from "antd";
import { Post, PostRowProps } from "../../types";
import { usePostMutations } from "../../hooks/usePostMutations";

export const PostRow: React.FC<PostRowProps> = ({ post, extraFields }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Post>(post);
  const { updateMutation, deleteMutation } = usePostMutations(post.id);

  const handleSave = () => {
    updateMutation.mutate(formData);
    setEditing(false);
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
