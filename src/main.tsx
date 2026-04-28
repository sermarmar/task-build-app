import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NotificationProvider } from './app/contexts/notification/NotificationProvider.tsx'
import { startPomodoroInterval } from './app/features/pomodoro/stores/usePomodoreStore.ts'

startPomodoroInterval();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </StrictMode>,
)
