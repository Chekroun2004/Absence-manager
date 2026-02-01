import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-slate-50">
            <nav className="bg-gradient-to-r from-blue-800 via-blue-700 to-blue-800 shadow-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* LOGO ET NOM FACULTÉ */}
                        <div className="flex items-center gap-3">
                            <Link href="/">
                                <div className="flex items-center gap-2">
                                    {/* LOGO FACULTÉ - IMAGE */}
                                    <img 
                                        src="/images/faculte_logo.jfif" 
                                        alt="Faculté des Sciences Rabat"
                                        className="w-10 h-10 object-contain rounded"
                                    />
                                    <div className="hidden sm:block">
                                        <p className="text-white font-bold text-sm">Faculté des Sciences</p>
                                        <p className="text-blue-300 text-xs">Rabat - Gestion Absences</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* NAVIGATION DESKTOP */}
                        <div className="hidden space-x-1 sm:-my-px sm:flex">
                            <NavLink
                                href={route('dashboard')}
                                active={route().current('dashboard')}
                            >
                                Dashboard
                            </NavLink>

                            {/* ADMIN LINKS */}
                            {user.role === 'admin' && (
                                <>
                                    <NavLink
                                        href={route('admin.modules.index')}
                                        active={route().current('admin.modules.index')}
                                    >
                                        Modules
                                    </NavLink>
                                    <NavLink
                                        href={route('admin.school-classes.index')}
                                        active={route().current('admin.school-classes.index')}
                                    >
                                        Classes
                                    </NavLink>
                                    <NavLink 
                                        href={route('admin.grades.index')}
                                        active={route().current('admin.grades.index')}
                                    >
                                        Mentions
                                    </NavLink>
                                    <NavLink
                                        href={route('admin.pending-users')}
                                        active={route().current('admin.pending-users')}
                                    >
                                        Approbations
                                    </NavLink>
                                    <NavLink
                                        href={route('admin.users.index')}
                                        active={route().current('admin.users.index')}
                                    >
                                        Utilisateurs
                                    </NavLink>
                                </>
                            )}

                            {/* PROFESSOR LINKS */}
                            {user.role === 'professor' && (
                                <>
                                    <NavLink
                                        href={route('professor.sessions')}
                                        active={route().current('professor.sessions')}
                                    >
                                        Mes Séances
                                    </NavLink>
                                    <NavLink 
                                        href={route('professor.grades.index')}
                                        active={route().current('professor.grades.index')}
                                    >
                                        Mentions
                                    </NavLink>
                                    <NavLink
                                        href={route('professor.absences.justifications')}
                                        active={route().current('professor.absences.justifications')}
                                    >
                                        Justifications
                                    </NavLink>
                                    <NavLink
                                        href={route('professor.recommendations')}
                                        active={route().current('professor.recommendations')}
                                    >
                                        Recommandations
                                    </NavLink>
                                </>
                            )}

                            {/* STUDENT LINKS */}
                            {user.role === 'student' && (
                                <>
                                    <NavLink
                                        href={route('student.modules')}
                                        active={route().current('student.modules')}
                                    >
                                        Mes Modules
                                    </NavLink>
                                    <NavLink
                                        href={route('student.mark-presence')}
                                        active={route().current('student.mark-presence')}
                                    >
                                        Marquer Présence
                                    </NavLink>
                                    <NavLink
                                        href={route('student.letters')}
                                        active={route().current('student.letters')}
                                    >
                                        Mes Lettres
                                    </NavLink>
                                </>
                            )}
                        </div>

                        {/* PROFILE DROPDOWN */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out hover:bg-blue-500 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profil
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Déconnexion
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        {/* HAMBURGER MOBILE */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-blue-100 transition duration-150 ease-in-out hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* NAVIGATION MOBILE */}
                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden bg-blue-700'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            className="!text-gray-300 !hover:text-white"
                        >
                            Dashboard
                        </ResponsiveNavLink>

                        {/* ADMIN LINKS MOBILE */}
                        {user.role === 'admin' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('admin.pending-users')}
                                    active={route().current('admin.pending-users')}
                                    className="!text-white !hover:text-blue-200"
                                >
                                    Approbations
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.users.index')}
                                    active={route().current('admin.users.index')}
                                    className="!text-white !hover:text-blue-200"
                                >
                                    Utilisateurs
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.modules.index')}
                                    active={route().current('admin.modules.index')}
                                    className="!text-white !hover:text-blue-200"
                                >
                                    Modules
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('admin.school-classes.index')}
                                    active={route().current('admin.school-classes.index')}
                                    className="!text-white !hover:text-blue-200"
                                >
                                    Classes
                                </ResponsiveNavLink>
                            </>
                        )}

                        {/* PROFESSOR LINKS MOBILE */}
                        {user.role === 'professor' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('professor.sessions')}
                                    active={route().current('professor.sessions')}
                                    className="!text-white !hover:text-blue-200"
                                >
                                    Mes Séances
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('professor.absences.justifications')}
                                    active={route().current('professor.absences.justifications')}
                                    className="!text-white !hover:text-blue-200"
                                >
                                    Justifications
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('professor.recommendations')}
                                    active={route().current('professor.recommendations')}
                                    className="!text-white !hover:text-blue-200"
                                >
                                    Recommandations
                                </ResponsiveNavLink>
                            </>
                        )}

                        {/* STUDENT LINKS MOBILE */}
                        {user.role === 'student' && (
                            <>
                                <ResponsiveNavLink
                                    href={route('student.modules')}
                                    active={route().current('student.modules')}
                                    className="!text-white !hover:text-blue-200"
                                >
                                    Mes Modules
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('student.mark-presence')}
                                    active={route().current('student.mark-presence')}
                                    className="!text-white !hover:text-blue-200"
                                >
                                    Marquer Présence
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('student.letters')}
                                    active={route().current('student.letters')}
                                    className="!text-white !hover:text-blue-200"
                                >
                                    Mes Lettres
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    {/* MOBILE PROFILE */}
                    <div className="border-t border-blue-600 bg-blue-700 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-white">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-400">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink
                                href={route('profile.edit')}
                                className="!text-gray-300 !hover:text-white"
                            >
                                Profil
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="!text-gray-300 !hover:text-white"
                            >
                                Déconnexion
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* HEADER */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* MAIN CONTENT */}
            <main>{children}</main>
        </div>
    );
}