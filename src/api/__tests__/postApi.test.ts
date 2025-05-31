import axios from "axios";
import { fetchPosts, createPost, updatePost, deletePost } from "../postApi";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Тестовые данные
const mockPost = {
  id: "1",
  title: "Test Post",
  views: 100,
  author: "John Doe",
  category: "Tech",
  status: "Published",
  comments: "who I am?",
};

describe("Post API", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. Тест успешного получения постов
  test("fetchPosts - success", async () => {
    mockedAxios.get.mockResolvedValue({ data: [mockPost] });

    const result = await fetchPosts({ pageParam: 1 });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining("/posts"),
      { params: { _page: 1, _limit: 10 } }
    );
    expect(result).toEqual([mockPost]);
  });

  // 2. Тест создания поста
  test("createPost - success", async () => {
    mockedAxios.post.mockResolvedValue({ data: mockPost });

    await createPost(mockPost);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/posts"),
      mockPost
    );
  });

  // 3. Тест обновления поста
  test("updatePost - success", async () => {
    mockedAxios.put.mockResolvedValue({ data: mockPost });

    await updatePost(mockPost.id, mockPost);

    expect(mockedAxios.put).toHaveBeenCalledWith(
      expect.stringContaining(`/posts/${mockPost.id}`),
      mockPost
    );
  });

  // 4. Тест удаления поста
  test("deletePost - success", async () => {
    mockedAxios.delete.mockResolvedValue({ data: {} });

    await deletePost(mockPost.id);

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      expect.stringContaining(`/posts/${mockPost.id}`)
    );
  });

  // 5. Тест ошибки сети
  test("fetchPosts - network error", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network Error"));

    await expect(fetchPosts({ pageParam: 1 })).rejects.toThrow("Network Error");
  });

  // 6. Тест ошибки 404
  test("fetchPosts - 404 error", async () => {
    mockedAxios.get.mockRejectedValue({
      response: { status: 404, data: { message: "Not Found" } },
    });

    await expect(fetchPosts({ pageParam: 1 })).rejects.toEqual({
      response: { status: 404, data: { message: "Not Found" } },
    });
  });
});
