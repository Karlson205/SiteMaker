import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.post('/login', { username, password });
            localStorage.setItem('token', data.token);
            navigate('/dashboard'); 
        } catch (err) {
            alert('Ошибка входа: ' + err.response?.data?.error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            
            {/* Окно формы (как в референсе, но в цветах сайта) */}
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-emerald-950/10 p-10 border border-slate-100">
                
                {/* ХЕДЕР: Брендинг и Текст (Стиль референса, цвета сайта) */}
                <div className="text-center mb-10">
                    <div className="inline-block p-4 bg-emerald-600 rounded-3xl mb-4 shadow-lg shadow-emerald-200">
                        <h2 className="text-4xl font-extrabold text-white tracking-tighter">GB</h2>
                    </div>
                    <h1 className="text-3xl font-black text-emerald-950 uppercase tracking-wider">Войти</h1>
                    <p className="text-slate-600 mt-2 font-medium">Войдите, чтобы начать созидать</p>
                </div>

                {/* ФОРМА ВХОДА */}
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Логин */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Имя пользователя</label>
                        <input 
                            type="text" 
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            placeholder="mr_fort"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    {/* Пароль */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Пароль</label>
                        <input 
                            type="password" 
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            placeholder="••••••••••"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    {/* Элементы управления (как в референсе, цвета сайта) */}
                    <div className="space-y-5 pt-2">
                        
                        {/* КНОПКА ВОЙТИ: Главное действие (цвета сайта) */}
                        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95">
                            ВОЙТИ
                        </button>
                        
                        {/* Забыли пароль */}
                        <div className="text-center">
                            <a href="/forgot-password" className="text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors">Забыли пароль?</a>
                        </div>
                        
                        {/* Разделитель и кнопка РЕГИСТРАЦИИ (цвета сайта) */}
                        <div className="text-center pt-5 border-t border-slate-100 space-y-4">
                            <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Нет аккаунта?</p>
                            <button 
                                type="button"
                                onClick={() => navigate('/register')}
                                className="w-full bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold py-3.5 rounded-xl transition duration-200 shadow-sm shadow-emerald-100/50"
                            >
                                Создать аккаунт
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;