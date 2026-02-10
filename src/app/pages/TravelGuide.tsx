import { BookOpen } from "lucide-react";
import { Card } from "../components/ui/card";

export function TravelGuide() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">ভ্রমন গাইড</h1>
        <p className="text-white/90 text-sm">Travel Guide for Bangladesh</p>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            The Travel Guide section is under development. Stay tuned for comprehensive travel tips, guides, and recommendations!
          </p>
        </Card>
      </div>
    </div>
  );
}
