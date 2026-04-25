"use client";

import SideNavBar from "@/components/SideNavBar";
import TopNavBar from "@/components/TopNavBar";
import ChartPanel from "@/components/ChartPanel";
import StatCard from "@/components/StatCard";
import AIReport from "@/components/AIReport";
import RenewableEnergyTool from "@/components/RenewableEnergyTool";

export default function ClimateTrends() {
  const mockAnomalyData = [
    { year: "2015", val: -0.2 },
    { year: "2018", val: 0.3 },
    { year: "2021", val: 0.5 },
    { year: "2025", val: 1.8 },
  ];

  return (
    <div className="flex min-h-screen">
      <SideNavBar activeTab="climate" />
      <div className="flex flex-col flex-1 ml-sidebar-width">
        <TopNavBar />
        <main className="pt-16 min-h-screen p-gutter-lg flex flex-col gap-stack-md">
          <div className="mt-8">
            <h1 className="font-headline-lg text-headline-lg text-on-surface text-4xl">
              İqlim Trendləri
            </h1>
            <p className="font-body-md text-on-surface-variant">Azərbaycanın son 10 illik iqlim analizi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
            <StatCard 
              label="Orta Temp. Artımı" 
              value="+1.4" 
              unit="°C" 
              icon="TrendingUp" 
              status="red" 
              description="Son 10 ildə Azərbaycan ərazisində qeydə alınan orta illik temperatur artımı."
            />
            <StatCard 
              label="İsti Günlər (illik)" 
              value="42" 
              unit="gün" 
              icon="Sun" 
              status="amber" 
              description="Havanın temperaturunun 35°C-dən yuxarı olduğu günlərin sayı."
            />
            <StatCard 
              label="Quraqlıq Günləri" 
              value="124" 
              unit="gün" 
              icon="Droplets" 
              status="amber" 
              description="Yağıntının normadan az olduğu ardıcıl günlərin cəmi."
            />
            <StatCard 
              label="Külək Sürəti (max)" 
              value="58" 
              unit="km/h" 
              icon="Wind" 
              description="Maksimal külək sürəti. Külək enerjisi potensialı üçün əsas göstəricidir."
            />
          </div>

          <div className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-6">
            <h3 className="font-headline-md mb-6">İllik Temperatur Anomaliyası</h3>
            <ChartPanel type="bar" data={mockAnomalyData} xKey="year" yKey="val" color="#EF4444" height={300} />
          </div>

          <RenewableEnergyTool />

          <AIReport />
        </main>
      </div>
    </div>
  );
}
