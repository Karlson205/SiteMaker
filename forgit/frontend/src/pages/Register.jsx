import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

const Register = () => {
    const [data, setData] = useState({ username: '', password: '', email: '' });
    const navigate = useNavigate();

    const handleAction = async (e) => {
        e.preventDefault();
        try {
            await API.post('/register', data);
            navigate('/verify', { state: { username: data.username } });
        } catch (err) { 
            alert(err.response?.data?.error || "Ошибка регистрации"); 
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-emerald-950/10 p-10 border border-slate-100">
                
                {/* ХЕДЕР */}
                <div className="text-center mb-8">
                    <div className="inline-block p-4 bg-emerald-600 rounded-3xl mb-4 shadow-lg shadow-emerald-200">
                        <h2 className="text-4xl font-extrabold text-white tracking-tighter">GB</h2>
                    </div>
                    <h1 className="text-3xl font-black text-emerald-950 uppercase tracking-wider">Создать аккаунт</h1>
                    <p className="text-slate-600 mt-2 font-medium">Присоединяйтесь к сообществу</p>
                </div>

                <form onSubmit={handleAction} className="space-y-5">
                    {/* Никнейм */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Никнейм</label>
                        <input type="text" placeholder="alex_build" required 
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            onChange={e => setData({...data, username: e.target.value})} />
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Email (Yandex)</label>
                        <input type="email" placeholder="example@yandex.ru" required 
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            onChange={e => setData({...data, email: e.target.value})} />
                    </div>

                    {/* Пароль */}
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Пароль</label>
                        <input type="password" placeholder="••••••••" required 
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            onChange={e => setData({...data, password: e.target.value})} />
                    </div>

                    <div className="pt-4 space-y-4">
                        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5 active:scale-95">
                            ЗАРЕГИСТРИРОВАТЬСЯ
                        </button>
                        
                        <div className="text-center pt-4 border-t border-slate-100">
                            <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest mb-3">Уже есть аккаунт?</p>
                            <button type="button" onClick={() => navigate('/login')}
                                className="w-full bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold py-3.5 rounded-xl transition-all">
                                ВОЙТИ
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;