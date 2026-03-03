import { StrictMode, Suspense } from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/i18n';
import { ToastProvider } from '@/components/ui/ToastProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <Suspense fallback={<div className="bg-obsidian min-h-screen" />}>
        <App />
      </Suspense>
    </ToastProvider>
  </StrictMode>,
);
