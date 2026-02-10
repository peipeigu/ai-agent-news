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

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days} 天前`;
  if (hours > 0) return `${hours} 小时前`;
  if (minutes > 0) return `${minutes} 分钟前`;
  return "刚刚";
}

function getDomain(url: string | null): string {
  if (!url) return "news.ycombinator.com";
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return "news.ycombinator.com";
  }
}

export default async function Home() {
  const articles = await fetchAIAgentNews();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">AI Agent News</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                来自 Hacker News 的最新 AI Agent 资讯
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
            每 5 分钟更新
          </span>
        </div>
      </header>

      {/* Article List */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <ol className="space-y-1">
          {articles.map((article, index) => {
            const hnUrl = `https://news.ycombinator.com/item?id=${article.objectID}`;
            const linkUrl = article.url || hnUrl;
            const domain = getDomain(article.url);

            return (
              <li
                key={article.objectID}
                className="group flex gap-3 sm:gap-4 py-3 px-3 sm:px-4 -mx-3 sm:-mx-4 rounded-lg hover:bg-white dark:hover:bg-slate-800/50 transition-colors"
              >
                {/* Rank */}
                <span className="text-sm font-mono text-slate-400 dark:text-slate-500 pt-0.5 w-6 text-right shrink-0">
                  {index + 1}
                </span>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <a
                      href={linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[15px] font-medium leading-snug text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors"
                    >
                      {article.title}
                    </a>
                    <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 pt-1 hidden sm:inline">
                      ({domain})
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3l7.5 7.5m-15 0V21h4.5v-6h6v6H19.5V10.5" />
                      </svg>
                      {article.points} 分
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0" />
                      </svg>
                      {article.author}
                    </span>
                    <a
                      href={hnUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                      </svg>
                      {article.num_comments} 评论
                    </a>
                    <span className="text-slate-400 dark:text-slate-500">
                      {timeAgo(article.created_at)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
          数据来源：
          <a
            href="https://hn.algolia.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            Hacker News (Algolia API)
          </a>
          {" · "}
          使用 Next.js 构建，部署于 Vercel
        </div>
      </footer>
    </div>
  );
}
