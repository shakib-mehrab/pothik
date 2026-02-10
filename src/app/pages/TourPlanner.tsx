import { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Plus, MapPin, DollarSign, Trash2, Calendar, Users, CheckCircle2, X, ChevronLeft, ListTodo, AlertCircle } from "lucide-react";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
}

interface Tour {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  members: string[];
  places: string[];
  expenses: Expense[];
  todos: TodoItem[];
  isActive: boolean;
}

export function TourPlanner() {
  const [tours, setTours] = useState<Tour[]>([
    {
      id: "tour-1",
      name: "Cox's Bazar Trip",
      destination: "Cox's Bazar",
      startDate: "2026-03-15",
      endDate: "2026-03-18",
      budget: 15000,
      members: ["আমি", "রহিম", "করিম"],
      places: ["Cox's Bazar Beach", "Inani Beach", "Himchari"],
      expenses: [
        { id: "exp-1", description: "Bus Tickets", amount: 4500, paidBy: "আমি" },
        { id: "exp-2", description: "Hotel (3 nights)", amount: 9000, paidBy: "রহিম" }
      ],
      todos: [
        { id: "todo-1", text: "Book bus tickets", completed: true },
        { id: "todo-2", text: "Book hotel", completed: true },
        { id: "todo-3", text: "Pack clothes", completed: false }
      ],
      isActive: true
    }
  ]);

  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isCreatingTour, setIsCreatingTour] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const [newTour, setNewTour] = useState({
    name: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    memberInput: "",
    members: ["আমি"],
  });

  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    paidBy: "",
  });

  const [newPlace, setNewPlace] = useState("");
  const [newTodo, setNewTodo] = useState("");

  const createTour = () => {
    if (newTour.name && newTour.destination && newTour.budget) {
      const tour: Tour = {
        id: Date.now().toString(),
        name: newTour.name,
        destination: newTour.destination,
        startDate: newTour.startDate,
        endDate: newTour.endDate,
        budget: parseFloat(newTour.budget),
        members: newTour.members,
        places: [],
        expenses: [],
        todos: [],
        isActive: true,
      };
      setTours([...tours, tour]);
      setNewTour({
        name: "",
        destination: "",
        startDate: "",
        endDate: "",
        budget: "",
        memberInput: "",
        members: ["আমি"],
      });
      setIsCreatingTour(false);
    }
  };

  const addMember = () => {
    if (newTour.memberInput.trim() && !newTour.members.includes(newTour.memberInput.trim())) {
      setNewTour({
        ...newTour,
        members: [...newTour.members, newTour.memberInput.trim()],
        memberInput: "",
      });
    }
  };

  const removeMember = (member: string) => {
    if (member !== "আমি") {
      setNewTour({
        ...newTour,
        members: newTour.members.filter((m) => m !== member),
      });
    }
  };

  const addExpense = () => {
    if (selectedTour && newExpense.description && newExpense.amount && newExpense.paidBy) {
      const expense: Expense = {
        id: Date.now().toString(),
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        paidBy: newExpense.paidBy,
      };
      const updatedTour = {
        ...selectedTour,
        expenses: [...selectedTour.expenses, expense],
      };
      setTours(tours.map((t) => (t.id === selectedTour.id ? updatedTour : t)));
      setSelectedTour(updatedTour);
      setNewExpense({ description: "", amount: "", paidBy: "" });
      setIsAddingExpense(false);
    }
  };

  const deleteExpense = (expId: string) => {
    if (selectedTour) {
      const updatedTour = {
        ...selectedTour,
        expenses: selectedTour.expenses.filter((e) => e.id !== expId),
      };
      setTours(tours.map((t) => (t.id === selectedTour.id ? updatedTour : t)));
      setSelectedTour(updatedTour);
    }
  };

  const addPlace = () => {
    if (selectedTour && newPlace.trim()) {
      const updatedTour = {
        ...selectedTour,
        places: [...selectedTour.places, newPlace.trim()],
      };
      setTours(tours.map((t) => (t.id === selectedTour.id ? updatedTour : t)));
      setSelectedTour(updatedTour);
      setNewPlace("");
      setIsAddingPlace(false);
    }
  };

  const removePlace = (place: string) => {
    if (selectedTour) {
      const updatedTour = {
        ...selectedTour,
        places: selectedTour.places.filter((p) => p !== place),
      };
      setTours(tours.map((t) => (t.id === selectedTour.id ? updatedTour : t)));
      setSelectedTour(updatedTour);
    }
  };

  const addTodo = () => {
    if (selectedTour && newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
      };
      const updatedTour = {
        ...selectedTour,
        todos: [...selectedTour.todos, todo],
      };
      setTours(tours.map((t) => (t.id === selectedTour.id ? updatedTour : t)));
      setSelectedTour(updatedTour);
      setNewTodo("");
      setIsAddingTodo(false);
    }
  };

  const toggleTodo = (todoId: string) => {
    if (selectedTour) {
      const updatedTour = {
        ...selectedTour,
        todos: selectedTour.todos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        ),
      };
      setTours(tours.map((t) => (t.id === selectedTour.id ? updatedTour : t)));
      setSelectedTour(updatedTour);
    }
  };

  const deleteTodo = (todoId: string) => {
    if (selectedTour) {
      const updatedTour = {
        ...selectedTour,
        todos: selectedTour.todos.filter((todo) => todo.id !== todoId),
      };
      setTours(tours.map((t) => (t.id === selectedTour.id ? updatedTour : t)));
      setSelectedTour(updatedTour);
    }
  };

  const endTrip = () => {
    if (selectedTour) {
      const updatedTour = { ...selectedTour, isActive: false };
      setTours(tours.map((t) => (t.id === selectedTour.id ? updatedTour : t)));
      setSelectedTour(null);
    }
  };

  const calculateSplitExpenses = () => {
    if (!selectedTour) return {};

    const totalExpenses = selectedTour.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const perPersonShare = totalExpenses / selectedTour.members.length;

    const memberPaid: Record<string, number> = {};
    selectedTour.members.forEach((m) => (memberPaid[m] = 0));
    selectedTour.expenses.forEach((exp) => {
      memberPaid[exp.paidBy] = (memberPaid[exp.paidBy] || 0) + exp.amount;
    });

    const balances: Record<string, number> = {};
    selectedTour.members.forEach((m) => {
      balances[m] = memberPaid[m] - perPersonShare;
    });

    return { totalExpenses, perPersonShare, balances };
  };

  // Tours List View
  if (!selectedTour) {
    return (
      <div className="min-h-screen bg-background pb-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-travel to-travel/80 px-6 pt-8 pb-6 sticky top-0 z-10 shadow-sm">
          <h1 className="text-2xl font-bold text-white mb-1">ঘুরতে যাই</h1>
          <p className="text-white/90 text-sm">Tour Planner & Expense Manager</p>
        </div>

        {/* Create Tour Button */}
        <div className="px-4 pt-6 pb-4">
          <Dialog open={isCreatingTour} onOpenChange={setIsCreatingTour}>
            <DialogTrigger asChild>
              <Button className="w-full bg-travel text-travel-foreground">
                <Plus className="w-5 h-5 mr-2" />
                নতুন ট্যুর তৈরি করুন
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto p-4">
              <DialogHeader>
                <DialogTitle className="text-base">নতুন ট্যুর তৈরি করুন</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createTour();
                }}
                className="space-y-3 pt-2"
              >
                <div>
                  <Label className="text-xs font-medium">ট্যুরের নাম *</Label>
                  <Input
                    required
                    placeholder="যেমন: কক্সবাজার ট্রিপ"
                    value={newTour.name}
                    onChange={(e) => setNewTour({ ...newTour, name: e.target.value })}
                    className="mt-1 h-9 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium">গন্তব্য *</Label>
                  <Input
                    required
                    placeholder="যেমন: কক্সবাজার"
                    value={newTour.destination}
                    onChange={(e) => setNewTour({ ...newTour, destination: e.target.value })}
                    className="mt-1 h-9 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs font-medium">শুরুর তারিখ</Label>
                    <Input
                      type="date"
                      value={newTour.startDate}
                      onChange={(e) => setNewTour({ ...newTour, startDate: e.target.value })}
                      className="mt-1 h-9 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium">শেষের তারিখ</Label>
                    <Input
                      type="date"
                      value={newTour.endDate}
                      onChange={(e) => setNewTour({ ...newTour, endDate: e.target.value })}
                      className="mt-1 h-9 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs font-medium">বাজেট (৳) *</Label>
                  <Input
                    required
                    type="number"
                    placeholder="১৫০০০"
                    value={newTour.budget}
                    onChange={(e) => setNewTour({ ...newTour, budget: e.target.value })}
                    className="mt-1 h-9 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs font-medium">গ্রুপ মেম্বার</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="নাম লিখুন"
                      value={newTour.memberInput}
                      onChange={(e) => setNewTour({ ...newTour, memberInput: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addMember();
                        }
                      }}
                      className="h-9 text-sm"
                    />
                    <Button type="button" onClick={addMember} size="sm" className="h-9 px-3 text-xs">
                      যোগ
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {newTour.members.map((member, idx) => (
                      <Badge key={idx} variant="secondary" className="flex items-center gap-1 text-xs px-2 py-0.5">
                        {member}
                        {member !== "আমি" && (
                          <X className="w-3 h-3 cursor-pointer" onClick={() => removeMember(member)} />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full bg-travel text-travel-foreground h-9 text-sm">
                  ট্যুর তৈরি করুন
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tours List */}
        <div className="px-4 space-y-3">
          {tours.map((tour) => {
            const totalExpenses = tour.expenses.reduce((sum, exp) => sum + exp.amount, 0);
            const remainingBudget = tour.budget - totalExpenses;

            return (
              <Card
                key={tour.id}
                className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTour(tour)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-base flex items-center gap-2">
                      {tour.name}
                      {!tour.isActive && (
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                          Ended
                        </Badge>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {tour.destination}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        remainingBudget < 0 ? "bg-destructive/10 text-destructive" : "bg-travel/10 text-travel"
                      }`}
                    >
                      ৳{totalExpenses} / ৳{tour.budget}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {tour.startDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(tour.startDate).toLocaleDateString("bn-BD")}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {tour.members.length} members
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {tour.places.length} places
                  </span>
                </div>

                {remainingBudget < 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-destructive">
                    <AlertCircle className="w-3 h-3" />
                    বাজেট ৳{Math.abs(remainingBudget)} বেশি হয়ে গেছে!
                  </div>
                )}
              </Card>
            );
          })}

          {tours.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground text-sm">
                এখনও কোন ট্যুর তৈরি করা হয়নি। উপরের বাটন দিয়ে নতুন ট্যুর তৈরি করুন!
              </p>
            </Card>
          )}
        </div>
      </div>
    );
  }

  // Tour Detail View
  const { totalExpenses, perPersonShare, balances } = calculateSplitExpenses();

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-br from-travel to-travel/80 px-6 pt-8 pb-6 sticky top-0 z-10 shadow-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSelectedTour(null)}
          className="text-white hover:bg-white/20 mb-3 -ml-2"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Tours
        </Button>
        <h1 className="text-2xl font-bold text-white mb-1">{selectedTour.name}</h1>
        <p className="text-white/90 text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {selectedTour.destination}
        </p>
      </div>

      {/* Budget Summary */}
      <div className="px-4 pt-6 pb-4">
        <Card className="bg-gradient-to-br from-travel to-travel/80 text-white p-4 shadow-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs opacity-90 mb-1">Total Budget</p>
              <p className="text-2xl font-bold">৳{selectedTour.budget}</p>
            </div>
            <div>
              <p className="text-xs opacity-90 mb-1">Spent</p>
              <p className="text-2xl font-bold">৳{totalExpenses || 0}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs opacity-90 mb-1">Remaining</p>
              <p
                className={`text-xl font-bold ${
                  (selectedTour.budget - (totalExpenses || 0)) < 0 ? "text-red-300" : ""
                }`}
              >
                ৳{selectedTour.budget - (totalExpenses || 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Places to Visit */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <MapPin className="w-4 h-4 text-travel" />
            Places to Visit
          </h2>
          <Dialog open={isAddingPlace} onOpenChange={setIsAddingPlace}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw]">
              <DialogHeader>
                <DialogTitle className="text-sm">Add Place</DialogTitle>
              </DialogHeader>
              <div className="pt-2">
                <Input
                  placeholder="Place name"
                  value={newPlace}
                  onChange={(e) => setNewPlace(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addPlace();
                    }
                  }}
                  className="h-9 text-sm"
                />
                <Button onClick={addPlace} className="w-full mt-3 h-9 text-sm bg-travel">
                  Add Place
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {selectedTour.places.map((place, idx) => (
            <Badge key={idx} variant="secondary" className="flex items-center gap-1 text-xs px-2 py-1">
              {place}
              <X className="w-3 h-3 cursor-pointer" onClick={() => removePlace(place)} />
            </Badge>
          ))}
          {selectedTour.places.length === 0 && (
            <p className="text-xs text-muted-foreground">No places added yet</p>
          )}
        </div>
      </div>

      {/* Expense Tracker */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-travel" />
            Expenses
          </h2>
          <Dialog open={isAddingExpense} onOpenChange={setIsAddingExpense}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-7 text-xs bg-travel">
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw]">
              <DialogHeader>
                <DialogTitle className="text-sm">Add Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <div>
                  <Label className="text-xs">Description</Label>
                  <Input
                    placeholder="e.g., Bus tickets"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                    className="mt-1 h-9 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Amount (৳)</Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="mt-1 h-9 text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Paid By</Label>
                  <select
                    value={newExpense.paidBy}
                    onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                    className="w-full mt-1 h-9 text-sm border rounded-md px-3"
                  >
                    <option value="">Select member</option>
                    {selectedTour.members.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={addExpense} className="w-full h-9 text-sm bg-travel">
                  Add Expense
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-2">
          {selectedTour.expenses.map((exp) => (
            <Card key={exp.id} className="p-3 flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">{exp.description}</p>
                <p className="text-xs text-muted-foreground">Paid by {exp.paidBy}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-travel">৳{exp.amount}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteExpense(exp.id)}
                  className="h-7 w-7 p-0 text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          ))}
          {selectedTour.expenses.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No expenses added yet</p>
          )}
        </div>
      </div>

      {/* Split Expenses */}
      {selectedTour.expenses.length > 0 && (
        <div className="px-4 mb-6">
          <h2 className="text-base font-semibold mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-travel" />
            Split Expenses
          </h2>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground mb-2">Per person share: ৳{perPersonShare?.toFixed(2)}</p>
            <div className="space-y-2">
              {balances &&
                Object.entries(balances).map(([member, balance]) => (
                  <div key={member} className="flex items-center justify-between text-sm">
                    <span>{member}</span>
                    <span className={balance > 0 ? "text-green-600 font-medium" : balance < 0 ? "text-red-600 font-medium" : ""}>
                      {balance > 0 ? `+৳${balance.toFixed(2)}` : balance < 0 ? `-৳${Math.abs(balance).toFixed(2)}` : "Settled"}
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}

      {/* To-Do List */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-travel" />
            To-Do List
          </h2>
          <Dialog open={isAddingTodo} onOpenChange={setIsAddingTodo}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-7 text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw]">
              <DialogHeader>
                <DialogTitle className="text-sm">Add To-Do</DialogTitle>
              </DialogHeader>
              <div className="pt-2">
                <Input
                  placeholder="Task description"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTodo();
                    }
                  }}
                  className="h-9 text-sm"
                />
                <Button onClick={addTodo} className="w-full mt-3 h-9 text-sm bg-travel">
                  Add To-Do
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-2">
          {selectedTour.todos.map((todo) => (
            <Card key={todo.id} className="p-3 flex items-center gap-3">
              <Checkbox checked={todo.completed} onCheckedChange={() => toggleTodo(todo.id)} />
              <span className={`flex-1 text-sm ${todo.completed ? "line-through text-muted-foreground" : ""}`}>
                {todo.text}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTodo(todo.id)}
                className="h-7 w-7 p-0 text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </Card>
          ))}
          {selectedTour.todos.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">No to-dos added yet</p>
          )}
        </div>
      </div>

      {/* End Trip Button */}
      {selectedTour.isActive && (
        <div className="px-4 mb-6">
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              if (confirm("Are you sure you want to end this trip?")) {
                endTrip();
              }
            }}
          >
            End Trip
          </Button>
        </div>
      )}
    </div>
  );
}
