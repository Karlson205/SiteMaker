import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    Menu, X, CreditCard, Calendar, User, Mail, Lock, Shield, 
    CheckCircle, ArrowLeft, Zap, Crown, Star, AlertCircle 
} from 'lucide-react';

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    
    // Получаем данные о плане из location state или из localStorage
    const [selectedPlan, setSelectedPlan] = useState(() => {
        const state = location.state;
        if (state?.plan) {
            return { name: state.plan, period: state.period || 'monthly' };
        }
        // По умолчанию - Профессиональный
        return { name: 'Профессиональный', period: 'monthly' };
    });

    const [formData, setFormData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });

    // Цены для тарифов
    const prices = {
        'Профессиональный': { monthly: 990, yearly: 9900 },
        'Бизнес': { monthly: 2490, yearly: 24900 }
    };

    const currentPrice = prices[selectedPlan.name]?.[selectedPlan.period] || 0;
    const pricePerMonth = selectedPlan.period === 'yearly' ? Math.round(currentPrice / 12) : currentPrice;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            // Если не авторизован, перенаправляем на страницу входа
            navigate('/login', { state: { from: '/checkout', plan: selectedPlan } });
        }
    }, [navigate, selectedPlan]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Форматирование номера карты (XXXX XXXX XXXX XXXX)
        if (name === 'cardNumber') {
            formattedValue = value
                .replace(/\s/g, '')
                .replace(/(\d{4})/g, '$1 ')
                .trim()
                .slice(0, 19);
        }
        
        // Форматирование даты (MM/YY)
        if (name === 'expiryDate') {
            formattedValue = value
                .replace(/\s/g, '')
                .replace(/(\d{2})(\d{2})/, '$1/$2')
                .slice(0, 5);
        }

        // Ограничение для CVV (3 цифры)
        if (name === 'cvv') {
            formattedValue = value.replace(/\D/g, '').slice(0, 3);
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Имитация обработки платежа
        setTimeout(() => {
            // Сохраняем информацию о подписке
            const subscription = {
                plan: selectedPlan.name,
                period: selectedPlan.period,
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + (selectedPlan.period === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active',
                price: currentPrice
            };
            
            localStorage.setItem('subscription', JSON.stringify(subscription));
            setIsProcessing(false);
            setIsSuccess(true);
            
            // Через 2 секунды перенаправляем в дашборд
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        }, 2000);
    };

    const getPlanIcon = () => {
        switch (selectedPlan.name) {
            case 'Профессиональный':
                return <Zap size={28} className="text-emerald-500" />;
            case 'Бизнес':
                return <Crown size={28} className="text-amber-500" />;
            default:
                return <Star size={28} className="text-emerald-500" />;
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={48} className="text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-black text-emerald-950 mb-3">Оплата прошла успешно!</h2>
                    <p className="text-slate-500 mb-6">
                        Спасибо за покупку! Ваша подписка "{selectedPlan.name}" активирована.
                        Перенаправляем в панель управления...
                    </p>
                    <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white font-sans overflow-x-hidden">
            
            {/* ХЕДЕР */}
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
                        <button className="lg:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-slate-100 p-6 flex flex-col gap-4 shadow-xl">
                        <button onClick={() => { navigate('/about'); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-600">
                            О проекте
                        </button>
                        <button onClick={() => { navigate('/templates'); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-600">
                            Шаблоны
                        </button>
                        <button onClick={() => { navigate('/pricing'); setIsMenuOpen(false); }} className="w-full bg-emerald-50 border-2 border-emerald-200 py-4 rounded-xl font-black uppercase tracking-widest text-emerald-700">
                            Подписка
                        </button>
                        <button onClick={() => { navigate('/contact'); setIsMenuOpen(false); }} className="w-full border-2 border-slate-100 py-4 rounded-xl font-black uppercase tracking-widest text-slate-600">
                            Связь
                        </button>
                    </div>
                )}
            </header>

            {/* ОСНОВНОЙ КОНТЕНТ */}
            <main className="pt-32 pb-20 px-4">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Кнопка назад */}
                    <button 
                        onClick={() => navigate('/pricing')}
                        className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-8 group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold uppercase tracking-wider">Назад к тарифам</span>
                    </button>

                    <div className="grid lg:grid-cols-3 gap-8">
                        
                        {/* ЛЕВАЯ КОЛОНКА - ДЕТАЛИ ПЛАТЕЖА */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                                <div className="p-6 md:p-8 border-b border-slate-100">
                                    <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                                        <CreditCard size={24} className="text-emerald-600" />
                                        Детали платежа
                                    </h2>
                                    <p className="text-slate-400 text-sm mt-1">Безопасная оплата через защищенное соединение</p>
                                </div>

                                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                                    {/* Номер карты */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                                            Номер карты
                                        </label>
                                        <div className="relative">
                                            <CreditCard size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                name="cardNumber"
                                                value={formData.cardNumber}
                                                onChange={handleInputChange}
                                                placeholder="1234 5678 9012 3456"
                                                required
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-mono text-sm"
                                                maxLength={19}
                                            />
                                        </div>
                                    </div>

                                    {/* Имя владельца */}
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                                            Имя владельца карты
                                        </label>
                                        <div className="relative">
                                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input
                                                type="text"
                                                name="cardName"
                                                value={formData.cardName}
                                                onChange={handleInputChange}
                                                placeholder="IVAN IVANOV"
                                                required
                                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all uppercase text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Срок и CVV */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                                                Срок действия
                                            </label>
                                            <div className="relative">
                                                <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={formData.expiryDate}
                                                    onChange={handleInputChange}
                                                    placeholder="MM/YY"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-mono text-sm"
                                                    maxLength={5}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                                                CVV / CVC
                                            </label>
                                            <div className="relative">
                                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                    placeholder="123"
                                                    required
                                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:bg-white outline-none transition-all font-mono text-sm"
                                                    maxLength={3}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Безопасность */}
                                    <div className="bg-emerald-50 rounded-xl p-4 flex items-start gap-3">
                                        <Shield size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                                        <p className="text-xs text-emerald-800 leading-relaxed">
                                            Все платежи защищены 3D Secure. Ваши данные не хранятся на наших серверах.
                                        </p>
                                    </div>

                                    {/* Кнопка оплаты */}
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Обработка...
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={18} />
                                                Оплатить {currentPrice} ₽
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* ПРАВАЯ КОЛОНКА - ИНФОРМАЦИЯ О ПОДПИСКЕ */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl shadow-xl p-6 md:p-8 text-white sticky top-32">
                                
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                                        {getPlanIcon()}
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                                        {selectedPlan.period === 'yearly' ? 'СЕЙЧАС -20%' : 'ПОПУЛЯРНО'}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black mb-2">{selectedPlan.name}</h3>
                                
                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black">{currentPrice} ₽</span>
                                        <span className="text-emerald-300">/{selectedPlan.period === 'yearly' ? 'год' : 'мес'}</span>
                                    </div>
                                    {selectedPlan.period === 'yearly' && (
                                        <p className="text-emerald-300 text-sm mt-1">
                                            Всего {pricePerMonth} ₽/мес — экономия 20%
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle size={16} className="text-emerald-400" />
                                        <span>Доступ ко всем функциям</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle size={16} className="text-emerald-400" />
                                        <span>Отмена в любой момент</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle size={16} className="text-emerald-400" />
                                        <span>14 дней бесплатной пробы</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle size={16} className="text-emerald-400" />
                                        <span>Приоритетная поддержка 24/7</span>
                                    </div>
                                </div>

                                <div className="border-t border-white/20 pt-4 mt-4">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-emerald-300">Сумма к оплате:</span>
                                        <span className="font-bold">{currentPrice} ₽</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-emerald-300">
                                        <span>НДС не облагается</span>
                                        <span>{selectedPlan.period === 'yearly' ? 'за год' : 'за месяц'}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-start gap-2 text-emerald-300 text-xs">
                                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                    <p>После оплаты вы получите чек на email. Пробный период — 14 дней, далее списание автоматически.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ФУТЕР */}
            <footer className="bg-emerald-950 py-12 md:py-16 px-6 text-white text-center md:text-left mt-12">
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
                        </div>
                        <div className="space-y-4 text-sm font-bold text-emerald-100/40 uppercase tracking-tighter">
                            <p className="text-emerald-500">Компания</p>
                            <p onClick={() => navigate('/about')} className="hover:text-white cursor-pointer transition-colors">О нас</p>
                            <p onClick={() => navigate('/contact')} className="hover:text-white cursor-pointer transition-colors">Контакты</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Checkout;