import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const phoneNumber = '89146666764';
  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  const telUrl = `tel:${phoneNumber}`;

  const services = [
    {
      icon: 'Sparkles',
      title: 'Глянцевые потолки',
      description: 'Визуально увеличивают пространство, создают эффект зеркальной поверхности',
    },
    {
      icon: 'Moon',
      title: 'Матовые потолки',
      description: 'Классический вариант с элегантной текстурой, скрывает неровности основного потолка',
    },
    {
      icon: 'Layers',
      title: 'Многоуровневые конструкции',
      description: 'Создание уникального дизайна с использованием нескольких уровней и подсветки',
    },
    {
      icon: 'Star',
      title: 'Звездное небо',
      description: 'Светодиодная подсветка, имитирующая ночное небо с мерцающими звездами',
    },
  ];

  const gallery = [
    {
      url: 'https://cdn.poehali.dev/projects/f53b5bea-76e3-46c2-a3df-d5e08f4018fb/files/450733d0-0a0a-4adb-b5cb-0d6ae05578c7.jpg',
      title: 'Гостиная',
    },
    {
      url: 'https://cdn.poehali.dev/projects/f53b5bea-76e3-46c2-a3df-d5e08f4018fb/files/19351505-f720-4928-afb8-846871bfa4a7.jpg',
      title: 'Спальня',
    },
    {
      url: 'https://cdn.poehali.dev/projects/f53b5bea-76e3-46c2-a3df-d5e08f4018fb/files/de6d7c44-5ae5-446c-8342-6b2e52385f13.jpg',
      title: 'Кухня',
    },
  ];

  const advantages = [
    { icon: 'Clock', text: 'Монтаж за 1 день' },
    { icon: 'Shield', text: 'Гарантия 10 лет' },
    { icon: 'Award', text: 'Опыт более 5 лет' },
    { icon: 'Zap', text: 'Без пыли и грязи' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="container mx-auto px-4 text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6">
            Натяжные потолки
            <span className="block text-primary mt-2">в Артёме</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Профессиональный монтаж натяжных потолков любой сложности. 
            Превратим ваш потолок в произведение искусства.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <a href={telUrl}>
                <Icon name="Phone" className="mr-2" size={20} />
                Позвонить сейчас
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6">
              <a href="#services">
                Узнать больше
              </a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-6">
            {advantages.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-muted-foreground">
                <Icon name={item.icon} size={20} className="text-primary" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Наши услуги</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Предлагаем широкий выбор натяжных потолков для любого интерьера
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in border-0 shadow-lg"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name={service.icon} size={32} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">Наши работы</h2>
          <p className="text-center text-muted-foreground mb-12 text-lg">
            Примеры выполненных проектов
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {gallery.map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in aspect-[4/3]"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white text-xl font-semibold p-6">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Свяжитесь с нами</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Готовы обсудить ваш проект? Звоните или пишите в WhatsApp!
            </p>
            <Card className="p-8 shadow-xl border-0 bg-slate-50">
              <CardContent className="space-y-6">
                <div className="flex items-center justify-center gap-3 text-2xl font-semibold">
                  <Icon name="Phone" size={28} className="text-primary" />
                  <a href={telUrl} className="hover:text-primary transition-colors">
                    8 (914) 666-67-64
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" className="text-lg px-8">
                    <a href={telUrl}>
                      <Icon name="Phone" className="mr-2" size={20} />
                      Позвонить
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="text-lg px-8 border-2">
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <Icon name="MessageCircle" className="mr-2" size={20} />
                      Написать в WhatsApp
                    </a>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Город Артём, Приморский край
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <button
        onClick={() => setShowWhatsApp(!showWhatsApp)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50"
        aria-label="WhatsApp"
      >
        <Icon name="MessageCircle" size={28} />
      </button>

      {showWhatsApp && (
        <div className="fixed bottom-24 right-6 bg-white rounded-lg shadow-2xl p-4 animate-scale-in z-50 border">
          <p className="text-sm font-semibold mb-3">Связаться с нами</p>
          <div className="flex flex-col gap-2">
            <Button asChild size="sm" className="w-full">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Icon name="MessageCircle" className="mr-2" size={16} />
                Написать
              </a>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={telUrl}>
                <Icon name="Phone" className="mr-2" size={16} />
                Позвонить
              </a>
            </Button>
          </div>
        </div>
      )}

      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400">
            © 2024 Натяжные потолки в Артёме. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}
