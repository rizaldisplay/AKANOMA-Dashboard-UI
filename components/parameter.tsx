import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, ShieldCheck } from "lucide-react";

// MOCK realtime websocket simulation
export default function ForexDashboard() {
  const [data, setData] = useState({
    balance: 10000,
    equity: 10000,
    margin: 1200,
    profit: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const profitChange = (Math.random() - 0.45) * 50;
        const newProfit = prev.profit + profitChange;
        return {
          balance: prev.balance,
          equity: prev.balance + newProfit,
          margin: prev.margin,
          profit: newProfit,
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  interface StatCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    positive: boolean;
  }

  const StatCard = ({ title, value, icon, positive }: StatCardProps) => (
    <Card className="rounded-2xl shadow-md">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">${value.toFixed(2)}</p>
        </div>
        <div className={`p-3 rounded-xl ${positive ? "bg-green-100" : "bg-red-100"}`}>
          {icon}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className=" bg-gray-50 min-h-3">
      <h1 className="text-3xl font-bold mb-6 text-center mb-10">📊 Trading Monitor (Realtime)</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Balance"
          value={data.balance}
          icon={<Wallet className="text-blue-600" />}
          positive
        />
        <StatCard
          title="Equity"
          value={data.equity}
          icon={<TrendingUp className="text-purple-600" />}
          positive={data.equity >= data.balance}
        />
        <StatCard
          title="Margin"
          value={data.margin}
          icon={<ShieldCheck className="text-orange-600" />}
          positive
        />
        <StatCard
          title="Profit / Loss"
          value={data.profit}
          icon={
            data.profit >= 0 ? (
              <ArrowUpRight className="text-green-600" />
            ) : (
              <ArrowDownRight className="text-red-600" />
            )
          }
          positive={data.profit >= 0}
        />
      </div>
    </div>
  );
}
