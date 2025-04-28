
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Visitor } from "@/types";

interface VisitorListProps {
  visitors: Visitor[];
  onCheckout: (id: string) => Promise<void>;
}

const VisitorList = ({ visitors, onCheckout }: VisitorListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  
  const handleCheckout = async (id: string) => {
    setIsProcessing(id);
    try {
      await onCheckout(id);
    } finally {
      setIsProcessing(null);
    }
  };
  
  // Filter visitors based on search term
  const filteredVisitors = visitors.filter(visitor => 
    visitor.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.visit_purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visitor.person_to_visit.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter to current visitors for the main display
  const currentVisitors = filteredVisitors.filter(visitor => !visitor.is_checked_out);

  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="bg-white border-b pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <CardTitle>Visiteurs présents</CardTitle>
          <div className="w-full md:w-64">
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-muted/30"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Visiteur</TableHead>
                <TableHead>Personne visitée</TableHead>
                <TableHead>Heure d'arrivée</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentVisitors.length > 0 ? (
                currentVisitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{visitor.first_name} {visitor.last_name}</div>
                        <div className="text-sm text-muted-foreground">{visitor.visit_purpose}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {visitor.person_to_visit}
                    </TableCell>
                    <TableCell>
                      {formatDate(visitor.check_in_time)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-primary hover:text-white hover:bg-primary" 
                        onClick={() => handleCheckout(visitor.id)}
                        disabled={isProcessing === visitor.id}
                      >
                        {isProcessing === visitor.id ? "En cours..." : "Départ"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    {searchTerm ? (
                      <div className="text-muted-foreground">Aucun visiteur ne correspond à la recherche</div>
                    ) : (
                      <div className="flex flex-col items-center py-8">
                        <Badge className="bg-muted text-muted-foreground mb-2">
                          Aucun visiteur présent
                        </Badge>
                        <div className="text-sm text-muted-foreground">
                          Utilisez l'onglet "Nouvel enregistrement" pour ajouter un visiteur
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default VisitorList;
