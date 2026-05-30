import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Mail, MessageSquare } from 'lucide-react';

const Contact = () => {
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

    return (
        <div className="min-h-screen bg-[#f4fbf8] text-slate-900 font-sans overflow-x-hidden flex flex-col justify-between">
            <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-[100]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                            <span className="text-white font-black text-xl italic">GB</span>
                        </div>
                        <span className="font-black text-xl tracking-tighter text-emerald-950">GREENBUILD</span>
                    </div>
                    <nav className="hidden lg:flex items-center gap-8">
                        <button 
                            onClick={() => navigate('/about')} 
                            className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors"
                        >
                            О проекте
                        </button>
                        <button 
                            onClick={() => navigate('/templates')} 
                            className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors"
                        >
                            Шаблоны
                        </button>
                        <button 
                            onClick={() => navigate('/pricing')} 
                            className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors"
                        >
                            Подписка
                        </button>
                        <button 
                            onClick={() => navigate('/contact')} 
                            className="text-[11px] font-black uppercase tracking-widest text-emerald-600 transition-colors"
                        >
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
                        <button onClick={() => { navigate('/about'); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-600">
                            О проекте
                        </button>
                        <button onClick={() => { navigate('/templates'); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-600">
                            Шаблоны
                        </button>
                        <button onClick={() => { navigate('/pricing'); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-600">
                            Подписка
                        </button>
                        <button onClick={() => { navigate('/contact'); setIsMenuOpen(false); }} className="w-full border-2 border-emerald-200 bg-emerald-50 py-4 rounded-xl font-black uppercase tracking-widest text-emerald-700">
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

            {/*ОСНОВНОЙ КОНТЕНТ*/}
            <main className="flex-grow max-w-4xl w-full mx-auto px-6 pt-36 pb-16 flex flex-col items-center justify-center">
                <div className="w-full bg-white border border-slate-100 rounded-[32px] p-8 md:p-12 shadow-sm space-y-8 relative overflow-hidden">
                    
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

                    {/* Заголовок карточки */}
                    <div className="text-center md:text-left space-y-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                            <MessageSquare size={12} className="fill-emerald-800" /> Поддержка & Идеи
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black text-emerald-950 tracking-tighter uppercase">Связаться с разработчиком</h1>
                    </div> 

                    <p className="text-slate-600 text-sm md:text-base font-medium leading-relaxed bg-slate-50 border border-slate-100/80 rounded-2xl p-6">
                        Если у вас возникли вопросы или вы бы хотели добавить новые blocks для редактора, вы сможете связаться со мной по этой почте:{' '}
                        <a 
                            href="mailto:petrishin205@gmail.com" 
                            className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline transition-colors block sm:inline mt-1 sm:mt-0"
                        >
                            petrishin205@gmail.com
                        </a>
                    </p>

                    {/* Блок ссылок */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Карточка Почты */}
                        <a 
                            href="mailto:petrishin205@gmail.com" 
                            className="group flex items-center gap-4 p-5 bg-white border border-slate-200/60 rounded-2xl hover:border-emerald-500 hover:shadow-md transition-all"
                        >
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Написать на Email</h4>
                                <p className="text-emerald-950 font-bold text-sm truncate">petrishin205@gmail.com</p>
                            </div>
                        </a>

                        {/* Карточка GitHub */}
                        <a 
                            href="https://github.com/Karlson205" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="group flex items-center gap-4 p-5 bg-white border border-slate-200/60 rounded-2xl hover:border-emerald-500 hover:shadow-md transition-all"
                        >
                            <div className="p-3 bg-slate-50 text-slate-700 rounded-xl group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                    <path d="M9 18c-4.51 2-5-2-7-2" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Исходный код & Профиль</h4>
                                <p className="text-emerald-950 font-bold text-sm">github.com/Karlson205</p>
                            </div>
                        </a>
                    </div>
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

export default Contact;