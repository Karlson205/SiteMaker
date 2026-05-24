import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api'; // Импортируем настроенный axios

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Вызываем созданный ранее роут на бэкенде
            const response = await API.post('/forgot-password', { email });
            
            alert(response.data.message || 'Новый пароль отправлен на почту!');
            navigate('/login');
        } catch (err) {
            // Если сервер вернул ошибку (например, email не существует)
            const errorMessage = err.response?.data?.error || 'Произошла ошибка при сбросе пароля';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 border border-slate-100 text-center">
                
                {/* Иконка */}
                <div className="inline-block p-4 bg-amber-500 rounded-3xl mb-4 shadow-lg shadow-amber-100">
                    <span className="text-4xl">🔑</span>
                </div>

                <h1 className="text-2xl font-black text-emerald-950 uppercase tracking-wider mb-2">
                    Забыли пароль?
                </h1>
                <p className="text-slate-500 text-sm mb-8 font-medium">
                    Введите ваш Email, и мы пришлем временный пароль для входа.
                </p>

                <form onSubmit={handleReset} className="space-y-6 text-left">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">
                            Ваш Email
                        </label>
                        <input 
                            type="email" 
                            placeholder="example@yandex.ru" 
                            required 
                            disabled={loading}
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition-all disabled:opacity-50"
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ОТПРАВЛЯЕМ...
                            </div>
                        ) : 'СБРОСИТЬ ПАРОЛЬ'}
                    </button>

                    <button 
                        type="button" 
                        onClick={() => navigate('/login')} 
                        className="w-full text-slate-500 font-bold text-sm hover:text-emerald-600 transition-colors py-2"
                    >
                        Вернуться назад
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;