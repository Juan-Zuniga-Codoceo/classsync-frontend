// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/use-toast';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import Subjects from './pages/Subjects';
import Courses from './pages/Courses';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Schedules from './pages/Schedules';

// Componente temporal para páginas en desarrollo
const UnderDevelopment = ({ pageName }) => (
  <div className="p-8">
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            La página de {pageName} está en desarrollo.
          </p>
        </div>
      </div>
    </div>
  </div>
);

// Estilos globales para los componentes personalizados
const globalStyles = `
  .modal-overlay {
    @apply fixed inset-0 bg-black bg-opacity-50 z-50;
  }
  
  .modal-container {
    @apply fixed inset-0 z-50 overflow-y-auto;
  }
  
  .modal-content {
    @apply relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg mx-auto mt-16;
  }

  .toast-container {
    @apply fixed bottom-4 right-4 z-50 space-y-2;
  }

  .toast {
    @apply p-4 rounded-md shadow-lg;
  }

  .toast-success {
    @apply bg-white border border-gray-200;
  }

  .toast-error {
    @apply bg-red-500 text-white;
  }

  .btn {
    @apply px-4 py-2 rounded-md font-medium transition-colors;
  }

  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700;
  }

  .btn-outline {
    @apply border border-gray-300 hover:bg-gray-50;
  }

  .btn-ghost {
    @apply hover:bg-gray-100;
  }

  .input {
    @apply w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500;
  }

  .select {
    @apply w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500;
  }

  .radio-group {
    @apply space-y-2;
  }

  .table {
    @apply min-w-full divide-y divide-gray-200;
  }

  .table-header {
    @apply bg-gray-50;
  }

  .table-body {
    @apply bg-white divide-y divide-gray-200;
  }

  .table-cell {
    @apply px-6 py-4 whitespace-nowrap;
  }
`;

function App() {
  return (
    <ToastProvider>
      <style>{globalStyles}</style>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="courses" element={<Courses />} />
            <Route path="schedules" element={<Schedules />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;