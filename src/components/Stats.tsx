
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "@/types";

interface StatsProps {
  stats: DashboardStats;
}

const Stats = ({ stats }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card className="bg-white shadow-md card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Visiteurs actuels
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {stats.currentVisitors}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Présents dans vos locaux
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Aujourd'hui
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {stats.todayVisitors}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Visiteurs du jour
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Cette semaine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {stats.weekVisitors}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Derniers 7 jours
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-md card-hover">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Ce mois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">
            {stats.monthVisitors}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Derniers 30 jours
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;
