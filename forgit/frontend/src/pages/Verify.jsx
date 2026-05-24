import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/api';

const Verify = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const { state } = useLocation();

    const submit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/verify', { username: state.username, code });
            alert("Готово! Теперь входите.");
            navigate('/login');
        } catch (err) { alert("Код неверный"); }
    };

    return (
        <div className="min-h-screen bg-emerald-900 flex items-center justify-center">
            <form onSubmit={submit} className="bg-white p-10 rounded-3xl shadow-2xl text-center space-y-6">
                <h2 className="text-xl font-bold text-emerald-900">Введите 6 цифр из письма</h2>
                <input type="text" maxLength="6" className="text-center text-4xl font-mono tracking-widest w-full p-2 border-b-4 border-emerald-500 outline-none" onChange={e => setCode(e.target.value)} />
                <button className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold">АКТИВИРОВАТЬ</button>
            </form>
        </div>
    );
};
export default Verify;