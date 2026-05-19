import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "green" | "gold" | "red" | "blue" | "purple";
}

const colorMap = {
  green: "bg-green-50 text-green-700 border-green-200",
  gold: "bg-yellow-50 text-yellow-700 border-yellow-200",
  red: "bg-red-50 text-red-700 border-red-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function StatCard({ title, value, icon: Icon, color = "green" }: StatCardProps) {
  return (
    <div className={cn("rounded-lg border p-4 md:p-5 flex items-center gap-4", colorMap[color])}>
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/80">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <div className="text-sm opacity-80">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}
