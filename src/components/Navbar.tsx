import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { toast } = useToast();
  const location = useLocation();
  const { profile, signOut, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "Vous avez été déconnecté avec succès.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de déconnexion",
        description: error.message || "Une erreur est survenue lors de la déconnexion.",
      });
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  if (loading) {
    return (
      <nav className="bg-white border-b border-gray-100 py-4 px-6 shadow-sm backdrop-blur-lg bg-opacity-80">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-premium-600 to-premium-400 bg-clip-text text-transparent">
              AccueilPro
            </div>
            <span className="bg-green-50 text-green-600 text-xs px-3 py-1 rounded-full font-medium">
              CGI
            </span>
          </div>
          <div className="h-8 w-24 animate-pulse bg-gray-100 rounded-md"></div>
        </div>
      </nav>
    );
  }

  if (location.pathname === "/login") {
    return (
      <nav className="bg-white border-b border-gray-100 py-4 px-6 shadow-sm backdrop-blur-lg bg-opacity-80">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-2xl font-bold bg-gradient-to-r from-premium-600 to-premium-400 bg-clip-text text-transparent">
              AccueilPro
            </div>
            <span className="bg-premium-50 text-premium-600 text-xs px-3 py-1 rounded-full font-medium">
              CGI
            </span>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-100 py-4 px-6 shadow-sm backdrop-blur-lg bg-opacity-80 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-bold bg-gradient-to-r from-premium-600 to-premium-400 bg-clip-text text-transparent">
            <img src="/images/logo.webp" alt="Logo CGI" className="w-24 h-auto" />
          </div>
          <span className="bg-green-50 text-green-600 text-xs px-3 py-1 rounded-full font-medium">
            CGI
          </span>
        </div>

        <div className="hidden md:flex space-x-8">
          <Link 
            to="/dashboard" 
            className={`hover:text-premium-600 transition-colors text-sm font-medium ${
              isActive('/dashboard') 
                ? 'text-premium-600' 
                : 'text-gray-600'
            }`}
          >
            Tableau de bord
          </Link>
          <Link 
            to="/history" 
            className={`hover:text-premium-600 transition-colors text-sm font-medium ${
              isActive('/history') 
                ? 'text-premium-600' 
                : 'text-gray-600'
            }`}
          >
            Historique
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-900">
              {profile?.full_name || 'Utilisateur'}
            </p>
            <p className="text-xs text-gray-500">
              {profile?.role || 'Réception'}
            </p>
          </div>
          <Button 
            variant="outline" 
            className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
