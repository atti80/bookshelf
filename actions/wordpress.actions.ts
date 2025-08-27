import axios from "axios";

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL;

export const fetchArticles = async (
  page: number = 1,
  perPage: number = 10,
  categoryId?: number,
  tagId?: number
) => {
  try {
    const params = {
      page: page,
      per_page: perPage,
      ...(categoryId && { categories: categoryId }),
      ...(tagId && { tags: tagId }),
    };
    const response = await axios.get(`${WORDPRESS_API_URL}/posts`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching WordPress posts:", error);
    throw error;
  }
};
