import { Post } from "../types";

export const getAllFields = (posts: Post[]) => {
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

export const getAdditionally = (posts: Post[]) => {
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
