import React, { useEffect, useState } from 'react';
import { Rss, ExternalLink } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source?: string;
}

export function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const rssUrl = encodeURIComponent('https://news.google.com/rss/search?q=2026+FIFA+World+Cup&hl=en-US&gl=US&ceid=US:en');
        const res = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
        const data = await res.json();
        
        if (data.status === 'ok') {
          setNews(data.items.slice(0, 5).map((item: any) => ({
            title: item.title,
            link: item.link,
            pubDate: new Date(item.pubDate).toLocaleDateString(),
          })));
        }
      } catch (e) {
        console.error("Failed to fetch news", e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  if (loading || news.length === 0) return null;

  return (
    <div className="bg-yellow-500 text-black overflow-hidden flex items-center border-y border-yellow-600/50 sticky top-[72px] z-40">
      <div className="bg-black text-yellow-500 font-black uppercase tracking-widest px-4 py-1.5 text-xs flex items-center gap-2 shrink-0 border-r border-yellow-600/50">
        <Rss className="w-4 h-4" />
        Live Updates
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] gap-12 text-sm font-medium">
          {news.map((item, i) => (
            <a 
              key={i} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline"
            >
              {item.title}
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          ))}
          {/* Duplicate for seamless looping */}
          {news.map((item, i) => (
            <a 
              key={`dup-${i}`} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:underline"
            >
              {item.title}
              <ExternalLink className="w-3 h-3 opacity-50" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
