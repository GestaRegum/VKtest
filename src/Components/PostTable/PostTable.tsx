import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Spin } from "antd";
import { PostRow } from "../PostRow";
import { Post } from "../../types";
import { usePosts } from "../../hooks/usePosts";
import { getAllFields, getAdditionally } from "../../utils/postUtils";

export const PostTable = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = usePosts();

  const posts = data?.pages.flat() || [];
  const extraFields = getAllFields(posts);
  const addFields = getAdditionally(posts);

  if (isLoading) return <Spin size="large" />;
  if (isError)
    return (
      <div>
        <p>Ошибка загрузки: {(error as Error).message}</p>
        <Button type="primary" onClick={() => refetch()}>
          Попробовать снова
        </Button>
      </div>
    );

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchNextPage}
      hasMore={!!hasNextPage}
      loader={<Spin />}
      endMessage={<p>Вы просмотрели все посты</p>}
      style={{ overflowY: "hidden" }}
    >
      <table>
        <thead>
          <tr>
            <th>Заголовок</th>
            <th>Просмотры</th>
            <th>Автор</th>
            <th>Категория</th>
            <th>Статус</th>
            <th>Комментарий</th>
            {addFields.map((field) => (
              <th key={field}>{field}</th>
            ))}
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post: Post) => (
            <PostRow key={post.id} post={post} extraFields={extraFields} />
          ))}
        </tbody>
      </table>
    </InfiniteScroll>
  );
};
