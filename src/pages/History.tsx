
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Visitor } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useMemo } from "react";
import HistorySearch from "@/components/HistorySearch";
import HistoryFilters from "@/components/HistoryFilters";

const History = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  // Fetch visitor history
  const { data: visitors = [], isLoading } = useQuery({
    queryKey: ['visitors', 'history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('visitors')
        .select('*')
        .order('check_in_time', { ascending: false });
      
      if (error) throw error;
      return data as unknown as Visitor[];
    }
  });

  // Filtrer et rechercher les visiteurs
  const filteredVisitors = useMemo(() => {
    return visitors.filter((visitor) => {
      const matchesSearch = searchTerm === "" || 
        visitor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visitor.person_to_visit.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = 
        filter === "all" ||
        (filter === "active" && !visitor.is_checked_out) ||
        (filter === "completed" && visitor.is_checked_out);

      return matchesSearch && matchesFilter;
    });
  }, [visitors, searchTerm, filter]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Historique des visites</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <HistorySearch onSearch={setSearchTerm} />
          </div>
          <div>
            <HistoryFilters onFilterChange={setFilter} />
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-10">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Chargement des données...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visiteur
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visite
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date d'arrivée
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date de départ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durée
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredVisitors.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                        Aucune visite trouvée
                      </td>
                    </tr>
                  ) : (
                    filteredVisitors.map((visitor) => {
                      const checkInDate = new Date(visitor.check_in_time);
                      const checkOutDate = visitor.check_out_time ? new Date(visitor.check_out_time) : null;
                      const duration = checkOutDate ? 
                        Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60)) : 
                        null;
                      
                      return (
                        <tr key={visitor.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {visitor.photo ? (
                                <img 
                                  src={visitor.photo} 
                                  alt={`${visitor.first_name} ${visitor.last_name}`}
                                  className="w-10 h-10 rounded-full mr-3 object-cover" 
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                  <span className="text-gray-500 font-medium">
                                    {visitor.first_name[0]}{visitor.last_name[0]}
                                  </span>
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{visitor.first_name} {visitor.last_name}</div>
                                <div className="text-sm text-gray-500">{visitor.id_type}: {visitor.id_number}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">{visitor.phone}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">{visitor.visit_purpose}</div>
                            <div className="text-sm text-gray-500">Pour: {visitor.person_to_visit}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm">
                              {checkInDate.toLocaleDateString('fr-FR', { 
                                day: '2-digit', 
                                month: '2-digit',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="text-sm text-gray-500">
                              {checkInDate.toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {checkOutDate ? (
                              <>
                                <div className="text-sm">
                                  {checkOutDate.toLocaleDateString('fr-FR', { 
                                    day: '2-digit', 
                                    month: '2-digit',
                                    year: 'numeric'
                                  })}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {checkOutDate.toLocaleTimeString('fr-FR', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </div>
                              </>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                En cours
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {duration !== null ? (
                              <span className="text-sm">
                                {duration < 60 ? 
                                  `${duration} min` : 
                                  `${Math.floor(duration / 60)}h ${duration % 60}min`}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default History;
