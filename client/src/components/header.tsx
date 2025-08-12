import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Sprout, Menu, LogOut, User } from "lucide-react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Sprout className="text-rwanda-green h-8 w-8" />
            <span className="text-xl font-bold text-gray-900">AgriConnect</span>
            <span className="text-sm text-gray-500 hidden sm:inline">Rwanda</span>
          </Link>
          
          {isAuthenticated ? (
            <>
              <nav className="hidden md:flex space-x-8">
                <Link href="/" className="text-gray-700 hover:text-rwanda-green font-medium">
                  Abahinzi
                </Link>
                <Link href="/price-comparison/eggs" className="text-gray-700 hover:text-rwanda-green font-medium">
                  Ibicuruzwa
                </Link>
                <Link href="/" className="text-gray-700 hover:text-rwanda-green font-medium">
                  Guhura
                </Link>
                {user?.userType === 'admin' && (
                  <Link href="/admin-dashboard" className="text-gray-700 hover:text-rwanda-green font-medium">
                    Ubuyobozi
                  </Link>
                )}
                {user?.userType === 'farmer' && (
                  <Link href="/farmer-dashboard" className="text-gray-700 hover:text-rwanda-green font-medium">
                    Dashboard
                  </Link>
                )}
              </nav>

              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2">
                      {user?.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt={user.firstName || 'User'} 
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                      <span className="hidden sm:inline">{user?.firstName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user?.userType === 'farmer' && (
                      <DropdownMenuItem asChild>
                        <Link href="/farmer-dashboard" className="flex items-center">
                          <Sprout className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {user?.userType === 'admin' && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin-dashboard" className="flex items-center">
                          <Sprout className="mr-2 h-4 w-4" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <a href="/api/logout" className="flex items-center">
                        <LogOut className="mr-2 h-4 w-4" />
                        Gufunga
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <button 
                  className="md:hidden text-gray-700"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </>
          ) : (
            <>
              <nav className="hidden md:flex space-x-8">
                <a href="#" className="text-gray-700 hover:text-rwanda-green font-medium">
                  Abahinzi
                </a>
                <a href="#" className="text-gray-700 hover:text-rwanda-green font-medium">
                  Ibicuruzwa
                </a>
                <a href="#" className="text-gray-700 hover:text-rwanda-green font-medium">
                  Guhura
                </a>
                <a href="#" className="text-gray-700 hover:text-rwanda-green font-medium">
                  Ubuyobozi
                </a>
              </nav>

              <div className="flex items-center space-x-4">
                {!isLoading && (
                  <Button 
                    className="bg-rwanda-green text-white hover:bg-emerald-700"
                    onClick={() => window.location.href = '/api/login'}
                  >
                    <svg className="fab fa-google mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Injira
                  </Button>
                )}
                <button className="md:hidden text-gray-700">
                  <Menu className="h-6 w-6" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-rwanda-green">
              Abahinzi
            </Link>
            <Link href="/price-comparison/eggs" className="block px-3 py-2 text-gray-700 hover:text-rwanda-green">
              Ibicuruzwa
            </Link>
            <a href="#" className="block px-3 py-2 text-gray-700 hover:text-rwanda-green">
              Guhura
            </a>
            {isAuthenticated && user?.userType === 'admin' && (
              <Link href="/admin-dashboard" className="block px-3 py-2 text-gray-700 hover:text-rwanda-green">
                Ubuyobozi
              </Link>
            )}
            {isAuthenticated && user?.userType === 'farmer' && (
              <Link href="/farmer-dashboard" className="block px-3 py-2 text-gray-700 hover:text-rwanda-green">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
