import { Card } from "../components/ui/card";
import { Construction } from "lucide-react";

export function TrainSchedule() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-transport to-transport/80 px-6 pt-8 pb-6">
        <h1 className="text-2xl font-bold text-white mb-1">ট্রেন</h1>
        <p className="text-white/90 text-sm">Railway Schedules</p>
      </div>

      {/* Coming Soon Content */}
      <div className="px-6 py-16">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-transport/10 flex items-center justify-center mx-auto mb-4">
            <Construction className="w-8 h-8 text-transport" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground text-sm mb-4">
            We're working on bringing you comprehensive railway schedule information
          </p>
          <div className="inline-flex items-center gap-2 bg-transport/10 text-transport px-4 py-2 rounded-lg text-sm">
            <span className="font-medium">Under Development</span>
          </div>
        </Card>

        {/* Placeholder features */}
        <div className="mt-8 space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground mb-3">Planned Features:</h3>
          {[
            "Train schedules and routes",
            "Ticket pricing information",
            "Station details and amenities",
            "Real-time train tracking"
          ].map((feature, idx) => (
            <Card key={idx} className="p-3 flex items-center gap-3 opacity-50">
              <div className="w-6 h-6 rounded-full bg-transport/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-transport">{idx + 1}</span>
              </div>
              <span className="text-sm">{feature}</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
