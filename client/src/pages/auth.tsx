import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginData, SignupData, loginSchema, signupSchema } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Leaf, ShoppingCart, Shield, Loader2 } from "lucide-react";

export default function AuthPage() {
  const [location, setLocation] = useLocation();
  const { user, login, signup } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");

  // Redirect if already authenticated
  if (user) {
    switch (user.userType) {
      case "farmer":
        setLocation("/farmer-dashboard");
        break;
      case "customer":
        setLocation("/customer-dashboard");
        break;
      case "admin":
        setLocation("/admin-dashboard");
        break;
      default:
        setLocation("/");
    }
    return null;
  }

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      userType: "customer",
    },
  });

  const signupForm = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      userType: "customer",
    },
  });

  const onLogin = async (data: LoginData) => {
    try {
      await login.mutateAsync(data);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const onSignup = async (data: SignupData) => {
    try {
      await signup.mutateAsync(data);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case "farmer":
        return <Leaf className="h-5 w-5 text-green-600" />;
      case "customer":
        return <ShoppingCart className="h-5 w-5 text-blue-600" />;
      case "admin":
        return <Shield className="h-5 w-5 text-purple-600" />;
      default:
        return null;
    }
  };

  const getUserTypeDescription = (userType: string) => {
    switch (userType) {
      case "farmer":
        return "Umuhinzi - List and sell your agricultural products";
      case "customer":
        return "Umukiriya - Browse and purchase fresh products";
      case "admin":
        return "Administrator - Manage the AgriConnect platform";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Hero Section */}
        <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome to <span className="text-green-600">AgriConnect</span> Rwanda
            </h1>
            <p className="text-xl text-gray-600">
              Connecting farmers and customers across Rwanda's agricultural marketplace
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <Leaf className="h-6 w-6 text-green-600" />
              <span className="text-gray-700">Fresh products from local farmers</span>
            </div>
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
              <span className="text-gray-700">Easy ordering and delivery</span>
            </div>
            <div className="flex items-center space-x-3 justify-center lg:justify-start">
              <Shield className="h-6 w-6 text-purple-600" />
              <span className="text-gray-700">Secure and trusted platform</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Test Login</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Farmer:</strong> umuhinzi@example.com</p>
              <p><strong>Customer:</strong> umukiriya@example.com</p>
              <p><strong>Admin:</strong> admin@agriconnect.rw</p>
              <p><strong>Password:</strong> password123</p>
            </div>
          </div>
        </div>

        {/* Authentication Form */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Join AgriConnect</CardTitle>
            <CardDescription>
              Choose your account type and get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "signup")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="customer">
                                <div className="flex items-center space-x-2">
                                  {getUserTypeIcon("customer")}
                                  <span>Customer (Umukiriya)</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="farmer">
                                <div className="flex items-center space-x-2">
                                  {getUserTypeIcon("farmer")}
                                  <span>Farmer (Umuhinzi)</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="admin">
                                <div className="flex items-center space-x-2">
                                  {getUserTypeIcon("admin")}
                                  <span>Administrator</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter your password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={login.isPending}
                    >
                      {login.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Login"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                    <FormField
                      control={signupForm.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select account type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="customer">
                                <div className="flex items-center space-x-2">
                                  {getUserTypeIcon("customer")}
                                  <span>Customer (Umukiriya)</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="farmer">
                                <div className="flex items-center space-x-2">
                                  {getUserTypeIcon("farmer")}
                                  <span>Farmer (Umuhinzi)</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500 mt-1">
                            {getUserTypeDescription(signupForm.watch("userType"))}
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={signupForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Jean" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={signupForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Baptiste" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="your.email@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Create a strong password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={signup.isPending}
                    >
                      {signup.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center">
              <Link href="/" className="text-sm text-blue-600 hover:underline">
                Back to Homepage
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}