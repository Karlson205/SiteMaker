import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Layout, FilePlus, Briefcase, ShoppingCart, Sparkles } from 'lucide-react';

const Templates = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Проверка авторизации при загрузке страницы
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);
    const templateCards = [
        {
            id: 'empty',
            title: 'Чистый холст',
            description: 'Полная свобода действий. Начните проектирование абсолютно с нуля, настраивая геометрию и стили под себя.',
            icon: <FilePlus size={20} />,
            badge: 'Базовый',
            renderThumbnail: () => (
                <div className="w-full h-full bg-white transition-colors group-hover:bg-slate-50/50" />
            )
        },
        {
            id: 'landing',
            title: 'Бизнес-Лендинг',
            description: 'Готовый конверсионный блок: адаптивный заголовок, фирменный разделитель, промо-видео и яркая CTA-кнопка.',
            icon: <Layout size={20} />,
            badge: 'Популярно',
            renderThumbnail: () => (
                <img 
                    src="/fortgit/1.png" 
                    alt="Бизнес-Лендинг" 
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" 
                />
            )
        },
        {
            id: 'portfolio',
            title: 'Портфолио специалиста',
            description: 'Идеально для дизайнеров и фрилансеров. Аватар автора, сетка выполненных работ и рабочая форма обратной связи.',
            icon: <Briefcase size={20} />,
            badge: 'Креативный',
            renderThumbnail: () => (
                <img 
                    src="/fortgit/2.png" 
                    alt="Портфолио специалиста" 
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" 
                />
            )
        },
        {
            id: 'showcase',
            title: 'Витрина / Товар',
            description: 'Карточка продукта для быстрых продаж. Фокус на изображении, стоимости, детальном описании и кнопке покупки в один клик.',
            icon: <ShoppingCart size={20} />,
            badge: 'E-commerce',
            renderThumbnail: () => (
                <img 
                    src="/fortgit/3.png" 
                    alt="Витрина / Товар" 
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" 
                />
            )
        }
    ];

    const handleSelectTemplate = () => {
        if (isLoggedIn) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-[#f4fbf8] text-slate-900 font-sans overflow-x-hidden flex flex-col justify-between">
            
            {/* --- HEADER --- */}
            <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-[100]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                            <span className="text-white font-black text-xl italic">GB</span>
                        </div>
                        <span className="font-black text-xl tracking-tighter text-emerald-950">GREENBUILD</span>
                    </div>

                    <nav className="hidden lg:flex items-center gap-8">
                        {['О проекте', 'Шаблоны', 'Связь'].map((item) => (
                            <button 
                                key={item} 
                                onClick={() => item === 'Шаблоны' ? navigate('/templates') : item === 'О проекте' ? navigate('/about') : navigate('/')}
                                className={`text-[11px] font-black uppercase tracking-widest transition-colors ${item === 'Шаблоны' ? 'text-emerald-600' : 'text-slate-500 hover:text-emerald-600'}`}
                            >
                                {item}
                            </button>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            <div className="hidden sm:flex items-center gap-3">
                                <button 
                                    onClick={() => navigate('/dashboard')}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95"
                                >
                                    МОИ ПРОЕКТЫ
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => navigate('/login')} className="hidden sm:block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95">
                                Войти
                            </button>
                        )}
                        
                        <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top">
                        {isLoggedIn ? (
                            <>
                                <button onClick={() => navigate('/dashboard')} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black uppercase tracking-widest">
                                    Мои проекты
                                </button>
                                <button onClick={() => navigate('/dashboard')} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-600">
                                    Профиль
                                </button>
                            </>
                        ) : (
                            <button onClick={() => navigate('/login')} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black uppercase tracking-widest">
                                Войти
                            </button>
                        )}
                    </div>
                )}
            </header>

            {/* --- ОСНОВНОЙ КОНТЕНТ --- */}
            <main className="flex-grow max-w-7xl w-full mx-auto px-6 pt-36 pb-16 space-y-12">
                
                <div className="text-center max-w-2xl mx-auto space-y-3">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                        <Sparkles size={12} className="fill-emerald-800" /> Готовые решения
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-emerald-950 tracking-tighter uppercase">Библиотека макетов</h1>
                    <p className="text-[#52786c] text-sm font-medium leading-relaxed">
                        Все структуры полностью адаптивны и включают независимые конфигурации для экранов Desktop, Tablet и Mobile. Выберите подходящий старт для вашей идеи.
                    </p>
                </div>

                {/* Сетка шаблонов */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    {templateCards.map((template) => (
                        <div 
                            key={template.id} 
                            className="group bg-white border border-slate-100 rounded-[32px] transition-all shadow-sm hover:shadow-xl hover:-translate-y-0.5 flex flex-col overflow-hidden h-[420px]"
                        >
                            {/* Контейнер для превью */}
                            <div className="bg-slate-100 h-48 border-b border-slate-100 flex items-center justify-center overflow-hidden relative">
                                {template.renderThumbnail()}
                                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-emerald-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl shadow-sm border border-slate-100/50 z-10">
                                    {template.badge}
                                </span>
                            </div>
                            
                            {/* Описание и Кнопка */}
                            <div className="flex-1 p-6 flex flex-col justify-between bg-white space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                                            {template.icon}
                                        </div>
                                        <h3 className="font-bold text-emerald-950 text-lg tracking-tight group-hover:text-emerald-700 transition-colors">
                                            {template.title}
                                        </h3>
                                    </div>
                                    <p className="text-slate-500 text-xs font-medium leading-relaxed line-clamp-3">
                                        {template.description}
                                    </p>
                                </div>
                                
                                <button 
                                    onClick={handleSelectTemplate}
                                    className="w-full bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-600 hover:text-white text-emerald-950 font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition-all active:scale-[0.98]"
                                >
                                    Использовать макет
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* --- FOOTER --- */}
            <footer className="bg-emerald-950 py-12 md:py-20 px-6 text-white text-center md:text-left shrink-0">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center italic font-black">GB</div>
                            <span className="font-black text-xl">GREENBUILD</span>
                        </div>
                        <p className="text-emerald-400 text-xs uppercase font-black tracking-widest">Build the future</p>
                    </div>
                    <div className="grid grid-cols-2 gap-8 md:col-span-2">
                        <div className="space-y-4 text-sm font-bold text-emerald-100/40 uppercase tracking-tighter">
                            <p className="text-emerald-500">Продукт</p>
                            <p className="hover:text-white cursor-pointer transition-colors">Функции</p>
                            <p className="hover:text-white cursor-pointer transition-colors">Цены</p>
                        </div>
                        <div className="space-y-4 text-sm font-bold text-emerald-100/40 uppercase tracking-tighter">
                            <p className="text-emerald-500">Компания</p>
                            <p className="hover:text-white cursor-pointer transition-colors">О нас</p>
                            <p className="hover:text-white cursor-pointer transition-colors">Помощь</p>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default Templates;