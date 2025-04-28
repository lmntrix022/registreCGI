
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Stats from "@/components/Stats";
import VisitorForm from "@/components/VisitorForm";
import VisitorList from "@/components/VisitorList";
import { Visitor, DashboardStats } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import VisitorsChart from "@/components/VisitorsChart";
import VisitsTrends from "@/components/VisitsTrends";

const Dashboard = () => {
  const queryClient = useQueryClient();
  const { user, loading } = useAuth();

  // Si l'authentification est en cours de chargement, afficher un indicateur
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Chargement des données...</p>
          </div>
        </main>
      </div>
    );
  }

  const { data: visitors = [], isLoading: visitorsLoading } = useQuery({
    queryKey: ['visitors'],
    queryFn: async () => {
      console.log("Fetching visitors...");
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('check_in_time', { ascending: false });
      
      if (error) {
        console.error("Error fetching visitors:", error);
        throw error;
      }
      console.log("Visitors fetched:", data);
      return data as unknown as Visitor[];
    }
  });

  const stats: DashboardStats = {
    currentVisitors: visitors.filter(v => !v.is_checked_out).length,
    todayVisitors: visitors.filter(v => {
      const today = new Date();
      const checkIn = new Date(v.check_in_time);
      return checkIn.toDateString() === today.toDateString();
    }).length,
    weekVisitors: visitors.filter(v => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const checkIn = new Date(v.check_in_time);
      return checkIn >= weekAgo;
    }).length,
    monthVisitors: visitors.filter(v => {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      const checkIn = new Date(v.check_in_time);
      return checkIn >= monthAgo;
    }).length
  };

  useEffect(() => {
    console.log("Setting up realtime subscription...");
    const channel = supabase
      .channel('visitors-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'visitors' },
        (payload) => {
          console.log("Realtime update received:", payload);
          queryClient.invalidateQueries({ queryKey: ['visitors'] });
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up realtime subscription...");
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleAddVisitor = async (newVisitor: Omit<Visitor, 'id' | 'created_by' | 'check_in_time' | 'is_checked_out'>) => {
    try {
      console.log("Adding visitor:", newVisitor);
      const { data, error } = await supabase
        .from('visitors')
        .insert([
          {
            first_name: newVisitor.first_name,
            last_name: newVisitor.last_name,
            phone: newVisitor.phone,
            id_type: newVisitor.id_type,
            id_number: newVisitor.id_number,
            photo: newVisitor.photo,
            visit_purpose: newVisitor.visit_purpose,
            person_to_visit: newVisitor.person_to_visit,
            created_by: user?.id
          }
        ])
        .select()
        .single();

      if (error) {
        console.error("Error adding visitor:", error);
        throw error;
      }
      
      console.log("Visitor added successfully:", data);
      toast({
        title: "Visiteur ajouté",
        description: "Le visiteur a été enregistré avec succès",
      });
      
      return data;
    } catch (error: any) {
      console.error("Error in handleAddVisitor:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
      });
      throw error;
    }
  };

  const handleCheckout = async (id: string) => {
    try {
      console.log("Checking out visitor:", id);
      const { error } = await supabase
        .from('visitors')
        .update({
          check_out_time: new Date().toISOString(),
          is_checked_out: true
        })
        .eq('id', id);

      if (error) {
        console.error("Error checking out visitor:", error);
        throw error;
      }
      
      console.log("Visitor checked out successfully");
      toast({
        title: "Visiteur parti",
        description: "Le départ du visiteur a été enregistré",
      });
    } catch (error: any) {
      console.error("Error in handleCheckout:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
        
        {visitorsLoading ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Chargement des données...</p>
          </div>
        ) : (
          <>
            <Stats stats={stats} />
            
            <div className="my-6 space-y-6">
              <VisitorsChart visitors={visitors} />
              <VisitsTrends visitors={visitors} />
            </div>
            
            <Tabs defaultValue="visitors" className="mt-6">
              <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
                <TabsTrigger value="visitors">
                  Visiteurs
                </TabsTrigger>
                <TabsTrigger value="registration">
                  Nouvel enregistrement
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="visitors">
                <VisitorList visitors={visitors} onCheckout={handleCheckout} />
              </TabsContent>
              
              <TabsContent value="registration">
                <VisitorForm onAddVisitor={handleAddVisitor} />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
