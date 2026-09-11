import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppLayout } from './components/AppLayout'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ServicesPage } from './pages/ServicesPage'
import { ReservationPage } from './pages/ReservationPage'
import { LegalNoticePage } from './pages/LegalNoticePage'
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { TermsPage } from './pages/TermsPage'
import { LocalizedContent } from './components/LocalizedContent'
import { CookiesProvider } from 'react-cookie'
import './i18n'
import './styles.css'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/services', element: <ServicesPage /> },
      { path: '/a-propos', element: <AboutPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/reservation', element: <ReservationPage /> },
      { path: '/mentions-legales', element: <LegalNoticePage /> },
      { path: '/politique-de-confidentialite', element: <PrivacyPolicyPage /> },
      { path: '/conditions-generales-utilisation', element: <TermsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CookiesProvider>
      <LocalizedContent />
      <RouterProvider router={router} />
    </CookiesProvider>
  </StrictMode>,
)
