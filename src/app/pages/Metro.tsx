import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";
import { ChevronDown, MapPin, Clock, Edit, Trash2, Plus, LogIn, User, LogOut, Shield, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "../../services/authService";
import { MetroStation, MetroGate } from "../../types";
import {
  getMetroStations,
  updateMetroStation,
  deleteMetroStation,
  addGateToStation,
  updateGateInStation,
  deleteGateFromStation,
} from "../../services/firestoreService";

export function Metro() {
  const { currentUser, userData, loading: authLoading, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const [openStation, setOpenStation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stations, setStations] = useState<MetroStation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addGateDialogOpen, setAddGateDialogOpen] = useState(false);
  const [editGateDialogOpen, setEditGateDialogOpen] = useState(false);
  const [deleteGateDialogOpen, setDeleteGateDialogOpen] = useState(false);
  
  // Selected items
  const [selectedStation, setSelectedStation] = useState<MetroStation | null>(null);
  const [selectedGate, setSelectedGate] = useState<MetroGate | null>(null);
  
  // Form data
  const [editFormData, setEditFormData] = useState({
    nameBangla: "",
    nameEnglish: "",
    fare: "",
  });
  
  const [gateFormData, setGateFormData] = useState({
    name: "",
    exitTo: "",
    landmarks: "",
  });

  // Define metro route order (Kamalapur to Uttara North)
  const routeOrder = [
    "kamalapur",
    "motijheel",
    "bangladesh-secretariat",
    "dhaka-university",
    "shahbag",
    "kawran-bazar",
    "farmgate",
    "agargaon",
    "mirpur-11",
    "pallabi",
    "uttara-south",
    "uttara-center",
    "uttara-north",
  ];

  // Fetch stations from Firestore
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getMetroStations();
        // Sort by route order
        const sortedData = data.sort((a, b) => {
          const indexA = routeOrder.indexOf(a.id);
          const indexB = routeOrder.indexOf(b.id);
          return indexA - indexB;
        });
        setStations(sortedData);
      } catch (error) {
        console.error("Error fetching metro stations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  // Handle edit station
  const handleEditStation = (station: MetroStation) => {
    setSelectedStation(station);
    setEditFormData({
      nameBangla: station.nameBangla,
      nameEnglish: station.nameEnglish,
      fare: station.fare,
    });
    setEditDialogOpen(true);
  };

  const handleSaveStation = async () => {
    if (!selectedStation) return;
    
    try {
      await updateMetroStation(selectedStation.id, editFormData);
      
      // Update local state
      setStations(stations.map(s => 
        s.id === selectedStation.id 
          ? { ...s, ...editFormData }
          : s
      ));
      
      setEditDialogOpen(false);
      setSelectedStation(null);
    } catch (error) {
      console.error("Error updating station:", error);
      alert("Failed to update station");
    }
  };

  // Handle delete station
  const handleDeleteStation = (station: MetroStation) => {
    setSelectedStation(station);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteStation = async () => {
    if (!selectedStation) return;
    
    try {
      await deleteMetroStation(selectedStation.id);
      
      // Update local state
      setStations(stations.filter(s => s.id !== selectedStation.id));
      
      setDeleteDialogOpen(false);
      setSelectedStation(null);
    } catch (error) {
      console.error("Error deleting station:", error);
      alert("Failed to delete station");
    }
  };

  // Handle add gate
  const handleAddGate = (station: MetroStation) => {
    setSelectedStation(station);
    setGateFormData({ name: "", exitTo: "", landmarks: "" });
    setAddGateDialogOpen(true);
  };

  const handleSaveNewGate = async () => {
    if (!selectedStation) return;
    
    try {
      const newGate: MetroGate = {
        name: gateFormData.name,
        exitTo: gateFormData.exitTo,
        landmarks: gateFormData.landmarks.split(',').map(l => l.trim()),
      };
      
      await addGateToStation(selectedStation.id, newGate);
      
      // Update local state
      setStations(stations.map(s => 
        s.id === selectedStation.id 
          ? { ...s, gates: [...s.gates, newGate] }
          : s
      ));
      
      setAddGateDialogOpen(false);
      setSelectedStation(null);
    } catch (error) {
      console.error("Error adding gate:", error);
      alert("Failed to add gate");
    }
  };

  // Handle edit gate
  const handleEditGate = (station: MetroStation, gate: MetroGate) => {
    setSelectedStation(station);
    setSelectedGate(gate);
    setGateFormData({
      name: gate.name,
      exitTo: gate.exitTo,
      landmarks: gate.landmarks.join(', '),
    });
    setEditGateDialogOpen(true);
  };

  const handleSaveGate = async () => {
    if (!selectedStation || !selectedGate) return;
    
    try {
      const updatedGate: MetroGate = {
        name: gateFormData.name,
        exitTo: gateFormData.exitTo,
        landmarks: gateFormData.landmarks.split(',').map(l => l.trim()),
      };
      
      await updateGateInStation(selectedStation.id, selectedGate.name, updatedGate);
      
      // Update local state
      setStations(stations.map(s => 
        s.id === selectedStation.id 
          ? {
              ...s,
              gates: s.gates.map(g => 
                g.name === selectedGate.name ? updatedGate : g
              )
            }
          : s
      ));
      
      setEditGateDialogOpen(false);
      setSelectedStation(null);
      setSelectedGate(null);
    } catch (error) {
      console.error("Error updating gate:", error);
      alert("Failed to update gate");
    }
  };

  // Handle delete gate
  const handleDeleteGate = (station: MetroStation, gate: MetroGate) => {
    setSelectedStation(station);
    setSelectedGate(gate);
    setDeleteGateDialogOpen(true);
  };

  const confirmDeleteGate = async () => {
    if (!selectedStation || !selectedGate) return;
    
    try {
      await deleteGateFromStation(selectedStation.id, selectedGate.name);
      
      // Update local state
      setStations(stations.map(s => 
        s.id === selectedStation.id 
          ? { ...s, gates: s.gates.filter(g => g.name !== selectedGate.name) }
          : s
      ));
      
      setDeleteGateDialogOpen(false);
      setSelectedStation(null);
      setSelectedGate(null);
    } catch (error) {
      console.error("Error deleting gate:", error);
      alert("Failed to delete gate");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary/80 px-6 pt-6 pb-6 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">মেট্রো নাম</h1>
            <p className="text-white/90 text-sm">Metro Station Guide & Exit Gates</p>
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
                      <AvatarFallback className="bg-white/90 text-primary">{getInitials(userData.displayName)}</AvatarFallback>
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
              <Button asChild size="sm" className="bg-white text-primary hover:bg-white/90 shadow-md">
                <Link to="/auth"><LogIn className="mr-2 h-4 w-4" />লগইন</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 pt-6 pb-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by station name..."
            className="pl-10 h-9 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Station List */}
      <div className="px-4 pt-2 space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading stations...</p>
          </div>
        ) : stations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No metro stations found</p>
          </div>
        ) : (
          stations
            .filter((station) => {
              const query = searchQuery.toLowerCase();
              return (
                station.nameBangla.toLowerCase().includes(query) ||
                station.nameEnglish.toLowerCase().includes(query)
              );
            })
            .map((station, index) => (
          <Card key={station.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <Collapsible
              open={openStation === station.id}
              onOpenChange={(isOpen) => setOpenStation(isOpen ? station.id : null)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Station Number */}
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
                      {index + 1}
                    </div>
                    
                    {/* Station Info */}
                    <div className="text-left">
                      <h3 className="font-semibold">{station.nameBangla}</h3>
                      <p className="text-sm text-muted-foreground">{station.nameEnglish}</p>
                    </div>
                  </div>

                  {/* Chevron */}
                  <ChevronDown 
                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                      openStation === station.id ? "rotate-180" : ""
                    }`} 
                  />
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="px-4 pb-4 pt-2 border-t border-border/50">
                  {/* Action Buttons - Admin Only */}
                  {isAdmin && (
                    <div className="flex gap-2 mb-4">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-primary border-primary/30 hover:bg-primary/10"
                        onClick={() => handleEditStation(station)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={() => handleDeleteStation(station)}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  )}

                  {/* Fare Info */}
                  <div className="flex items-center gap-2 mb-4 text-sm">
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                      Fare: {station.fare}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Updated: {station.lastUpdated}
                    </div>
                  </div>

                  {/* Exit Gates */}
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Exit Gates
                    </h4>
                    {isAdmin && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 text-xs text-primary"
                        onClick={() => handleAddGate(station)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Gate
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {station.gates.map((gate) => (
                      <div key={gate.name} className="bg-muted/30 rounded-lg p-3 relative">
                        {isAdmin && (
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0 text-primary hover:bg-primary/10"
                              onClick={() => handleEditGate(station, gate)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteGate(station, gate)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-primary text-primary-foreground text-xs">
                            {gate.name}
                          </Badge>
                          <span className="text-sm font-medium">{gate.exitTo}</span>
                        </div>
                        <div className="pl-2">
                          <p className="text-xs text-muted-foreground mb-1">Nearby:</p>
                          <div className="flex flex-wrap gap-1">
                            {gate.landmarks.map((landmark, idx) => (
                              <span 
                                key={idx}
                                className="text-xs bg-white px-2 py-1 rounded-md border border-border"
                              >
                                {landmark}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Verified Badge */}
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium inline-flex items-center gap-1">
                      ✓ Verified by Pathik
                    </span>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
          ))
        )}
      </div>

      {/* Edit Station Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Station</DialogTitle>
            <DialogDescription>Update the station details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nameBangla">Name (Bangla)</Label>
              <Input
                id="nameBangla"
                value={editFormData.nameBangla}
                onChange={(e) => setEditFormData({ ...editFormData, nameBangla: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="nameEnglish">Name (English)</Label>
              <Input
                id="nameEnglish"
                value={editFormData.nameEnglish}
                onChange={(e) => setEditFormData({ ...editFormData, nameEnglish: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fare">Fare</Label>
              <Input
                id="fare"
                value={editFormData.fare}
                onChange={(e) => setEditFormData({ ...editFormData, fare: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveStation}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Station Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Station</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedStation?.nameEnglish}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteStation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Gate Dialog */}
      <Dialog open={addGateDialogOpen} onOpenChange={setAddGateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Gate</DialogTitle>
            <DialogDescription>Add a new exit gate to {selectedStation?.nameEnglish}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="gateName">Gate Name</Label>
              <Input
                id="gateName"
                placeholder="Gate A"
                value={gateFormData.name}
                onChange={(e) => setGateFormData({ ...gateFormData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="exitTo">Exit To</Label>
              <Input
                id="exitTo"
                placeholder="Main Road"
                value={gateFormData.exitTo}
                onChange={(e) => setGateFormData({ ...gateFormData, exitTo: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="landmarks">Landmarks (comma-separated)</Label>
              <Textarea
                id="landmarks"
                placeholder="Landmark 1, Landmark 2, Landmark 3"
                value={gateFormData.landmarks}
                onChange={(e) => setGateFormData({ ...gateFormData, landmarks: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddGateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveNewGate}>Add Gate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Gate Dialog */}
      <Dialog open={editGateDialogOpen} onOpenChange={setEditGateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Gate</DialogTitle>
            <DialogDescription>Update gate information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editGateName">Gate Name</Label>
              <Input
                id="editGateName"
                value={gateFormData.name}
                onChange={(e) => setGateFormData({ ...gateFormData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editExitTo">Exit To</Label>
              <Input
                id="editExitTo"
                value={gateFormData.exitTo}
                onChange={(e) => setGateFormData({ ...gateFormData, exitTo: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="editLandmarks">Landmarks (comma-separated)</Label>
              <Textarea
                id="editLandmarks"
                value={gateFormData.landmarks}
                onChange={(e) => setGateFormData({ ...gateFormData, landmarks: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditGateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveGate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Gate Dialog */}
      <AlertDialog open={deleteGateDialogOpen} onOpenChange={setDeleteGateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Gate</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedGate?.name}" from {selectedStation?.nameEnglish}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGate} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}