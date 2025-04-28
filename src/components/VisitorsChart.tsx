
import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { eachDayOfInterval, format, subDays, isSameDay } from "date-fns";
import { fr } from "date-fns/locale";
import { Visitor } from "@/types";
import { ChartPie, ChartBar } from "lucide-react";

interface VisitorsChartProps {
  visitors: Visitor[];
}

const VisitorsChart = ({ visitors }: VisitorsChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartView, setChartView] = useState<"daily" | "weekly">("daily");

  useEffect(() => {
    if (!visitors.length) return;

    // Get date range for chart (last 7 days)
    const endDate = new Date();
    const startDate = subDays(endDate, chartView === "daily" ? 6 : 13);
    
    // Create array of days in the range
    const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Transform visitor data
    const data = daysInRange.map(day => {
      // Count new visitors on this day
      const newVisitorsCount = visitors.filter(v => 
        isSameDay(new Date(v.check_in_time), day)
      ).length;

      // Count completed visits on this day
      const completedVisitsCount = visitors.filter(v => 
        v.is_checked_out && 
        v.check_out_time && 
        isSameDay(new Date(v.check_out_time), day)
      ).length;

      return {
        date: format(day, chartView === "daily" ? "dd MMM" : "dd MMM", { locale: fr }),
        fullDate: format(day, "yyyy-MM-dd"),
        nouveauxVisiteurs: newVisitorsCount,
        visiteTerminées: completedVisitsCount,
      };
    });
    
    setChartData(data);
  }, [visitors, chartView]);

  if (!chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 rounded-lg border border-gray-100 bg-white/50 backdrop-blur-sm">
        <p className="text-sm">Chargement des données...</p>
      </div>
    );
  }

  const chartConfig = {
    nouveauxVisiteurs: {
      label: "Nouveaux visiteurs", 
      color: "#6366f1"
    },
    visiteTerminées: {
      label: "Visites terminées", 
      color: "#4f46e5"
    }
  };

  return (
    <div className="border rounded-xl bg-white shadow-sm p-6 transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-green-600 to-orange-400 bg-clip-text text-transparent">
          Activité des visiteurs
        </h3>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setChartView("daily")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              chartView === "daily" 
                ? "bg-green-50 text-green-600" 
                : "bg-green-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChartBar className="mr-2 h-4 w-4" />
            7 jours
          </button>
          <button 
            onClick={() => setChartView("weekly")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              chartView === "weekly" 
                ? "bg-indigo-50 text-indigo-600" 
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            <ChartPie className="mr-2 h-4 w-4" />
            14 jours
          </button>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="aspect-[4/2] h-[300px]">
        <BarChart data={chartData} barGap={8}>
          <XAxis 
            dataKey="date"
            tickLine={false} 
            axisLine={false}
            fontSize={12}
            dy={8}
          />
          <YAxis 
            tickLine={false} 
            axisLine={false}
            fontSize={12}
            dx={-8}
            tickFormatter={(value) => `${value}`}
          />
          <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
          <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) => `Date: ${label}`} />} />
          <Bar 
            dataKey="nouveauxVisiteurs" 
            fill="#6366f1" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={45}
          />
          <Bar 
            dataKey="visiteTerminées" 
            fill="#4f46e5" 
            radius={[4, 4, 0, 0]} 
            maxBarSize={45}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: "1.5rem",
              fontSize: "0.875rem"
            }}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default VisitorsChart;
