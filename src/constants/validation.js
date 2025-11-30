/**
 * Validation rules and error messages
 */

export const validation = {
    rules: {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Введите корректный email адрес',
        },
        password: {
            minLength: 6,
            message: 'Пароль должен содержать минимум 6 символов',
        },
        required: {
            message: 'Это поле обязательно для заполнения',
        },
        grade: {
            min: 1,
            max: 12,
            message: 'Класс должен быть от 1 до 12',
        },
        year: {
            min: 2000,
            max: 2099,
            message: 'Год должен быть между 2000 и 2099',
        },
    },

    messages: {
        networkError: 'Ошибка сети. Проверьте подключение к интернету.',
        serverError: 'Ошибка сервера. Попробуйте позже.',
        unauthorized: 'Необходимо войти в систему.',
        forbidden: 'У вас нет доступа к этому ресурсу.',
        notFound: 'Запрашиваемый ресурс не найден.',
    },
};
