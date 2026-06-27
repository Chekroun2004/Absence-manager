# 🎓 Absence Manager — Système de Gestion des Présences

[![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Inertia.js](https://img.shields.io/badge/Inertia.js-1.x-9553E9)](https://inertiajs.com)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?logo=php&logoColor=white)](https://php.net)
[![License](https://img.shields.io/badge/license-academic-green)](#license)

Full-stack web application for managing student attendance in academic institutions — built with **Laravel 12 + React + Inertia.js**. Features a dynamic session-based attendance system with time-limited codes, multi-role dashboards, and an absence justification workflow.

---

## Features

- **Session-based attendance** — teacher creates a class session and generates a time-limited code
- **Real-time code validation** — students submit the code; expired codes automatically mark them absent
- **Code refresh mechanism** — teacher can refresh an expired code and update absent students to present
- **Multi-role system** — three distinct roles: Student, Professor, Admin with dedicated dashboards
- **Admin panel** — user approval, school class management, module assignment
- **Justification workflow** — students can submit absence justifications for review
- **REST API** — full JSON API for all attendance operations

---

## Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 12 (PHP 8.2+), Eloquent ORM |
| Frontend | React 18, Inertia.js |
| Auth | Laravel Breeze (session-based) |
| Database | MySQL / PostgreSQL (via migrations) |
| Build tool | Vite |

---

## Architecture

```
Absence-manager/           ← Laravel application root
├── app/
│   ├── Http/Controllers/
│   │   ├── Admin/         ← User, Module, SchoolClass, Absence management
│   │   ├── Api/           ← REST: Attendance, Lessons, Sessions
│   │   └── Auth/          ← Authentication
│   └── Models/            ← Eloquent models
├── resources/js/Pages/    ← React (Inertia) pages
├── routes/
│   ├── web.php            ← Inertia routes
│   └── api.php            ← REST API routes
└── database/migrations/   ← DB schema

Livrable/                  ← Project report (PDF, Word)
```

---

## Roles & Permissions

| Role | Capabilities |
|---|---|
| **Student** | Mark attendance via code, view history, submit justifications |
| **Professor** | Create sessions, generate/refresh attendance codes, view module stats |
| **Admin** | Approve users, manage modules & school classes, view all absences |

---

## Quick Start

```bash
# Install dependencies
cd Absence-manager
composer install
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Database setup
php artisan migrate
php artisan db:seed   # optional sample data

# Build frontend & serve
npm run dev
php artisan serve
```

App available at `http://localhost:8000`

---

## Repo Layout

```
Absence-manager/
├── Absence-manager/       # Laravel application source code
│   ├── app/
│   ├── database/
│   ├── resources/
│   ├── routes/
│   └── ...
└── Livrable/              # Academic deliverables (report PDF + Word)
```

---

## Authors

**Omar Chekroun** & **Haytam Belghali** — Projet de groupe, S1 Master IGOV, Université Mohammed V de Rabat
[![GitHub](https://img.shields.io/badge/GitHub-Chekroun2004-181717?logo=github)](https://github.com/Chekroun2004)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-omar--chekroun-0A66C2?logo=linkedin)](https://linkedin.com/in/omar-chekroun)

---

## License

Internal academic project — UM5 Rabat. Not licensed for commercial use.
