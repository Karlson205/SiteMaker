import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Home = () => {
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

    const testimonials = [
        { name: "Александр В.", role: "UI Designer", text: "Лучший конструктор из тех, что я пробовал. Интерфейс не перегружен.", avatar: "А" },
        { name: "Мария К.", role: "Маркетолог", text: "Собрала лендинг за 15 минут. Эстетическое удовольствие!", avatar: "М" },
        { name: "Илья К.", role: "Фрилансер", text: "Система drag-and-drop работает идеально на любом экране.", avatar: "И" }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">
            <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 z-[100]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                            <span className="text-white font-black text-xl italic">GB</span>
                        </div>
                        <span className="font-black text-xl tracking-tighter text-emerald-950">GREENBUILD</span>
                    </div>

                    <nav className="hidden lg:flex items-center gap-8">
                        <button onClick={() => navigate('/about')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">
                            О проекте
                        </button>
                        <button onClick={() => navigate('/templates')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">
                            Шаблоны
                        </button>
                        <button onClick={() => navigate('/pricing')} className="text-[11px] font-black uppercase tracking-widest text-emerald-600 transition-colors">
                            Подписка
                        </button>
                        <button onClick={() => navigate('/contact')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">
                            Связь
                        </button>
                    </nav>

                    <div className="flex items-center gap-3">
                        {isLoggedIn ? (
                            // КНОПКИ ДЛЯ АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ
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
                        <button onClick={() => { navigate('/pricing'); setIsMenuOpen(false); }} className="w-full border-2 border-emerald-200 bg-emerald-50 py-4 rounded-xl font-black uppercase tracking-widest text-emerald-700">
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

            <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-emerald-950 leading-[0.95] tracking-tighter mb-8 uppercase">
                        Создавай <br/> проекты <span className="text-emerald-600 italic">быстро</span>
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                        <button onClick={() => navigate(isLoggedIn ? '/dashboard' : '/register')} className="w-full sm:w-auto bg-emerald-600 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95">
                            {isLoggedIn ? 'В кабинет' : 'Начать'}
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-slate-50 px-4">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-3xl font-black text-emerald-950 uppercase mb-12 text-center">Отзывы</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                                <p className="text-slate-600 font-bold italic mb-8 leading-relaxed">"{t.text}"</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-black">{t.avatar}</div>
                                    <div>
                                        <div className="font-black text-emerald-950 text-sm uppercase">{t.name}</div>
                                        <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

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

export default Home;