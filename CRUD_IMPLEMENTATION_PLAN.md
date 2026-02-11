# CRUD Functionality Implementation Plan

## Overview
Add edit/delete functionality for user submissions with admin approval workflow.

## Implementation Phases

### Phase 1: Firestore Structure

#### Create Edit Requests Collection
```
editRequests/
  {requestId}:
    - itemId: string (original document ID)
    - collectionName: "restaurants" | "hotels" | "markets"
    - requestedBy: string (user ID)
    - requestedByName: string
    - requestType: "update" | "delete"
    - originalData: object
    - proposedChanges: object (for updates)
    - status: "pending" | "approved" | "rejected"
    - reason: string (for rejections)
    - createdAt: timestamp
    - reviewedAt: timestamp
    - reviewedBy: string
```

#### Update Firestore Rules
```javascript
match /editRequests/{requestId} {
  // Users can create edit requests for their own submissions
  allow create: if isAuthenticated() &&
                  request.resource.data.requestedBy == request.auth.uid;
  
  // Users can read their own edit requests
  allow read: if isAuthenticated() &&
                resource.data.requestedBy == request.auth.uid;
  
  // Admins can read and update all requests
  allow read, update: if isAdmin();
  
  // No direct deletes
  allow delete: if false;
}

// Update existing collections to allow admin edits
match /restaurants/{id} {
  allow update, delete: if isAdmin();
  // Users can update their own approved submissions (creates edit request)
  allow update: if isAuthenticated() && 
                  resource.data.submittedBy == request.auth.uid &&
                  resource.data.status == 'approved';
}
```

### Phase 2: Backend Services

#### Create `editRequestService.ts`
```typescript
// Submit edit request
export async function submitEditRequest(
  collectionName: string,
  itemId: string,
  proposedChanges: any,
  userId: string,
  displayName: string
): Promise<string>

// Submit delete request
export async function submitDeleteRequest(
  collectionName: string,
  itemId: string,
  userId: string,
  displayName: string
): Promise<string>

// Admin: Get pending edit requests
export async function getPendingEditRequests(
  collectionName?: string
): Promise<EditRequest[]>

// Admin: Approve edit request
export async function approveEditRequest(
  requestId: string,
  adminId: string
): Promise<void>

// Admin: Reject edit request
export async function rejectEditRequest(
  requestId: string,
  reason: string,
  adminId: string
): Promise<void>

// Admin: Direct edit (bypass approval)
export async function adminUpdateItem(
  collectionName: string,
  itemId: string,
  updates: any,
  adminId: string
): Promise<void>

// Admin: Direct delete
export async function adminDeleteItem(
  collectionName: string,
  itemId: string,
  adminId: string
): Promise<void>
```

### Phase 3: User Profile - Edit/Delete UI

#### Add Edit/Delete Buttons to Contributions
```tsx
// In Profile.tsx contributions map
{contributions.map((item) => (
  <Card key={`${item.type}-${item.id}`} className="p-3">
    <div className="flex items-center gap-3">
      {/* Existing content */}
      
      {/* Add action buttons */}
      {item.status === "approved" && (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              openEditDialog(item);
            }}
          >
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              openDeleteDialog(item);
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  </Card>
))}
```

#### Edit Dialog Component
```tsx
const [editingItem, setEditingItem] = useState<ContributionItem | null>(null);
const [editFormData, setEditFormData] = useState<any>({});

const openEditDialog = async (item: ContributionItem) => {
  // Fetch full item data from Firestore
  const itemData = await getItemData(item.type, item.id);
  setEditFormData(itemData);
  setEditingItem(item);
  setIsEditDialogOpen(true);
};

const handleSubmitEdit = async () => {
  if (!editingItem || !currentUser) return;
  
  try {
    setSubmitting(true);
    
    if (userData?.role === 'admin') {
      // Admin: Direct update
      await adminUpdateItem(
        getCollectionName(editingItem.type),
        editingItem.id,
        editFormData,
        currentUser.uid
      );
      toast.success("সফলভাবে আপডেট হয়েছে!");
    } else {
      // User: Submit edit request
      await submitEditRequest(
        getCollectionName(editingItem.type),
        editingItem.id,
        editFormData,
        currentUser.uid,
        userData?.displayName || "Anonymous"
      );
      toast.success("এডিট রিকোয়েস্ট পাঠানো হয়েছে!", {
        description: "অ্যাডমিন অনুমোদনের পর পরিবর্তন হবে।"
      });
    }
    
    setIsEditDialogOpen(false);
    fetchContributions(); // Refresh
  } catch (error) {
    console.error("Error submitting edit:", error);
    toast.error("এডিট করতে সমস্যা হয়েছে");
  } finally {
    setSubmitting(false);
  }
};
```

