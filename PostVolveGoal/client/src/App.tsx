import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import Home from "@/pages/home";
import Contact from "@/pages/contact";
import SignIn from "@/pages/signin";
import SignUp from "@/pages/signup";
import DashboardHome from "@/pages/dashboard/index";
import ContentGeneration from "@/pages/dashboard/generate";
import Scheduler from "@/pages/dashboard/scheduler";
import Analytics from "@/pages/dashboard/analytics";
import Settings from "@/pages/dashboard/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/contact" component={Contact} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/dashboard" component={DashboardHome} />
      <Route path="/dashboard/generate" component={ContentGeneration} />
      <Route path="/dashboard/scheduler" component={Scheduler} />
      <Route path="/dashboard/analytics" component={Analytics} />
      <Route path="/dashboard/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
