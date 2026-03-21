import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  LogOut,
  Tractor as TractorIcon,
  DollarSign,
  Package,
  MessageSquare,
} from "lucide-react";

interface StatsCardsProps {
  stats: {
    activeBookings: number;
    todayCheckouts: number;
    todayReturns: number;
    monthRevenue: number;
    totalMachines: number;
    unreadMessages: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Active Bookings",
      value: stats.activeBookings,
      icon: ClipboardList,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Today's Checkouts",
      value: stats.todayCheckouts,
      icon: LogOut,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Today's Returns",
      value: stats.todayReturns,
      icon: TractorIcon,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Monthly Revenue",
      value: `$${Number(stats.monthRevenue).toLocaleString("en-NZ", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Total Machines",
      value: stats.totalMachines,
      icon: Package,
      color: "text-purple-600 bg-purple-50",
    },
    {
      label: "Unread Messages",
      value: stats.unreadMessages,
      icon: MessageSquare,
      color: "text-red-600 bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
