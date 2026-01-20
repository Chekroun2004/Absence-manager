import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-3 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-blue-400 text-white bg-gray-700 focus:border-blue-300'
                    : 'border-transparent text-white hover:bg-gray-700 hover:text-gray-100 focus:bg-gray-700 focus:text-gray-100') +
                ' ' +
                className
            }
        >
            {children}
        </Link>
    );
}
