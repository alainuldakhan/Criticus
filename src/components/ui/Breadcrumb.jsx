import { Link, useLocation } from 'react-router-dom';

// Mapping of route segments to Russian labels
const routeLabels = {
    // Top level
    teacher: 'Преподаватель',
    student: 'Студент',
    auth: 'Авторизация',
    profile: 'Профиль',

    // Teacher sub-routes
    classes: 'Классы',
    students: 'Студенты',
    invitations: 'Приглашения',
    topics: 'Темы',
    rag: 'Аналитика',

    // Student sub-routes
    sessions: 'Сессии',
    reports: 'Отчёты',

    // Auth sub-routes
    login: 'Вход',
    register: 'Регистрация',
    logout: 'Выход',

    // Actions
    create: 'Создать',
};

const Breadcrumb = () => {
    const location = useLocation();

    // Don't show breadcrumb on home page
    if (location.pathname === '/') {
        return null;
    }

    // Split the pathname into segments
    const pathSegments = location.pathname.split('/').filter(Boolean);

    // Build breadcrumb items
    const breadcrumbItems = [
        { label: 'Главная', path: '/' }
    ];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;

        // Check if segment is a known route label
        const label = routeLabels[segment];

        if (label) {
            breadcrumbItems.push({
                label,
                path: currentPath
            });
        } else if (/^\d+$/.test(segment)) {
            // If segment is a number (ID), show a generic label
            const parentSegment = pathSegments[index - 1];
            if (parentSegment === 'classes') {
                breadcrumbItems.push({
                    label: 'Детали класса',
                    path: currentPath
                });
            } else if (parentSegment === 'students') {
                breadcrumbItems.push({
                    label: 'Детали студента',
                    path: currentPath
                });
            } else if (parentSegment === 'topics') {
                breadcrumbItems.push({
                    label: 'Детали темы',
                    path: currentPath
                });
            } else if (parentSegment === 'sessions') {
                breadcrumbItems.push({
                    label: 'Детали сессии',
                    path: currentPath
                });
            } else {
                // Generic detail label
                breadcrumbItems.push({
                    label: 'Детали',
                    path: currentPath
                });
            }
        }
    });

    return (
        <nav className="breadcrumb" aria-label="Навигация по разделам">
            <ol className="breadcrumb__list">
                {breadcrumbItems.map((item, index) => {
                    const isLast = index === breadcrumbItems.length - 1;

                    return (
                        <li key={item.path} className="breadcrumb__item">
                            {!isLast ? (
                                <>
                                    <Link to={item.path} className="breadcrumb__link">
                                        {item.label}
                                    </Link>
                                    <span className="breadcrumb__separator" aria-hidden="true">
                                        /
                                    </span>
                                </>
                            ) : (
                                <span className="breadcrumb__current" aria-current="page">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
