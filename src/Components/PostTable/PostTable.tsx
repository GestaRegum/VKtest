import React, { useMemo } from "react";
import { useInfiniteQuery } from "react-query";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { Button, Spin } from "antd";
import { PostRow } from "../PostRow";
import { API_URL } from "../../config";
import { Post } from "../types";
import styles from "./PostTable.module.css";

const fetchPosts = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const res = await axios.get(`${API_URL}/posts`, {
    params: {
      _page: pageParam,
      _limit: 10,
    },
  });
  return res.data as Post[];
};

export const PostTable = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery("posts", fetchPosts, {
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 10 ? pages.length + 1 : undefined;
    },
  });

  const getAllFields = (posts: Post[]) => {
    const fields = new Set<string>();
    posts.forEach((post) => {
      Object.keys(post).forEach((key) => {
        if (!["id"].includes(key)) {
          fields.add(key);
        }
      });
    });
    return Array.from(fields);
  };

  const getAdditionally = (posts: Post[]) => {
    const fields = new Set<string>();
    posts.forEach((post) => {
      Object.keys(post).forEach((key) => {
        if (
          ![
            "id",
            "title",
            "views",
            "author",
            "category",
            "status",
            "comments",
          ].includes(key)
        ) {
          fields.add(key);
        }
      });
    });
    return Array.from(fields);
  };

  const posts = data?.pages.flat() || [];
  const extraFields = getAllFields(posts);
  const addFields = getAdditionally(posts);

  if (isLoading) return <Spin tip="Загрузка постов..." size="large" />;
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
