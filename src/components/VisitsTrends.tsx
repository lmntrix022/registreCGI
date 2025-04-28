
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Visitor } from "@/types";
import { 
  addDays, 
  differenceInMinutes,
  format, 
  isSameMonth, 
  isSameWeek,
  parseISO 
} from "date-fns";
import { fr } from "date-fns/locale";

interface VisitsTrendsProps {
  visitors: Visitor[];
}

const VisitsTrends = ({ visitors }: VisitsTrendsProps) => {
  // Calculate week over week growth
  const previousWeekVisitors = visitors.filter(v => {
    const visitDate = new Date(v.check_in_time);
    const oneWeekAgo = addDays(new Date(), -7);
    const twoWeeksAgo = addDays(new Date(), -14);
    return visitDate >= twoWeeksAgo && visitDate < oneWeekAgo;
  }).length;

  const currentWeekVisitors = visitors.filter(v => {
    const visitDate = new Date(v.check_in_time);
    const oneWeekAgo = addDays(new Date(), -7);
    return visitDate >= oneWeekAgo;
  }).length;

  // Calculate month over month growth
  const previousMonthVisitors = visitors.filter(v => {
    const visitDate = new Date(v.check_in_time);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    return visitDate >= twoMonthsAgo && visitDate < oneMonthAgo;
  }).length;

  const currentMonthVisitors = visitors.filter(v => {
    const visitDate = new Date(v.check_in_time);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return visitDate >= oneMonthAgo;
  }).length;

  // Calculate average visit duration
  const completedVisits = visitors.filter(v => 
    v.is_checked_out && v.check_out_time
  );

  const totalDurationMinutes = completedVisits.reduce((total, visit) => {
    const checkInTime = typeof visit.check_in_time === 'string' 
      ? parseISO(visit.check_in_time) 
      : visit.check_in_time;
      
    const checkOutTime = visit.check_out_time 
      ? (typeof visit.check_out_time === 'string' ? parseISO(visit.check_out_time) : visit.check_out_time)
      : new Date();
      
    return total + differenceInMinutes(checkOutTime, checkInTime);
  }, 0);

  const averageVisitDuration = completedVisits.length 
    ? Math.round(totalDurationMinutes / completedVisits.length) 
    : 0;

  // Calculate week growth percentage
  const weekGrowth = previousWeekVisitors === 0 
    ? (currentWeekVisitors > 0 ? 100 : 0)
    : Math.round(((currentWeekVisitors - previousWeekVisitors) / previousWeekVisitors) * 100);

  // Calculate month growth percentage
  const monthGrowth = previousMonthVisitors === 0 
    ? (currentMonthVisitors > 0 ? 100 : 0)
    : Math.round(((currentMonthVisitors - previousMonthVisitors) / previousMonthVisitors) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Croissance hebdomadaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <div className="text-2xl font-bold">
              {weekGrowth}%
            </div>
            <div className={`ml-2 text-sm ${weekGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
              {weekGrowth >= 0 ? "+" : ""}{weekGrowth}%
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Comparé à la semaine précédente
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Croissance mensuelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline">
            <div className="text-2xl font-bold">
              {monthGrowth}%
            </div>
            <div className={`ml-2 text-sm ${monthGrowth >= 0 ? "text-green-500" : "text-red-500"}`}>
              {monthGrowth >= 0 ? "+" : ""}{monthGrowth}%
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Comparé au mois précédent
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Durée moyenne de visite
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {averageVisitDuration} min
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Basé sur {completedVisits.length} visites terminées
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitsTrends;