#### Delete Confirmation Dialog
```tsx
<AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>মুছে ফেলা নিশ্চিত করুন</AlertDialogTitle>
      <AlertDialogDescription>
        {userData?.role === 'admin' 
          ? '"${deletingItem?.name}" মুছে ফেলা হবে। এটি পূর্বাবস্থায় ফেরানো যাবে না।'
          : 'আপনার ডিলিট রিকোয়েস্ট অ্যাডমিনের কাছে পাঠানো হবে।'}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>বাতিল</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete} className="bg-destructive">
        মুছে ফেলুন
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

### Phase 4: Admin Panel - Edit Requests Queue

#### Create `EditRequestsQueue.tsx`
```tsx
export function EditRequestsQueue() {
  const [requests, setRequests] = useState<EditRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "update" | "delete">("all");
  
  // Similar structure to ReviewQueue.tsx
  // Show pending edit/delete requests
  // Allow approve/reject actions
  // Show diff view for edits
}
```

#### Edit Request Card
```tsx
<Card className="p-4">
  <div className="flex items-start justify-between mb-3">
    <div>
      <h3 className="font-semibold">{request.originalData.name}</h3>
      <p className="text-xs text-muted-foreground">
        {request.requestType === "update" ? "Edit" : "Delete"} request by {request.requestedByName}
      </p>
    </div>
    <Badge variant={request.requestType === "update" ? "default" : "destructive"}>
      {request.requestType}
    </Badge>
  </div>
  
  {/* Show diff for updates */}
  {request.requestType === "update" && (
    <div className="space-y-2 text-sm">
      {Object.keys(request.proposedChanges).map(key => (
        <div key={key} className="flex gap-2">
          <span className="font-medium">{key}:</span>
          <div className="flex-1">
            <div className="line-through text-muted-foreground">
              {request.originalData[key]}
            </div>
            <div className="text-green-600">
              {request.proposedChanges[key]}
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
  
  {/* Action buttons */}
  <div className="flex gap-2 mt-3">
    <Button onClick={() => handleApprove(request)}>
      Approve
    </Button>
    <Button variant="destructive" onClick={() => openRejectDialog(request)}>
      Reject
    </Button>
  </div>
</Card>
```

### Phase 5: Admin Dashboard Integration

#### Add Edit Requests to Dashboard
```tsx
// In Dashboard.tsx, add edit requests count
const [pendingEditRequests, setPendingEditRequests] = useState(0);

// Fetch count
const fetchEditRequests = async () => {
  const requests = await getPendingEditRequests();
  setPendingEditRequests(requests.length);
};

// Add card to dashboard
<Card className="p-4 cursor-pointer" onClick={() => navigate("/admin/edit-requests")}>
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-muted-foreground">Pending Edit Requests</p>
      <p className="text-2xl font-bold">{pendingEditRequests}</p>
    </div>
    <Edit2 className="w-8 h-8 text-primary" />
  </div>
</Card>
```

### Phase 6: Types and Interfaces

#### Update `types/index.ts`
```typescript
export interface EditRequest {
  id: string;
  itemId: string;
  collectionName: "restaurants" | "hotels" | "markets";
  requestedBy: string;
  requestedByName: string;
  requestType: "update" | "delete";
  originalData: any;
  proposedChanges?: any;
  status: "pending" | "approved" | "rejected";
  reason?: string;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}
```

## Testing Checklist

### User Flow
- [ ] User can view edit button on approved contributions
- [ ] User can edit their submission
- [ ] Edit request is created and pending
- [ ] User sees "Pending Edit" status
- [ ] User can view delete button
- [ ] Delete request is created
- [ ] User sees "Pending Delete" status

### Admin Flow
- [ ] Admin sees edit requests in dashboard
- [ ] Admin can view edit requests queue
- [ ] Admin can see diff of changes
- [ ] Admin can approve edit
- [ ] Changes are applied immediately
- [ ] User notification sent
- [ ] Admin can reject edit
- [ ] Rejection reason required
- [ ] User notification sent
- [ ] Admin can directly edit any item
- [ ] No approval needed for admin edits
- [ ] Admin can delete any item

### Edge Cases
- [ ] User edits while pending request exists
- [ ] Request is auto-rejected with message
- [ ] Multiple pending requests
- [ ] First approved, others canceled
- [ ] Item deleted while edit pending
- [ ] Edit request auto-rejected
- [ ] User deleted after submission
- [ ] Handle gracefully

## UI/UX Considerations

1. **Status Indicators**: Show "Edit Pending" or "Delete Pending" badge on items with pending requests
2. **Disable Actions**: Disable edit/delete buttons if request already pending
3. **Diff Visualization**: Color-code changes (red for old, green for new)
4. **Notifications**: Toast on success/failure, with descriptive messages
5. **Confirmation Dialogs**: Required for delete actions
6. **Loading States**: Show spinners during async operations
7. **Error Handling**: Graceful error messages with retry options

## Security Considerations

1. Validate user ownership before creating edit request
2. Admin-only direct edit/delete endpoints
3. Rate limiting on edit requests
4. Audit log for all edit/delete actions
5. Verify item still exists before applying changes

## Future Enhancements

1. Edit history tracking
2. Revert to previous version
3. Bulk approve/reject
4. Email notifications for users
5. Comments/notes on edit requests
6. Auto-approve for trusted users
7. Edit request expiration (30 days)
