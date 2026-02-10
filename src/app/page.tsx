import { NewsList } from "./components/NewsList";

interface HNHit {
  objectID: string;
  title: string;
  url: string | null;
  author: string;
  points: number;
  num_comments: number;
  created_at: string;
}

interface HNResponse {
  hits: HNHit[];
}

async function fetchAIAgentNews(): Promise<HNHit[]> {
  const res = await fetch(
    "https://hn.algolia.com/api/v1/search?query=AI+Agent&tags=story&hitsPerPage=10",
    { next: { revalidate: 300 } } // 5 分钟缓存
  );

  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  const data: HNResponse = await res.json();
  return data.hits;
}

export default async function Home() {
  const articles = await fetchAIAgentNews();

  return <NewsList articles={articles} />;
}
