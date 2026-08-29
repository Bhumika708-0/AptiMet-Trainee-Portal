import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Shell } from '@/components/layout/Shell';

import Dashboard from '@/pages/dashboard';
import Catalog from '@/pages/catalog';
import CourseDetail from '@/pages/course-detail';
import Quiz from '@/pages/quiz';
import Profile from '@/pages/profile';
import Skills from '@/pages/skills';
import WarRoom from '@/pages/war-room';
import ForecastDuel from '@/pages/forecast-duel';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        {/* Full screen immersive takeover for Cyclone War Zone */}
        <Route path="/war-room" component={WarRoom} />

        {/* Standard portal routes wrapped in Shell navigation */}
        <Route path="/">
          <Shell>
            <Dashboard />
          </Shell>
        </Route>

        <Route path="/catalog">
          <Shell>
            <Catalog />
          </Shell>
        </Route>

        <Route path="/courses/:id">
          <Shell>
            <CourseDetail />
          </Shell>
        </Route>

        <Route path="/courses/:id/assessment">
          <Shell>
            <Quiz />
          </Shell>
        </Route>

        <Route path="/profile">
          <Shell>
            <Profile />
          </Shell>
        </Route>

        <Route path="/skills">
          <Shell>
            <Skills />
          </Shell>
        </Route>

        <Route path="/forecast-duel">
          <Shell>
            <ForecastDuel />
          </Shell>
        </Route>

        {/* Fallback 404 */}
        <Route>
          <Shell>
            <NotFound />
          </Shell>
        </Route>
      </Switch>
    </RoutedErrorBoundary>
  );
}

import { I18nProvider } from '@/lib/i18n';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}