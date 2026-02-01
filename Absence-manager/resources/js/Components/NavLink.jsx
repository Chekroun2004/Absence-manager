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
                    ? 'border-blue-300 text-white bg-blue-600 focus:border-blue-200'
                    : 'border-transparent text-blue-100 hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white') +
                ' ' +
                className
            }
        >
            {children}
        </Link>
    );
}
