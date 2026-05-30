import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Layout, Sparkles, User, CheckCircle2 } from 'lucide-react';

const About = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between overflow-x-hidden">
            
            {/* --- ШАПКА (HEADER) КАК В HOME --- */}
            <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-[100]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                            <span className="text-white font-black text-xl italic">GB</span>
                        </div>
                        <span className="font-black text-xl tracking-tighter text-emerald-950">GREENBUILD</span>
                    </div>

                    <nav className="hidden lg:flex items-center gap-8">
                        <button onClick={() => navigate('/about')} className="text-[11px] font-black uppercase tracking-widest text-emerald-600 transition-colors">
                            О проекте
                        </button>
                        <button onClick={() => navigate('/templates')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">
                            Шаблоны
                        </button>
                        <button onClick={() => navigate('/pricing')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">
                            Подписка
                        </button>
                        <button onClick={() => navigate('/contact')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">
                            Связь
                        </button>
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
                        <button onClick={() => { navigate('/about'); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-emerald-600">
                            О проекте
                        </button>
                        <button onClick={() => { navigate('/templates'); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-600">
                            Шаблоны
                        </button>
                        <button onClick={() => { navigate('/pricing'); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-600">
                            Подписка
                        </button>
                        <button onClick={() => { navigate('/contact'); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-600">
                            Связь
                        </button>
                        {isLoggedIn ? (
                            <>
                                <button onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black uppercase tracking-widest">
                                    Мои проекты
                                </button>
                                <button onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-600">
                                    Профиль
                                </button>
                            </>
                        ) : (
                            <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="w-full bg-emerald-600 text-white py-4 rounded-xl font-black uppercase tracking-widest">
                                Войти
                            </button>
                        )}
                    </div>
                )}
            </header>

            {/* --- ОСНОВНОЙ КОНТЕНТ --- */}
            <main className="flex-grow max-w-7xl w-full mx-auto px-6 py-12 space-y-12 pt-28">
                
                {/* Промо-карточка */}
                <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl border border-emerald-900/30">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative z-10 max-w-2xl space-y-4">
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-500/30 inline-block">
                            Платформа разработки v1.0
                        </span>
                        <h1 className="text-2xl md:text-4xl font-black tracking-tight uppercase">О проекте GreenBuild</h1>
                        <p className="text-slate-300 text-sm leading-relaxed font-medium">
                            GreenBuild — это инновационная Full-Stack экосистема для визуального конструирования адаптивных веб-страниц. Проект сочетает в себе абсолютную свободу кастомизации интерфейсов с мощным серверным ядром контроля доступа.
                        </p>
                    </div>
                </div>

                {/* Функциональные особенности */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-black text-emerald-950 uppercase tracking-wide">Архитектурные особенности</h2>
                        <p className="text-slate-400 text-xs font-medium mt-1">Инженерные решения и ключевые возможности системы</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-base">Визуальный редактор блоков</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Управление разметкой на лету: редактирование текстового контента, гибкая настройка шрифтов, фоновых заливок, скруглений, границ и геометрии элементов без написания CSS.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                <Layout className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-base">Матрица брейкпоинтов</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Раздельные рабочие области для конфигураций Desktop, Tablet и Mobile. Стили элементов динамически адаптируются под экраны пользователей, обеспечивая корректный рендеринг.
                            </p>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-base">Безопасность и авторизация</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Защита пользовательских сессий с помощью криптографических токенов JWT. Многоступенчатая верификация аккаунтов по одноразовым кодам подтверждения (OTP).
                            </p>
                        </div>

                        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3 hover:shadow-md transition-shadow">
                            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-800 text-base">Управление приватностью страниц</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Тонкая настройка видимости сгенерированных сайтов: полный публичный доступ для всех гостей интернета, просмотр только авторизованными пользователями или приватный режим автора.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Инженерный стек */}
                <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-emerald-950 uppercase tracking-widest">Инженерный стек проекта</h3>
                    <div className="flex flex-wrap gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
                        <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">React 18</span>
                        <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">Tailwind CSS</span>
                        <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">Node.js / Express</span>
                        <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">SQLite3</span>
                        <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">JSON Web Tokens</span>
                        <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">Nodemailer</span>
                        <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/60">Lucide Icons</span>
                    </div>
                </div>

            </main>

            {/*ПОДВАЛ*/}
            <footer className="bg-emerald-950 py-12 md:py-20 px-6 text-white text-center md:text-left">
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
                            <p onClick={() => navigate('/pricing')} className="hover:text-white cursor-pointer transition-colors">Подписка</p>
                            <p onClick={() => navigate('/templates')} className="hover:text-white cursor-pointer transition-colors">Шаблоны</p>
                            <p className="hover:text-white cursor-pointer transition-colors">Функции</p>
                        </div>
                        <div className="space-y-4 text-sm font-bold text-emerald-100/40 uppercase tracking-tighter">
                            <p className="text-emerald-500">Компания</p>
                            <p onClick={() => navigate('/about')} className="hover:text-white cursor-pointer transition-colors">О нас</p>
                            <p onClick={() => navigate('/contact')} className="hover:text-white cursor-pointer transition-colors">Контакты</p>
                            <p className="hover:text-white cursor-pointer transition-colors">Помощь</p>
                        </div>
                    </div>
                </div>
            </footer>

        </div>
    );
};

export default About;