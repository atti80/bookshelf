import axios from "axios";

const WORDPRESS_API_URL = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2`;

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  image: string | null;
  isLiked: boolean;
}

export interface PostDetails {
  id: number;
  title: string;
  content: string;
  publishedAt: Date | null;
  author: string | null;
  categories: {
    id: number;
    name: string;
  }[];
  tags: {
    id: number;
    name: string;
  }[];
  isLiked: boolean;
  comments: {
    userId: number;
    articleId: number;
    createdAt: Date | null;
    content: string | null;
  }[];
}

export const fetchPosts = async (
  page: number = 1,
  perPage: number = 10,
  categoryId?: number,
  tagId?: number,
  searchText?: string,
  postIds?: number[]
): Promise<{ posts: Post[]; count: number }> => {
  try {
    const params = {
      page: page,
      per_page: perPage,
      ...(categoryId && { categories: categoryId }),
      ...(tagId && { tags: tagId }),
      ...(searchText && { search: searchText }),
      ...(postIds && { include: postIds.join(",") }),
    };
    const response = await axios.get(`${WORDPRESS_API_URL}/posts`, {
      params,
    });

    const featuredMediaIds = response.data.map((post: any) => ({
      id: post.id,
      mediaId: post.featured_media,
    }));

    const media = await axios.get(`${WORDPRESS_API_URL}/media`, {
      params: {
        include: featuredMediaIds.map((p: any) => p.mediaId).join(","),
        per_page: 100,
      },
    });

    const posts: Post[] = response.data.map((post: any) => ({
      id: post.id,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      image:
        media.data.find((m: any) => m.id === post.featured_media)?.source_url ||
        null,
      isLiked: false,
    }));

    return { posts, count: parseInt(response.headers["x-wp-total"]) };
  } catch (error) {
    console.error("Error fetching WordPress posts:", error);
    throw error;
  }
};

export const fetchPostDetails = async (
  postId: number
): Promise<PostDetails> => {
  try {
    const response = await axios.get(`${WORDPRESS_API_URL}/posts/${postId}`);
    const post = response.data;

    const user = await fetchUserById(post.author);
    const categories = await fetchCategoryByIds(post.categories);
    const tags = await fetchTagsByIds(post.tags);

    return {
      id: post.id,
      title: post.title.rendered,
      content: post.content.rendered,
      publishedAt: post.date_gmt,
      author: user.name,
      categories: categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
      })),
      tags: tags.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
      })),
      isLiked: false,
      comments: [],
    };
  } catch (error) {
    console.error("Error fetching WordPress post details:", error);
    throw error;
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${WORDPRESS_API_URL}/categories`, {
      params: {
        per_page: 100,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching WordPress categories:", error);
    throw error;
  }
};

export const fetchCategoryByIds = async (categoryIds: number[]) => {
  try {
    const response = await axios.get(`${WORDPRESS_API_URL}/categories`, {
      params: {
        include: categoryIds.join(","),
        per_page: 100,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

export const fetchTags = async () => {
  try {
    const response = await axios.get(`${WORDPRESS_API_URL}/tags`);
    return response.data;
  } catch (error) {
    console.error("Error fetching WordPress tags:", error);
    throw error;
  }
};

const fetchTagsByIds = async (tagIds: number[]) => {
  try {
    const response = await axios.get(`${WORDPRESS_API_URL}/tags`, {
      params: {
        include: tagIds.join(","),
        per_page: 100,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

const fetchUsers = async () => {
  try {
    const response = await axios.get(`${WORDPRESS_API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const fetchUserById = async (id: number) => {
  try {
    const response = await axios.get(`${WORDPRESS_API_URL}/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
