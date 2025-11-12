import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import funcUrls from '../../backend/func2url.json';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  content: string;
  source: string;
  url: string;
  image_url: string;
  published_at: string;
  telegram_posted: boolean;
}

export default function Index() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [posting, setPosting] = useState<number | null>(null);
  const { toast } = useToast();

  const loadNews = async () => {
    try {
      const response = await fetch(funcUrls['news-list']);
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить новости',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async (category: string = 'general') => {
    setFetching(true);
    try {
      const response = await fetch(`${funcUrls['news-fetch']}?category=${category}`);
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Успешно!',
          description: `Загружено ${data.inserted} новых статей`,
        });
        await loadNews();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить новости из источника',
        variant: 'destructive',
      });
    } finally {
      setFetching(false);
    }
  };

  const postToTelegram = async (newsId: number) => {
    setPosting(newsId);
    try {
      const response = await fetch(funcUrls['telegram-post'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ news_id: newsId }),
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Опубликовано!',
          description: 'Новость отправлена в Telegram канал',
        });
        await loadNews();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось опубликовать в Telegram',
        variant: 'destructive',
      });
    } finally {
      setPosting(null);
    }
  };

  useEffect(() => {
    loadNews();
  }, []);

  const categories = [
    { id: 'general', name: 'Общие', icon: 'Globe' },
    { id: 'technology', name: 'Технологии', icon: 'Cpu' },
    { id: 'business', name: 'Бизнес', icon: 'TrendingUp' },
    { id: 'entertainment', name: 'Развлечения', icon: 'Film' },
    { id: 'sports', name: 'Спорт', icon: 'Trophy' },
    { id: 'science', name: 'Наука', icon: 'Microscope' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Newspaper" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold">Новостной портал</h1>
            </div>
            <Button onClick={() => fetchNews()} disabled={fetching}>
              <Icon name="RefreshCw" className={`mr-2 ${fetching ? 'animate-spin' : ''}`} size={18} />
              {fetching ? 'Загрузка...' : 'Обновить новости'}
            </Button>
          </div>
        </div>
      </header>

      <section className="py-6 bg-white border-b">
        <div className="container mx-auto px-4">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">Категории</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant="outline"
                size="sm"
                onClick={() => fetchNews(cat.id)}
                disabled={fetching}
                className="flex-shrink-0"
              >
                <Icon name={cat.icon} className="mr-2" size={16} />
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Icon name="Loader2" className="animate-spin text-primary" size={40} />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-20">
            <Icon name="Inbox" className="mx-auto mb-4 text-muted-foreground" size={48} />
            <h3 className="text-xl font-semibold mb-2">Новостей пока нет</h3>
            <p className="text-muted-foreground mb-6">Нажмите "Обновить новости" для загрузки</p>
            <Button onClick={() => fetchNews()}>
              <Icon name="Download" className="mr-2" size={18} />
              Загрузить новости
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in flex flex-col"
              >
                {item.image_url && (
                  <div className="aspect-video overflow-hidden bg-slate-100">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <CardContent className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Icon name="Clock" size={14} />
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'Недавно'}
                    {item.source && (
                      <>
                        <span>•</span>
                        <span>{item.source}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                    {item.description}
                  </p>
                  <div className="flex gap-2 pt-3 border-t">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <Icon name="ExternalLink" className="mr-2" size={14} />
                        Читать
                      </a>
                    </Button>
                    <Button
                      variant={item.telegram_posted ? 'secondary' : 'default'}
                      size="sm"
                      onClick={() => postToTelegram(item.id)}
                      disabled={posting === item.id || item.telegram_posted}
                      className="flex-1"
                    >
                      {posting === item.id ? (
                        <Icon name="Loader2" className="mr-2 animate-spin" size={14} />
                      ) : (
                        <Icon name="Send" className="mr-2" size={14} />
                      )}
                      {item.telegram_posted ? 'Опубликовано' : 'В Telegram'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">© 2024 Новостной портал. Автоматическая публикация в Telegram.</p>
        </div>
      </footer>
    </div>
  );
}
