import { create } from "zustand";
import { Post, PostStatus, Platform } from "@/types";
import { initialSocialPosts } from "@/lib/data/social";

interface SocialMediaStore {
  posts: Record<Platform, Post[]>;
  activePlatform: Platform;
  setActivePlatform: (platform: Platform) => void;
  addPost: (platform: Platform, post: Omit<Post, "id">) => void;
  updatePost: (platform: Platform, id: string, updates: Partial<Post>) => void;
  deletePost: (platform: Platform, id: string) => void;
  getPostsByStatus: (platform: Platform, status: PostStatus) => Post[];
}

export const useSocialMediaStore = create<SocialMediaStore>((set, get) => ({
  posts: initialSocialPosts,
  activePlatform: "instagram",
  setActivePlatform: (platform) => set({ activePlatform: platform }),
  addPost: (platform, post) =>
    set((state) => ({
      posts: {
        ...state.posts,
        [platform]: [
          {
            ...post,
            id: `${platform.slice(0, 2)}-${Date.now()}`,
          },
          ...state.posts[platform],
        ],
      },
    })),
  updatePost: (platform, id, updates) =>
    set((state) => ({
      posts: {
        ...state.posts,
        [platform]: state.posts[platform].map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      },
    })),
  deletePost: (platform, id) =>
    set((state) => ({
      posts: {
        ...state.posts,
        [platform]: state.posts[platform].filter((p) => p.id !== id),
      },
    })),
  getPostsByStatus: (platform, status) => {
    return get().posts[platform].filter((p) => p.status === status);
  },
}));
