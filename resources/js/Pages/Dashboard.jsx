import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import AdminDashboard from '@/Pages/Dashboard/AdminDashboard';
import ProfessorDashboard from '@/Pages/Dashboard/ProfessorDashboard';
import StudentDashboard from '@/Pages/Dashboard/StudentDashboard';

export default function Dashboard({ role, stats, modules, sessions, recentSessions, activeSessions }) {
  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />

      {role === 'admin' && <AdminDashboard stats={stats} />}
      {role === 'professor' && (
        <ProfessorDashboard stats={stats} modules={modules} recentSessions={recentSessions} activeSessions={activeSessions} />
      )}
      {role === 'student' && (
        <StudentDashboard stats={stats} sessions={sessions} />
      )}
    </AuthenticatedLayout>
  );
}