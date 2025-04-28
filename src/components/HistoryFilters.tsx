
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, ChevronDown, Filter } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface HistoryFiltersProps {
  onFilterChange: (filter: string) => void;
  onDateFilterChange?: (date: Date | undefined) => void;
}

const HistoryFilters = ({ onFilterChange, onDateFilterChange }: HistoryFiltersProps) => {
  const [status, setStatus] = useState<string>("all");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange(value);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (onDateFilterChange) {
      onDateFilterChange(newDate);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les visiteurs</SelectItem>
            <SelectItem value="active">Visite en cours</SelectItem>
            <SelectItem value="completed">Visite terminée</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {onDateFilterChange && (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="justify-start text-left font-normal"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {date ? format(date, "d MMMM yyyy", { locale: fr }) : "Filtrer par date"}
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
              locale={fr}
            />
            {date && (
              <div className="p-3 border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDateChange(undefined)} 
                  className="w-full"
                >
                  Effacer
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default HistoryFilters;
