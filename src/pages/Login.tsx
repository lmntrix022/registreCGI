import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, signUp, session, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    full_name: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session) {
      console.log("Already logged in, redirecting to dashboard");
      navigate("/dashboard", { replace: true });
    }
  }, [session, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Chargement...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log(`Attempting to ${isSignUp ? 'sign up' : 'sign in'} with email: ${credentials.email}`);
      
      if (isSignUp) {
        await signUp(
          credentials.email, 
          credentials.password, 
          { full_name: credentials.full_name }
        );
        toast({
          title: "Inscription réussie",
          description: "Veuillez vérifier votre email pour confirmer votre compte.",
        });
      } else {
        await signIn(credentials.email, credentials.password);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur AccueilPro Digital.",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        variant: "destructive",
        title: isSignUp ? "Erreur d'inscription" : "Erreur de connexion",
        description: error.message || (isSignUp ? "L'inscription a échoué." : "Veuillez vérifier vos identifiants."),
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (session) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AccueilPro</h1>
          <div className="inline-block bg-white text-primary px-3 py-1 rounded-full text-sm font-medium">
            Digital
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-accent/30 space-y-1">
            <CardTitle className="text-2xl text-center font-bold">
              {isSignUp ? "Créer un compte" : "Connexion"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="full_name">Nom complet</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    placeholder="Entrez votre nom complet"
                    value={credentials.full_name}
                    onChange={handleChange}
                    className="rounded-md"
                    required={isSignUp}
                    disabled={isLoading}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Entrez votre email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="rounded-md"
                  autoFocus
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  {!isSignUp && (
                    <a 
                      href="#" 
                      className="text-xs text-primary underline underline-offset-4 hover:text-primary/80"
                    >
                      Mot de passe oublié?
                    </a>
                  )}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Entrez votre mot de passe"
                  value={credentials.password}
                  onChange={handleChange}
                  className="rounded-md"
                  required
                  disabled={isLoading}
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-primary text-white hover:bg-primary/90"
            >
              {isLoading ? "Chargement..." : (isSignUp ? "S'inscrire" : "Se connecter")}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setIsSignUp(!isSignUp)}
              type="button"
              disabled={isLoading}
            >
              {isSignUp ? "Déjà un compte? Se connecter" : "Pas de compte? S'inscrire"}
            </Button>
          </CardFooter>
        </Card>
        
        <p className="text-center mt-4 text-white/70 text-sm">
          &copy; 2025 AccueilPro Digital. Tous droits réservés.
        </p>
      </div>
    </div>
  );
};

export default Login;
