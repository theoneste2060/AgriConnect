import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { Shield, LogIn, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userType: "admin" }),
      });

      if (response.ok) {
        toast({
          title: "Admin Access Granted",
          description: "Welcome to AgriConnect Rwanda Admin Panel",
        });
        window.location.reload();
      } else {
        const error = await response.json();
        toast({
          title: "Access Denied",
          description: error.message || "Invalid admin credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Unable to connect to server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-slate-800 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Administrator Portal
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            AgriConnect Rwanda - Admin Access
          </p>
        </div>

        <Card className="shadow-xl border-slate-200">
          <CardHeader className="bg-slate-50 rounded-t-lg">
            <CardTitle className="text-center text-xl flex items-center justify-center">
              <Shield className="h-5 w-5 mr-2" />
              Secure Admin Login
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Alert className="mb-6 border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Admin Access Only:</strong> This portal is restricted to authorized administrators only. 
                Email/password authentication is required.
              </AlertDescription>
            </Alert>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">
                        Administrator Email
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="admin@agriconnect.rw" 
                          type="email"
                          className="border-slate-300 focus:border-slate-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••••••" 
                          className="border-slate-300 focus:border-slate-500"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white"
                  disabled={isLoading}
                  size="lg"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  {isLoading ? "Authenticating..." : "Sign In as Administrator"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 space-y-4">
              <div className="text-center text-sm">
                <Link 
                  href="/customer/login" 
                  className="text-rwanda-green hover:text-emerald-700 font-medium"
                >
                  ← Customer Login
                </Link>
              </div>

              {/* Demo Admin Credentials */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="font-medium text-slate-900 mb-2 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Demo Admin Account:
                </h4>
                <div className="text-sm text-slate-700 space-y-1">
                  <p><strong>Email:</strong> admin@demo.com</p>
                  <p><strong>Password:</strong> admin123</p>
                </div>
              </div>

              <div className="text-xs text-slate-500 text-center">
                Admin sessions are automatically logged and monitored for security.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}