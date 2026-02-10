export type Locale = "zh" | "en";

export const translations = {
  zh: {
    siteTitle: "AI Agent News",
    siteDescription: "来自 Hacker News 的最新 AI Agent 资讯",
    updateInterval: "每 5 分钟更新",
    points: "分",
    comments: "评论",
    timeAgo: {
      justNow: "刚刚",
      minutesAgo: (n: number) => `${n} 分钟前`,
      hoursAgo: (n: number) => `${n} 小时前`,
      daysAgo: (n: number) => `${n} 天前`,
    },
    footer: {
      dataSource: "数据来源：",
      builtWith: "使用 Next.js 构建，部署于 Vercel",
    },
  },
  en: {
    siteTitle: "AI Agent News",
    siteDescription: "Latest AI Agent news from Hacker News",
    updateInterval: "Updates every 5 min",
    points: "pts",
    comments: "comments",
    timeAgo: {
      justNow: "just now",
      minutesAgo: (n: number) => `${n}m ago`,
      hoursAgo: (n: number) => `${n}h ago`,
      daysAgo: (n: number) => `${n}d ago`,
    },
    footer: {
      dataSource: "Data from: ",
      builtWith: "Built with Next.js, deployed on Vercel",
    },
  },
} as const;

export type Translations = typeof translations[Locale];
