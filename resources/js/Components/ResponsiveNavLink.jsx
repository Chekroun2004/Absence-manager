import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-blue-300 bg-blue-600 text-white focus:border-blue-200 focus:bg-blue-500 focus:text-white'
                    : 'border-transparent text-blue-100 hover:border-blue-400 hover:bg-blue-600 hover:text-white focus:border-blue-400 focus:bg-blue-600 focus:text-white'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
