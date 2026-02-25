import { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Plus, MapPin, DollarSign, Trash2, Calendar, Users, CheckCircle2, X, ChevronLeft, ListTodo, AlertCircle, Loader2, Share2, LogIn, User, LogOut, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { signOut as firebaseSignOut } from "../../services/authService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { getUserTours, createTour as saveTour, updateTour as saveUpdateTour, deleteTour as saveDeleteTour } from "../../services/firestoreService";
import { addDoc, collection, serverTimestamp, updateDoc, doc, increment, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { Tour as TourType } from "../../types";

export function TourPlanner() {
  const { currentUser, userData, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await firebaseSignOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleAddTourClick = () => {
    if (!currentUser) {
      alert("ট্যুর তৈরি করতে আপনাকে লগইন করতে হবে!");
      navigate("/auth");
      return;
    }
    setIsCreatingTour(true);
  };
  const [tours, setTours] = useState<TourType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTour, setSelectedTour] = useState<TourType | null>(null);
  const [isCreatingTour, setIsCreatingTour] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [convertFormData, setConvertFormData] = useState({
    howToGo: "",
    budgetDescription: "",
  });

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

  // Fetch tours from Firestore
  useEffect(() => {
    const fetchTours = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getUserTours(currentUser.uid);
        setTours(data);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [currentUser]);

  const createTour = async () => {
    if (!currentUser) {
      alert("ট্যুর তৈরি করতে আপনাকে লগইন করতে হবে!");
      return;
    }

    if (newTour.name && newTour.destination && newTour.budget) {
      try {
        const tour: Omit<TourType, "id"> = {
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
          userId: currentUser.uid,
          convertedToGuide: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const tourId = await saveTour(tour);

        // Refresh tours
        const data = await getUserTours(currentUser.uid);
        setTours(data);

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
        alert("ট্যুর সফলভাবে তৈরি হয়েছে!");
      } catch (error) {
        console.error("Error creating tour:", error);
        alert("ট্যুর তৈরি করতে সমস্যা হয়েছে।");
      }
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

  const addExpense = async () => {
    if (!currentUser || !selectedTour || !newExpense.description ||!newExpense.amount || !newExpense.paidBy) {
      return;
    }

    try {
      const expense = {
        id: Date.now().toString(),
        description: newExpense.description,
        amount: parseFloat(newExpense.amount),
        paidBy: newExpense.paidBy,
      };

      const updatedTour = {
        ...selectedTour,
        expenses: [...selectedTour.expenses, expense],
        updatedAt: new Date(),
      };

      await saveUpdateTour(selectedTour.id, updatedTour);

      // Refresh tours
      const data = await getUserTours(currentUser.uid);
      setTours(data);
      setSelectedTour(data.find((t: TourType) => t.id === selectedTour.id) || null);

      setNewExpense({ description: "", amount: "", paidBy: "" });
      setIsAddingExpense(false);
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("খরচ যোগ করতে সমস্যা হয়েছে।");
    }
  };

  const deleteExpense = async (expId: string) => {
    if (!currentUser || !selectedTour) return;

    try {
      const updatedTour = {
        ...selectedTour,
        expenses: selectedTour.expenses.filter((e) => e.id !== expId),
        updatedAt: new Date(),
      };

      await saveUpdateTour(selectedTour.id, updatedTour);

      // Refresh tours
      const data = await getUserTours(currentUser.uid);
      setTours(data);
      setSelectedTour(data.find((t: TourType) => t.id === selectedTour.id) || null);
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("খরচ মুছতে সমস্যা হয়েছে।");
    }
  };

  const addPlace = async () => {
    if (!currentUser || !selectedTour || !newPlace.trim()) return;

    try {
      const updatedTour = {
        ...selectedTour,
        places: [...selectedTour.places, newPlace.trim()],
        updatedAt: new Date(),
      };

      await saveUpdateTour(selectedTour.id, updatedTour);

      // Refresh tours
      const data = await getUserTours(currentUser.uid);
      setTours(data);
      setSelectedTour(data.find((t: TourType) => t.id === selectedTour.id) || null);

      setNewPlace("");
      setIsAddingPlace(false);
    } catch (error) {
      console.error("Error adding place:", error);
      alert("স্থান যোগ করতে সমস্যা হয়েছে।");
    }
  };

  const removePlace = async (place: string) => {
    if (!currentUser || !selectedTour) return;

    try {
      const updatedTour = {
        ...selectedTour,
        places: selectedTour.places.filter((p) => p !== place),
        updatedAt: new Date(),
      };

      await saveUpdateTour(selectedTour.id, updatedTour);

      // Refresh tours
      const data = await getUserTours(currentUser.uid);
      setTours(data);
      setSelectedTour(data.find((t: TourType) => t.id === selectedTour.id) || null);
    } catch (error) {
      console.error("Error removing place:", error);
      alert("স্থান মুছতে সমস্যা হয়েছে।");
    }
  };

  const addTodo = async () => {
    if (!currentUser || !selectedTour || !newTodo.trim()) return;

    try {
      const todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
      };

      const updatedTour = {
        ...selectedTour,
        todos: [...selectedTour.todos, todo],
        updatedAt: new Date(),
      };

      await saveUpdateTour(selectedTour.id, updatedTour);

      // Refresh tours
      const data = await getUserTours(currentUser.uid);
      setTours(data);
      setSelectedTour(data.find((t: TourType) => t.id === selectedTour.id) || null);

      setNewTodo("");
      setIsAddingTodo(false);
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("টাস্ক যোগ করতে সমস্যা হয়েছে।");
    }
  };

  const toggleTodo = async (todoId: string) => {
    if (!currentUser || !selectedTour) return;

    try {
      const updatedTour = {
        ...selectedTour,
        todos: selectedTour.todos.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        ),
        updatedAt: new Date(),
      };

      await saveUpdateTour(selectedTour.id, updatedTour);

      // Refresh tours
      const data = await getUserTours(currentUser.uid);
      setTours(data);
      setSelectedTour(data.find((t: TourType) => t.id === selectedTour.id) || null);
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (todoId: string) => {
    if (!currentUser || !selectedTour) return;

    try {
      const updatedTour = {
        ...selectedTour,
        todos: selectedTour.todos.filter((todo) => todo.id !== todoId),
        updatedAt: new Date(),
      };

      await saveUpdateTour(selectedTour.id, updatedTour);

      // Refresh tours
      const data = await getUserTours(currentUser.uid);
      setTours(data);
      setSelectedTour(data.find((t: TourType) => t.id === selectedTour.id) || null);
    } catch (error) {
      console.error("Error deleting todo:", error);
      alert("টাস্ক মুছতে সমস্যা হয়েছে।");
    }
  };

  const endTrip = async () => {
    if (!currentUser || !selectedTour) return;

    try {
      const updatedTour = {
        ...selectedTour,
        isActive: false,
        updatedAt: new Date(),
      };

      await saveUpdateTour(selectedTour.id, updatedTour);

      // Refresh tours
      const data = await getUserTours(currentUser.uid);
      setTours(data);
      setSelectedTour(null);

      alert("ট্রিপ শেষ হয়েছে!");
    } catch (error) {
      console.error("Error ending trip:", error);
      alert("ট্রিপ শেষ করতে সমস্যা হয়েছে।");
    }
  };

  const convertToGuide = async () => {
    if (!currentUser || !userData || !selectedTour) return;

    if (selectedTour.places.length === 0) {
      alert("ভ্রমন গাইড তৈরি করতে অন্তত একটি স্থান যোগ করুন!");
      return;
    }

    // Open dialog to collect missing information
    setConvertFormData({
      howToGo: "",
      budgetDescription: `মোট খরচ: ৳${selectedTour.expenses.reduce((sum, e) => sum + e.amount, 0)} (${selectedTour.members.length} জন)`,
    });
    setIsConvertDialogOpen(true);
  };

  const handleConvertToGuide = async () => {
    if (!currentUser || !userData || !selectedTour) return;

    if (!convertFormData.howToGo.trim()) {
      alert("দয়া করে 'যেভাবে যাবেন' তথ্য দিন!");
      return;
    }

    try {
      // Create travel guide from tour data
      await addDoc(collection(db, "travelGuides"), {
        placeName: selectedTour.destination,
        place: selectedTour.destination, // Backward compatibility
        description: `${selectedTour.name} - ${selectedTour.members.length} জন সদস্য নিয়ে ${selectedTour.startDate ? new Date(selectedTour.startDate).toLocaleDateString("bn-BD") : ""} থেকে ${selectedTour.endDate ? new Date(selectedTour.endDate).toLocaleDateString("bn-BD") : ""} পর্যন্ত ভ্রমণ`,
        approximateBudget: `৳${selectedTour.budget}`,
        budget: `৳${selectedTour.budget}`, // Backward compatibility
        budgetDescription: convertFormData.budgetDescription,
        mustVisitPlaces: selectedTour.places,
        recommendedHotels: [],
        howToGo: convertFormData.howToGo,
        sourceType: "tour_conversion",
        sourceTourId: selectedTour.id,
        createdBy: currentUser.uid,
        creatorName: userData.displayName || "Anonymous",
        status: "published",
        lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        createdAt: serverTimestamp(),
      });

      // Mark tour as converted
      const updatedTour = {
        ...selectedTour,
        convertedToGuide: true,
        updatedAt: new Date(),
      };
      await saveUpdateTour(selectedTour.id, updatedTour);

      // Award points for creating travel guide (+15 points)
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        "stats.travelGuidesCreated": increment(1),
        contributionPoints: increment(15),
        updatedAt: serverTimestamp(),
      });

      // Update leaderboard
      const leaderboardRef = doc(db, "leaderboard", currentUser.uid);
      await updateDoc(leaderboardRef, {
        totalPoints: increment(15),
        "breakdown.travelGuides": increment(1),
        updatedAt: serverTimestamp(),
      }).catch(async () => {
        // Create leaderboard entry if doesn't exist
        await setDoc(leaderboardRef, {
          displayName: userData.displayName || "Anonymous",
          photoURL: userData.photoURL || "",
          totalPoints: 15,
          breakdown: {
            restaurants: 0,
            hotels: 0,
            markets: 0,
            travelGuides: 1,
          },
          updatedAt: serverTimestamp(),
        });
      });

      alert("ভ্রমন গাইড সফলভাবে তৈরি হয়েছে! +15 পয়েন্ট!");

      // Close dialog and refresh tours
      setIsConvertDialogOpen(false);
      setConvertFormData({ howToGo: "", budgetDescription: "" });
      const data = await getUserTours(currentUser.uid);
      setTours(data);
      setSelectedTour(null);
    } catch (error) {
      console.error("Error converting to guide:", error);
      alert("ভ্রমন গাইড তৈরি করতে সমস্যা হয়েছে।");
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
        <div className="bg-gradient-to-br from-travel to-travel/80 px-6 pt-6 pb-6 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">ঘুরতে যাই</h1>
              <p className="text-white/90 text-sm">Tour Planner & Expense Manager</p>
            </div>
            
            <div className="flex items-center gap-2">
              {authLoading ? (
                <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
              ) : currentUser && userData ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/20">
                      <Avatar className="h-10 w-10 border-2 border-white/30">
                        <AvatarImage src={userData.photoURL || ""} alt={userData.displayName} />
                        <AvatarFallback className="bg-white/90 text-travel">{getInitials(userData.displayName)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userData.displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs text-muted-foreground">Points:</span>
                          <span className="text-xs font-semibold text-primary">{userData.contributionPoints}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer"><User className="mr-2 h-4 w-4" /><span>প্রোফাইল</span></Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer"><Shield className="mr-2 h-4 w-4" /><span>Admin Dashboard</span></Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" /><span>লগ আউট</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild size="sm" className="bg-white text-travel hover:bg-white/90 shadow-md">
                  <Link to="/auth"><LogIn className="mr-2 h-4 w-4" />লগইন</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {!currentUser ? (
          <div className="px-4 pt-6">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">ট্যুর তৈরি করতে লগইন করুন</p>
              <Button onClick={() => window.location.href = "/auth"} className="bg-travel">
                লগইন করুন
              </Button>
            </Card>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {/* Create Tour Button */}
            <div className="px-4 pt-6 pb-4">
          <Dialog open={isCreatingTour} onOpenChange={setIsCreatingTour}>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-travel text-travel-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddTourClick();
                }}
              >
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
            </>
        )}
      </div>
    );
  }

  // Tour Detail View
  const { totalExpenses, perPersonShare, balances } = calculateSplitExpenses();

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-br from-travel to-travel/80 px-6 pt-6 pb-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTour(null)}
            className="text-white hover:bg-white/20 -ml-2"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Tours
          </Button>
          
          <div className="flex items-center gap-2">
            {authLoading ? (
              <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
            ) : currentUser && userData ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/20">
                    <Avatar className="h-10 w-10 border-2 border-white/30">
                      <AvatarImage src={userData.photoURL || ""} alt={userData.displayName} />
                      <AvatarFallback className="bg-white/90 text-travel">{getInitials(userData.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{userData.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{userData.email}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-xs text-muted-foreground">Points:</span>
                        <span className="text-xs font-semibold text-primary">{userData.contributionPoints}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer"><User className="mr-2 h-4 w-4" /><span>প্রোফাইল</span></Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer"><Shield className="mr-2 h-4 w-4" /><span>Admin Dashboard</span></Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /><span>লগ আউট</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild size="sm" className="bg-white text-travel hover:bg-white/90 shadow-md">
                <Link to="/auth"><LogIn className="mr-2 h-4 w-4" />লগইন</Link>
              </Button>
            )}
          </div>
        </div>
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

      {/* End Trip & Share as Guide Buttons */}
      {selectedTour.isActive && (
        <div className="px-4 mb-6 space-y-3">
          {/* Share as Guide Button */}
          {!selectedTour.convertedToGuide && (
            <Button
              className="w-full bg-accent text-white"
              onClick={convertToGuide}
            >
              <Share2 className="w-4 h-4 mr-2" />
              ভ্রমন গাইড হিসেবে শেয়ার করুন (+15 পয়েন্ট)
            </Button>
          )}

          {selectedTour.convertedToGuide && (
            <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              ভ্রমন গাইড হিসেবে শেয়ার করা হয়েছে!
            </div>
          )}

          {/* End Trip Button */}
          <Button
            variant="destructive"
            className="w-full"
            onClick={() => {
              if (confirm("আপনি কি নিশ্চিত যে এই ট্রিপ শেষ করতে চান?")) {
                endTrip();
              }
            }}
          >
            ট্রিপ শেষ করুন
          </Button>
        </div>
      )}

      {/* Convert to Guide Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[85vh] overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle className="text-base">ভ্রমন গাইড হিসেবে শেয়ার করুন</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <p className="text-sm text-muted-foreground">
              দয়া করে অনুপস্থিত তথ্য দিন:
            </p>

            <div>
              <Label className="text-xs font-medium">যেভাবে যাবেন *</Label>
              <Textarea
                required
                placeholder="যেমন: মেট্রো: শাহবাগ স্টেশন থেকে হেঁটে ৫ মিনিট..."
                value={convertFormData.howToGo}
                onChange={(e) => setConvertFormData({ ...convertFormData, howToGo: e.target.value })}
                className="mt-1 text-sm min-h-[80px]"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-xs font-medium">বাজেটের বিবরণ</Label>
              <Textarea
                placeholder="খরচের বিস্তারিত বিবরণ..."
                value={convertFormData.budgetDescription}
                onChange={(e) => setConvertFormData({ ...convertFormData, budgetDescription: e.target.value })}
                className="mt-1 text-sm min-h-[60px]"
                rows={2}
              />
            </div>

            <Button 
              onClick={handleConvertToGuide}
              className="w-full bg-accent text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              শেয়ার করুন (+15 পয়েন্ট)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
