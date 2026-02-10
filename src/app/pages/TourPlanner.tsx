import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Plus, MapPin, DollarSign, Trash2, Calendar, TrendingUp, Edit } from "lucide-react";

interface TourDay {
  id: string;
  day: number;
  destination: string;
  activities: string[];
}

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  day: number;
}

export function TourPlanner() {
  const [tourDays, setTourDays] = useState<TourDay[]>([
    {
      id: "1",
      day: 1,
      destination: "Dhaka",
      activities: ["Visit National Museum", "Explore Old Dhaka", "Dinner at Star Kabab"]
    }
  ]);

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: "1", category: "Transport", description: "Metro fare", amount: 60, day: 1 },
    { id: "2", category: "Food", description: "Lunch at Fakruddin", amount: 400, day: 1 },
    { id: "3", category: "Accommodation", description: "Hotel", amount: 2500, day: 1 }
  ]);

  const [isAddingDay, setIsAddingDay] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  const [newDay, setNewDay] = useState({ destination: "", activity: "" });
  const [newExpense, setNewExpense] = useState({
    category: "Transport",
    description: "",
    amount: "",
    day: 1
  });

  const addTourDay = () => {
    if (newDay.destination && newDay.activity) {
      const day: TourDay = {
        id: Date.now().toString(),
        day: tourDays.length + 1,
        destination: newDay.destination,
        activities: [newDay.activity]
      };
      setTourDays([...tourDays, day]);
      setNewDay({ destination: "", activity: "" });
      setIsAddingDay(false);
    }
  };

  const addExpense = () => {
    if (newExpense.description && newExpense.amount) {
      const expense: Expense = {
        id: Date.now().toString(),
        category: newExpense.category,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        day: newExpense.day
      };
      setExpenses([...expenses, expense]);
      setNewExpense({ category: "Transport", description: "", amount: "", day: 1 });
      setIsAddingExpense(false);
    }
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const deleteTourDay = (id: string) => {
    setTourDays(tourDays.filter(d => d.id !== id));
  };

  const totalBudget = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-8 pb-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-2xl font-bold text-white mb-1">পর্যটক খাতা</h1>
        <p className="text-white/90 text-sm">Tour Planner & Budget Tracker</p>
      </div>

      {/* Budget Summary */}
      <div className="px-4 pt-6 pb-4">
        <Card className="bg-gradient-to-br from-accent to-accent/80 text-white p-5 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm opacity-90">Total Budget</span>
            <Badge className="bg-white/20 text-white border-0">
              {tourDays.length} {tourDays.length === 1 ? "Day" : "Days"}
            </Badge>
          </div>
          <div className="text-3xl font-bold mb-4">৳{totalBudget.toLocaleString()}</div>
          
          {/* Category Breakdown */}
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <div key={category} className="bg-white/10 rounded-lg p-2 text-center">
                <p className="text-xs opacity-75">{category}</p>
                <p className="font-semibold text-sm">৳{amount}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Tour Days Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Day Plan
          </h2>
          <Dialog open={isAddingDay} onOpenChange={setIsAddingDay}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-1" />
                Add Day
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Tour Day</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Destination</Label>
                  <Input
                    placeholder="e.g., Sundarbans"
                    value={newDay.destination}
                    onChange={(e) => setNewDay({ ...newDay, destination: e.target.value })}
                  />
                </div>
                <div>
                  <Label>First Activity</Label>
                  <Input
                    placeholder="e.g., Boat tour"
                    value={newDay.activity}
                    onChange={(e) => setNewDay({ ...newDay, activity: e.target.value })}
                  />
                </div>
                <Button onClick={addTourDay} className="w-full bg-primary">
                  Add Day
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {tourDays.map((day) => (
            <Card key={day.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    D{day.day}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      {day.destination}
                    </h3>
                    <ul className="mt-2 space-y-1">
                      {day.activities.map((activity, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert('Edit day details (feature coming soon!)')}
                    className="text-primary hover:text-primary h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTourDay(day.id)}
                    className="text-destructive hover:text-destructive h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Day expenses */}
              <div className="mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Day {day.day} expenses:</span>
                  <span className="font-semibold text-primary">
                    ৳{expenses.filter(e => e.day === day.day).reduce((sum, e) => sum + e.amount, 0)}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Budget Khata Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Budget Khata (খাতা)
          </h2>
          <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-accent text-accent-foreground">
                <Plus className="w-4 h-4 mr-1" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={newExpense.category}
                    onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Accommodation">Accommodation</SelectItem>
                      <SelectItem value="Activities">Activities</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    placeholder="e.g., Bus fare to Cox's Bazar"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Amount (৳)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Day</Label>
                  <Select
                    value={newExpense.day.toString()}
                    onValueChange={(value) => setNewExpense({ ...newExpense, day: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {tourDays.map((day) => (
                        <SelectItem key={day.id} value={day.day.toString()}>
                          Day {day.day} - {day.destination}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addExpense} className="w-full bg-accent">
                  Add Expense
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {expenses.map((expense) => (
            <Card key={expense.id} className="p-3 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 flex-1">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
                  {expense.category}
                </Badge>
                <div className="flex-1">
                  <p className="font-medium text-sm">{expense.description}</p>
                  <p className="text-xs text-muted-foreground">Day {expense.day}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">৳{expense.amount}</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert('Edit expense (feature coming soon!)')}
                    className="text-primary hover:text-primary h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteExpense(expense.id)}
                    className="text-destructive hover:text-destructive h-8 w-8 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {expenses.length === 0 && (
          <Card className="p-8 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No expenses yet. Add your first expense to start tracking!
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}