// Pricing.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Menu, X, Check, Globe, Code, Headphones, Rocket, 
    Zap, Shield, Users, Sparkles, Crown, Award, 
    Infinity, Share2, Layout, Database, Clock 
} from 'lucide-react';

const Pricing = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [billingPeriod, setBillingPeriod] = useState('monthly');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    const plans = {
        free: {
            name: 'Базовый',
            price: { monthly: 0, yearly: 0 },
            description: 'Для старта и тестирования',
            buttonText: 'Начать бесплатно',
            buttonVariant: 'outline',
            features: [
                'До 3 активных проектов',
                'Базовые шаблоны',
                'Адаптивный дизайн',
                'Drag-and-drop редактор',
                'Экспорт в HTML/CSS',
                '10 МБ хранилища'
            ],
            notIncluded: [
                'Публикация сайта',
                'Редактирование кода',
                'Помощь специалистов',
                'Свои домены'
            ],
            popular: false,
            icon: Layout
        },
        pro: {
            name: 'Профессиональный',
            price: { monthly: 990, yearly: 9900 },
            description: 'Для фрилансеров и малого бизнеса',
            buttonText: 'Выбрать тариф',
            buttonVariant: 'primary',
            features: [
                'Неограниченное кол-во проектов',
                'Все премиум шаблоны',
                'Публикация сайта онлайн 🌐',
                'Редактирование кода страниц',
                'Приоритетная поддержка (24/7)',
                '10 ГБ хранилища',
                'Подключение своего домена',
                'Аналитика посещаемости',
                'Без водяных знаков'
            ],
            notIncluded: [],
            popular: true,
            icon: Rocket,
            badge: 'Самый популярный'
        },
        business: {
            name: 'Бизнес',
            price: { monthly: 2490, yearly: 24900 },
            description: 'Для агентств и профессионалов',
            buttonText: 'Связаться с нами',
            buttonVariant: 'secondary',
            features: [
                'Всё из Профессионального',
                'Помощь с дизайном от экспертов 🎨',
                'SEO-оптимизация под ключ',
                'Приоритетное размещение в поиске',
                'Команда до 5 человек',
                '50 ГБ хранилища',
                'API доступ',
                'Брендирование под ваш бизнес',
                'Резервное копирование'
            ],
            notIncluded: [],
            popular: false,
            icon: Crown,
            badge: 'Для команд'
        }
    };

    const additionalFeatures = [
        {
            icon: Globe,
            title: 'Публикация в один клик',
            description: 'Ваш сайт становится доступен всем в интернете. Бесплатный поддомен *.greenbuild.app и возможность подключить свой домен.'
        },
        {
            icon: Code,
            title: 'Редактор кода',
            description: 'Полный доступ к HTML/CSS/JS вашего сайта. Добавляйте кастомный код, интеграции и расширяйте функционал без ограничений.'
        },
        {
            icon: Headphones,
            title: 'Поддержка профи',
            description: 'Наши дизайнеры и разработчики помогут оформить ваш сайт, исправить ошибки и ответят на любые вопросы в течение 30 минут.'
        },
        {
            icon: Zap,
            title: 'Мгновенная скорость',
            description: 'Ваши сайты загружаются в 2 раза быстрее благодаря нашей оптимизации и CDN-сетям по всему миру.'
        },
        {
            icon: Shield,
            title: 'SSL сертификат',
            description: 'Все сайты получают бесплатный SSL-сертификат, чтобы ваши посетители были в безопасности.'
        },
        {
            icon: Users,
            title: 'Командная работа',
            description: 'Приглашайте коллег в проект, назначайте роли и работайте над сайтом вместе в реальном времени.'
        },
        {
            icon: Database,
            title: 'Формы и база данных',
            description: 'Собирайте заявки с посетителей, управляйте лидами через встроенную CRM и интегрируйтесь с вашими сервисами.'
        },
        {
            icon: Clock,
            title: 'История изменений',
            description: 'Возвращайтесь к любой версии вашего сайта. Все правки автоматически сохраняются.'
        }
    ];

    const testimonials = [
        {
            name: 'Илья.',
            role: 'Владелец кофейни',
            text: 'После подключения подписки Pro я смог опубликовать сайт для своей кофейни. Клиенты находят нас через Google, а форма бронирования столиков работает безотказно!',
            rating: 5
        },
        {
            name: 'Лика З.',
            role: 'Web-дизайнер',
            text: 'Возможность править код напрямую — это то, что я искала. Теперь могу добавить любую анимацию и интеграцию. Поддержка всегда помогает, если что-то идёт не так.',
            rating: 5
        },
        {
            name: 'Максим Ш.',
            role: 'Маркетолог',
            text: 'Взял Business-тариф для агентства. Помощь в оформлении сайта сэкономила нам кучу времени. Рекомендую GreenBuild всем коллегам!',
            rating: 5
        }
    ];

    const handleSubscribe = (planName) => {
        if (planName === 'Бизнес') {
            // Открыть модалку с формой связи или направить на отдельную страницу
            window.location.href = 'mailto:sales@greenbuild.app?subject=Вопрос о тарифе Бизнес';
        } else if (!isLoggedIn) {
            navigate('/register', { state: { plan: planName } });
        } else {
            // Здесь будет логика оформления подписки
            navigate('/checkout', { state: { plan: planName, period: billingPeriod } });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white font-sans overflow-x-hidden">
            
            {/* HEADER */}
            <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 z-[100]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                            <span className="text-white font-black text-xl italic">GB</span>
                        </div>
                        <span className="font-black text-xl tracking-tighter text-emerald-950">GREENBUILD</span>
                    </div>

                    <nav className="hidden lg:flex items-center gap-8">
                        <button onClick={() => navigate('/')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">
                            Главная
                        </button>
                        <button onClick={() => navigate('/templates')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">
                            Шаблоны
                        </button>
                        <button className="text-[11px] font-black uppercase tracking-widest text-emerald-600 transition-colors">
                            Подписка
                        </button>
                        <button onClick={() => navigate('/about')} className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 transition-colors">
                            О нас
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
                    <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl">
                        <button onClick={() => { navigate('/'); setIsMenuOpen(false); }} className="w-full text-left py-2 font-semibold">Главная</button>
                        <button onClick={() => { navigate('/templates'); setIsMenuOpen(false); }} className="w-full text-left py-2 font-semibold">Шаблоны</button>
                        <button className="w-full text-left py-2 font-bold text-emerald-600">Подписка</button>
                        <button onClick={() => { navigate('/about'); setIsMenuOpen(false); }} className="w-full text-left py-2 font-semibold">О нас</button>
                        <hr className="my-2" />
                        {isLoggedIn ? (
                            <button onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">
                                Мои проекты
                            </button>
                        ) : (
                            <button onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold">
                                Войти
                            </button>
                        )}
                    </div>
                )}
            </header>

            <main className="pt-32 pb-20">
                
                {/* HERO СЕКЦИЯ */}
                <div className="max-w-7xl mx-auto px-4 text-center mb-20">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-6">
                        <Sparkles size={16} className="fill-emerald-600" />
                        Выберите свой путь к успеху
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-emerald-950 leading-tight mb-6 tracking-tighter">
                        Простые тарифы для <br />
                        <span className="text-emerald-600 italic">профессионалов</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        Начните бесплатно, а когда будете готовы — подключите подписку 
                        и получите полный контроль над своими проектами.
                    </p>
                </div>

                {/* ПЕРЕКЛЮЧАТЕЛЬ ПЕРИОДА ОПЛАТЫ */}
                <div className="flex justify-center mb-12">
                    <div className="bg-slate-100 p-1 rounded-2xl inline-flex gap-1">
                        <button
                            onClick={() => setBillingPeriod('monthly')}
                            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${billingPeriod === 'monthly' ? 'bg-white shadow-md text-emerald-700' : 'text-slate-500'}`}
                        >
                            Ежемесячно
                        </button>
                        <button
                            onClick={() => setBillingPeriod('yearly')}
                            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${billingPeriod === 'yearly' ? 'bg-white shadow-md text-emerald-700' : 'text-slate-500'}`}
                        >
                            Ежегодно <span className="text-emerald-600 text-xs ml-1">-20%</span>
                        </button>
                    </div>
                </div>

                {/* КАРТОЧКИ ТАРИФОВ */}
                <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 mb-28">
                    {Object.entries(plans).map(([key, plan]) => {
                        const IconComponent = plan.icon;
                        const isFree = key === 'free';
                        const price = billingPeriod === 'monthly' ? plan.price.monthly : plan.price.yearly;
                        const pricePerMonth = billingPeriod === 'yearly' && !isFree ? Math.round(plan.price.yearly / 12) : price;
                        
                        return (
                            <div 
                                key={key}
                                className={`relative bg-white rounded-3xl transition-all duration-300 hover:-translate-y-2 ${
                                    plan.popular 
                                        ? 'shadow-2xl ring-2 ring-emerald-500 scale-105 md:scale-105' 
                                        : 'shadow-lg border border-slate-100'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                                        {plan.badge}
                                    </div>
                                )}
                                
                                <div className="p-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-2xl ${plan.popular ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                                            <IconComponent size={28} className={plan.popular ? 'text-emerald-600' : 'text-slate-600'} />
                                        </div>
                                        {isFree && (
                                            <span className="text-xs bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-bold">
                                                Навсегда
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-800 mb-2">{plan.name}</h3>
                                    <p className="text-sm text-slate-400 mb-6">{plan.description}</p>

                                    <div className="mb-6">
                                        {isFree ? (
                                            <div className="text-4xl font-black text-slate-800">Бесплатно</div>
                                        ) : (
                                            <>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-4xl font-black text-slate-800">{price}₽</span>
                                                    <span className="text-slate-400">/мес</span>
                                                </div>
                                                {billingPeriod === 'yearly' && (
                                                    <p className="text-xs text-emerald-600 mt-1">
                                                        {pricePerMonth}₽/мес при оплате за год
                                                    </p>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => handleSubscribe(plan.name)}
                                        className={`w-full py-3 rounded-xl font-bold transition-all mb-8 ${
                                            plan.buttonVariant === 'primary' 
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200' 
                                                : plan.buttonVariant === 'secondary'
                                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                                : 'border-2 border-slate-200 hover:border-emerald-300 text-slate-600 hover:text-emerald-600'
                                        }`}
                                    >
                                        {plan.buttonText}
                                    </button>

                                    <div className="space-y-3">
                                        {plan.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-sm">
                                                <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                                <span className="text-slate-600">{feature}</span>
                                            </div>
                                        ))}
                                        {plan.notIncluded.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-2 text-sm opacity-50">
                                                <X size={18} className="text-slate-400 shrink-0 mt-0.5" />
                                                <span className="text-slate-400 line-through">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ПРЕИМУЩЕСТВА ПОДПИСКИ */}
                <div className="bg-gradient-to-b from-white to-emerald-50/30 py-20">
                    <div className="max-w-7xl mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-emerald-950 mb-4 tracking-tighter">
                                Всё, что нужно для роста
                            </h2>
                            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                                С подпиской Pro или Business вы получаете доступ к расширенным возможностям
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {additionalFeatures.map((feature, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
                                        <feature.icon size={24} className="text-emerald-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* СРАВНЕНИЕ ТАРИФОВ */}
                <div className="max-w-7xl mx-auto px-4 py-20">
                    <h2 className="text-3xl md:text-4xl font-black text-emerald-950 text-center mb-12 tracking-tighter">
                        Сравните все возможности
                    </h2>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left p-6 font-black text-slate-800">Функция</th>
                                    <th className="text-center p-6 font-black text-slate-800">Базовый</th>
                                    <th className="text-center p-6 font-black text-emerald-800 bg-emerald-50/30">Профессиональный</th>
                                    <th className="text-center p-6 font-black text-slate-800">Бизнес</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-slate-100">
                                    <td className="p-6 text-slate-600">Количество проектов</td>
                                    <td className="text-center p-6 text-slate-500">до 3</td>
                                    <td className="text-center p-6 font-bold text-emerald-600 bg-emerald-50/30">∞</td>
                                    <td className="text-center p-6 font-bold text-emerald-600">∞</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="p-6 text-slate-600">Публикация сайта онлайн</td>
                                    <td className="text-center p-6 text-slate-400">—</td>
                                    <td className="text-center p-6 text-emerald-600 bg-emerald-50/30">✓</td>
                                    <td className="text-center p-6 text-emerald-600">✓</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="p-6 text-slate-600">Редактирование кода</td>
                                    <td className="text-center p-6 text-slate-400">—</td>
                                    <td className="text-center p-6 text-emerald-600 bg-emerald-50/30">✓</td>
                                    <td className="text-center p-6 text-emerald-600">✓</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="p-6 text-slate-600">Помощь с дизайном</td>
                                    <td className="text-center p-6 text-slate-400">—</td>
                                    <td className="text-center p-6 text-slate-500">Базовый чат</td>
                                    <td className="text-center p-6 text-emerald-600 font-bold">Эксперты 24/7</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="p-6 text-slate-600">Свой домен</td>
                                    <td className="text-center p-6 text-slate-400">—</td>
                                    <td className="text-center p-6 text-emerald-600 bg-emerald-50/30">✓</td>
                                    <td className="text-center p-6 text-emerald-600">✓</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="p-6 text-slate-600">SEO-оптимизация</td>
                                    <td className="text-center p-6 text-slate-400">—</td>
                                    <td className="text-center p-6 text-slate-500">Базовая</td>
                                    <td className="text-center p-6 text-emerald-600 font-bold">Под ключ</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="p-6 text-slate-600">Хранилище</td>
                                    <td className="text-center p-6 text-slate-500">10 МБ</td>
                                    <td className="text-center p-6 text-emerald-600 bg-emerald-50/30">10 ГБ</td>
                                    <td className="text-center p-6 text-emerald-600">50 ГБ</td>
                                </tr>
                                <tr className="border-b border-slate-100">
                                    <td className="p-6 text-slate-600">Поддержка</td>
                                    <td className="text-center p-6 text-slate-400">—</td>
                                    <td className="text-center p-6 text-emerald-600 bg-emerald-50/30">24/7</td>
                                    <td className="text-center p-6 text-emerald-600">Приоритетная</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ОТЗЫВЫ */}
                <div className="bg-slate-50 py-20">
                    <div className="max-w-7xl mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-black text-emerald-950 text-center mb-12 tracking-tighter">
                            Что говорят наши клиенты
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((t, idx) => (
                                <div key={idx} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(t.rating)].map((_, i) => (
                                            <span key={i} className="text-yellow-500 text-lg">★</span>
                                        ))}
                                    </div>
                                    <p className="text-slate-600 leading-relaxed mb-6 italic">"{t.text}"</p>
                                    <div>
                                        <p className="font-bold text-slate-800">{t.name}</p>
                                        <p className="text-sm text-slate-400">{t.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA СЕКЦИЯ */}
                <div className="max-w-5xl mx-auto px-4 py-20 text-center">
                    <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 rounded-3xl p-12 text-white shadow-2xl">
                        <Crown size={48} className="mx-auto mb-6 text-yellow-400 fill-yellow-400/30" />
                        <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">
                            Готовы вывести сайт на новый уровень?
                        </h2>
                        <p className="text-emerald-200 text-lg mb-8 max-w-xl mx-auto">
                            Присоединяйтесь к тысячам профессионалов, которые уже используют GreenBuild
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={() => handleSubscribe('Профессиональный')}
                                className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-black uppercase tracking-wider hover:shadow-xl transition-all active:scale-95"
                            >
                                Начать 14-дневную пробу
                            </button>
                            <button 
                                onClick={() => navigate('/contact')}
                                className="border-2 border-white/30 text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-white/10 transition-all"
                            >
                                Связаться с отделом продаж
                            </button>
                        </div>
                        <p className="text-emerald-300 text-sm mt-6">
                            * Бесплатная пробная подписка на 14 дней. Отмена в любой момент.
                        </p>
                    </div>
                </div>
            </main>

            {/* FOOTER */}
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
                            <p onClick={() => navigate('/templates')} className="hover:text-white cursor-pointer transition-colors">Шаблоны</p>
                            <p className="hover:text-white cursor-pointer transition-colors">Функции</p>
                            <p className="hover:text-white cursor-pointer transition-colors">Цены</p>
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

export default Pricing;