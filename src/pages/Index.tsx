
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page automatically
    // In a real app, you might check if user is already logged in here
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-6 text-white">
      <div className="w-full max-w-lg text-center animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">AccueilPro</h1>
        <div className="inline-block bg-white text-primary px-4 py-1 rounded-full text-lg font-medium mb-8">
          CGI
        </div>
        
        <p className="text-xl mb-8">
          La solution moderne pour gérer vos visiteurs
        </p>
        
        <Button 
          onClick={() => navigate("/login")} 
          className="bg-white text-primary hover:bg-secondary px-8 py-6 text-lg rounded-full"
        >
          Commencer
        </Button>
        
        <div className="mt-16 text-white/70 text-sm">
          Chargement en cours, veuillez patienter...
        </div>
      </div>
    </div>
  );
};

export default Index;
