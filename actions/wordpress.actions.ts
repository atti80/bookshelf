const WORDPRESS_API_URL = `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2`;
const REVALIDATE_SECONDS = 3600;

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

export async function fetchPosts(
  page: number = 1,
  perPage: number = 10,
  categoryId?: number,
  tagId?: number,
  searchText?: string,
  postIds?: number[]
): Promise<{ posts: Post[]; count: number }> {
  try {
    if (postIds && !postIds.length) return { posts: [], count: 0 };

    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
      ...(categoryId ? { categories: categoryId.toString() } : {}),
      ...(tagId ? { tags: tagId.toString() } : {}),
      ...(searchText ? { search: searchText } : {}),
      ...(postIds ? { include: postIds.join(",") } : {}),
    });

    const res = await fetch(`${WORDPRESS_API_URL}/posts?${params}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) throw new Error("Failed to fetch posts");
    const data = await res.json();

    if (!data.length) return { posts: [], count: 0 };

    const featuredMediaIds = data
      .map((post: any) => post.featured_media)
      .filter(Boolean); // removes all falsy values

    const mediaParams = new URLSearchParams({
      include: featuredMediaIds.join(","),
      per_page: featuredMediaIds.length.toString(),
    });
    const mediaRes = await fetch(`${WORDPRESS_API_URL}/media?${mediaParams}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!mediaRes.ok) throw new Error("Failed to fetch media");
    const media = await mediaRes.json();

    // Map posts
    const posts: Post[] = data.map((post: any) => ({
      id: post.id,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      image:
        media.find((m: any) => m.id === post.featured_media)?.source_url ||
        null,
      isLiked: false,
    }));

    return { posts, count: parseInt(res.headers.get("x-wp-total") ?? "0") };
  } catch (error) {
    console.error("Error fetching WordPress posts:", error);
    throw error;
  }
}

export const fetchPostDetails = async (
  postId: number
): Promise<PostDetails> => {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/posts/${postId}?_embed`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!res.ok) throw new Error("Failed to fetch post details");
    const post = await res.json();

    let categories: { id: number; name: string }[] = [];
    let tags: { id: number; name: string }[] = [];

    if (post._embedded["wp:term"].length > 0) {
      if (post._embedded["wp:term"][0].length > 0) {
        if (post._embedded["wp:term"][0][0].taxonomy === "category") {
          categories = post._embedded["wp:term"][0].map((category: any) => {
            return {
              id: category.id,
              name: category.name,
            };
          });
        }
      }
    }

    if (post._embedded["wp:term"].length > 1) {
      if (post._embedded["wp:term"][1].length > 0) {
        if (post._embedded["wp:term"][1][0].taxonomy === "post_tag") {
          tags = post._embedded["wp:term"][1].map((tag: any) => {
            return {
              id: tag.id,
              name: tag.name,
            };
          });
        }
      }
    }

    return {
      id: post.id,
      title: post.title.rendered,
      content: post.content.rendered,
      publishedAt: post.date_gmt,
      author: post._embedded.author[0].name,
      categories: categories,
      tags: tags,
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
    const res = await fetch(`${WORDPRESS_API_URL}/categories?per_page=100`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) throw new Error("Failed to fetch WordPress categories");

    return res.json();
  } catch (error) {
    console.error("Error fetching WordPress categories:", error);
    throw error;
  }
};

const fetchCategoryByIds = async (categoryIds: number[]) => {
  try {
    const params = new URLSearchParams({
      include: categoryIds.join(","),
      per_page: "100",
    });

    const res = await fetch(`${WORDPRESS_API_URL}/categories?${params}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) throw new Error("Failed to fetch categories by IDs");

    return res.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

export const fetchTags = async () => {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/tags?per_page=100`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) throw new Error("Failed to fetch WordPress tags");

    return res.json();
  } catch (error) {
    console.error("Error fetching WordPress tags:", error);
    throw error;
  }
};

export const fetchTagsByIds = async (tagIds: number[]) => {
  try {
    const params = new URLSearchParams({
      include: tagIds.join(","),
      per_page: "100",
    });

    const res = await fetch(`${WORDPRESS_API_URL}/tags?${params}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!res.ok) throw new Error("Failed to fetch tags by IDs");

    return res.json();
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw error;
  }
};

const fetchUserById = async (id: number) => {
  try {
    const res = await fetch(`${WORDPRESS_API_URL}/users/${id}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125 Safari/537.36",
        Accept: "application/json, text/plain, */*",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch users by IDs");

    return res.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
