import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import FarmerDashboard from "@/pages/farmer-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import CustomerDashboard from "@/pages/customer-dashboard";
import AuthPage from "@/pages/auth";
import ProductComparison from "@/pages/product-comparison";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    setLocation("/auth");
    return null;
  }

  return <Component />;
}

function Router() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected routes */}
      <Route path="/farmer-dashboard">
        <ProtectedRoute component={FarmerDashboard} />
      </Route>
      <Route path="/admin-dashboard">
        <ProtectedRoute component={AdminDashboard} />
      </Route>
      <Route path="/customer-dashboard">
        <ProtectedRoute component={CustomerDashboard} />
      </Route>
      <Route path="/price-comparison/:categoryId">
        <ProtectedRoute component={ProductComparison} />
      </Route>
      <Route path="/home">
        <ProtectedRoute component={Home} />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
