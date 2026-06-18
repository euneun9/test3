import type { NewPost, Post } from "./types";
import { seedPosts } from "./seed";

/**
 * 데이터 레이어 (현재: localStorage)
 *
 * 추후 Supabase 연동 시 이 파일의 내부 구현만 교체하면 된다.
 * 화면 컴포넌트는 getPosts / addPost 시그니처에만 의존하므로,
 * Supabase 버전에서는 동일한 형태(또는 async 버전)로 바꿔주면 끝.
 *
 * 예) Supabase 전환 후:
 *   export async function getPosts(): Promise<Post[]> {
 *     const { data } = await supabase
 *       .from("posts").select("*").order("created_at", { ascending: false });
 *     return data ?? [];
 *   }
 */

const STORAGE_KEY = "ai-request-board:posts";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function read(): Post[] | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Post[]) : null;
  } catch {
    return null;
  }
}

function write(posts: Post[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {
    /* 저장 실패는 조용히 무시 (용량 초과 등) */
  }
}

/** 최신순 정렬된 전체 글. 저장소가 비어 있으면 샘플 글로 초기화한다. */
export function getPosts(): Post[] {
  const stored = read();
  if (stored) return sortByNewest(stored);

  // 최초 진입: 샘플 글 주입
  write(seedPosts);
  return sortByNewest(seedPosts);
}

/** 새 글을 추가하고 저장한 뒤 생성된 글을 반환한다. */
export function addPost(input: NewPost): Post {
  const post: Post = {
    id: createId(),
    team: input.team.trim(),
    title: input.title.trim(),
    content: input.content.trim(),
    createdAt: new Date().toISOString(),
  };

  const next = [post, ...getPosts()];
  write(next);
  return post;
}

function sortByNewest(posts: Post[]): Post[] {
  return [...posts].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

function createId(): string {
  if (isBrowser() && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `post-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}
