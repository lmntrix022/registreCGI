
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HistorySearchProps {
  onSearch: (value: string) => void;
}

const HistorySearch = ({ onSearch }: HistorySearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  useEffect(() => {
    // Add debouncing for better performance
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 300);
    
    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);
  
  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className={`relative rounded-md transition-all ${isFocused ? 'ring-2 ring-primary/20' : ''}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <Input
        type="text"
        value={searchTerm}
        placeholder="Rechercher un visiteur ou un hôte..."
        className="pl-10 pr-10"
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {searchTerm && (
        <Button 
          variant="ghost" 
          size="sm"
          className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-gray-100"
          onClick={handleClear}
        >
          <X className="h-4 w-4 text-gray-500" />
        </Button>
      )}
    </div>
  );
};

export default HistorySearch;
