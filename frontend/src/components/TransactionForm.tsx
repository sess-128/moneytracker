import { useEffect, useState } from 'react';
import { categoryApi, transactionApi } from '../api';
import type {CategoryResponse, TransactionRequest} from '../types';

interface Props {
    onSuccess: () => void; // Колбэк для обновления списка после успеха
    onCancel: () => void;  // Колбэк для закрытия формы
}

export default function TransactionForm({ onSuccess, onCancel }: Props) {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [loading, setLoading] = useState(true);

    // Состояние формы
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().slice(0, 16)); // Текущая дата+время
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState<number | ''>('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        categoryApi.getAllLeaves()
            .then(res => {
                setCategories(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load categories", err);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryId || !amount) return;

        setSubmitting(true);

        const payload: TransactionRequest = {
            amount: parseFloat(amount),
            date: date, // Отправляем в ISO формате
            description,
            categoryId: Number(categoryId),
        };

        try {
            await transactionApi.create(payload);
            onSuccess(); // Сообщаем родителю об успехе
        } catch (error) {
            alert("Ошибка при создании транзакции: " + error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-4">Загрузка категорий...</div>;

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
    <h2 className="text-xl font-bold mb-4">Новая транзакция</h2>

    {/* Сумма */}
    <div>
        <label className="block text-sm font-medium text-gray-700">Сумма</label>
        <input
    type="number"
    step="0.01"
    required
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
    placeholder="0.00"
        />
        </div>

    {/* Дата и время */}
    <div>
        <label className="block text-sm font-medium text-gray-700">Дата и время</label>
    <input
    type="datetime-local"
    required
    value={date}
    onChange={(e) => setDate(e.target.value)}
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
        />
        </div>

    {/* Описание */}
    <div>
        <label className="block text-sm font-medium text-gray-700">Описание</label>
        <input
    type="text"
    required
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
    placeholder="Например: Обед в кафе"
        />
        </div>

    {/* Выбор категории */}
    <div>
        <label className="block text-sm font-medium text-gray-700">Категория</label>
        <select
    required
    value={categoryId}
    onChange={(e) => setCategoryId(Number(e.target.value))}
    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
    >
    <option value="" disabled>Выберите категорию...</option>
    {/* Группируем по родительским категориям для удобства? Пока просто список */}
    {categories.map(cat => (
        <option key={cat.id} value={cat.id}>
        {cat.name}
        </option>
    ))}
    </select>
    <p className="text-xs text-gray-500 mt-1">Показаны только конечные категории</p>
    </div>

    {/* Кнопки */}
    <div className="flex justify-end space-x-3 pt-4">
    <button
        type="button"
    onClick={onCancel}
    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
        Отмена
        </button>
        <button
    type="submit"
    disabled={submitting}
    className="px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
        {submitting ? 'Сохранение...' : 'Сохранить'}
        </button>
        </div>
        </form>
);
}