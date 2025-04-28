
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Visitor } from "@/types";

interface VisitorFormProps {
  onAddVisitor: (visitor: Omit<Visitor, 'id' | 'created_by' | 'check_in_time' | 'is_checked_out'>) => Promise<any>;
}

const VisitorForm = ({ onAddVisitor }: VisitorFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitorData, setVisitorData] = useState<Partial<Visitor>>({
    first_name: "",
    last_name: "",
    phone: "",
    id_type: "nationalId",
    id_number: "",
    visit_purpose: "",
    person_to_visit: "",
  });

  const handleChange = (name: keyof Visitor, value: any) => {
    setVisitorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onAddVisitor(visitorData as Omit<Visitor, 'id' | 'created_by' | 'check_in_time' | 'is_checked_out'>);
      // Reset form after successful submission
      setVisitorData({
        first_name: "",
        last_name: "",
        phone: "",
        id_type: "nationalId",
        id_number: "",
        visit_purpose: "",
        person_to_visit: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input 
                id="firstName"
                value={visitorData.first_name}
                onChange={(e) => handleChange('first_name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input 
                id="lastName"
                value={visitorData.last_name}
                onChange={(e) => handleChange('last_name', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input 
                id="phone"
                value={visitorData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idType">Type de pièce d'identité</Label>
              <Select 
                value={visitorData.id_type} 
                onValueChange={(value) => handleChange('id_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="passport">Passeport</SelectItem>
                  <SelectItem value="nationalId">Carte d'identité</SelectItem>
                  <SelectItem value="driverLicense">Permis de conduire</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="idNumber">Numéro de pièce d'identité</Label>
              <Input 
                id="idNumber"
                value={visitorData.id_number}
                onChange={(e) => handleChange('id_number', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="personToVisit">Personne à visiter</Label>
              <Input 
                id="personToVisit"
                value={visitorData.person_to_visit}
                onChange={(e) => handleChange('person_to_visit', e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="visitPurpose">Motif de la visite</Label>
            <Textarea 
              id="visitPurpose"
              value={visitorData.visit_purpose}
              onChange={(e) => handleChange('visit_purpose', e.target.value)}
              required
              className="min-h-[100px]"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer le visiteur"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VisitorForm;
