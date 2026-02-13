import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ThumbsUp, ThumbsDown, MessageCircle, Send, Edit2, Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { useAuth } from '../../contexts/AuthContext';
import {
  toggleLike,
  toggleDislike,
  getUserEngagement,
  getEngagementSummary,
  addComment,
  updateComment,
  deleteComment,
  getComments,
} from '../../services/engagementService';
import { Comment, EngagementSummary, UserEngagement } from '../../types';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { bn } from 'date-fns/locale';

interface EngagementSectionProps {
  contentType: 'restaurants' | 'hotels' | 'markets';
  contentId: string;
}

export function EngagementSection({ contentType, contentId }: EngagementSectionProps) {
  const { currentUser, userData, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<EngagementSummary>({
    likesCount: 0,
    dislikesCount: 0,
    commentsCount: 0,
  });
  const [userEngagement, setUserEngagement] = useState<UserEngagement>({
    hasLiked: false,
    hasDisliked: false,
  });
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  // Load engagement data
  useEffect(() => {
    loadEngagementData();
  }, [contentType, contentId, currentUser]);

  const loadEngagementData = async () => {
    try {
      setLoading(true);
      const [summaryData, commentsData] = await Promise.all([
        getEngagementSummary(contentType, contentId),
        getComments(contentType, contentId),
      ]);

      setSummary(summaryData);
      setComments(commentsData);

      if (currentUser) {
        const engagement = await getUserEngagement(contentType, contentId, currentUser.uid);
        setUserEngagement(engagement);
      }
    } catch (error) {
      console.error('Error loading engagement:', error);
      toast.error('এনগেজমেন্ট ডেটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!currentUser || !userData) {
      toast.error('লাইক দিতে লগইন করতে হবে');
      return;
    }

    try {
      await toggleLike(contentType, contentId, currentUser.uid, userData.displayName);
      await loadEngagementData();
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('লাইক করতে সমস্যা হয়েছে');
    }
  };

  const handleDislike = async () => {
    if (!currentUser || !userData) {
      toast.error('ডিসলাইক দিতে লগইন করতে হবে');
      return;
    }

    try {
      await toggleDislike(contentType, contentId, currentUser.uid, userData.displayName);
      await loadEngagementData();
    } catch (error) {
      console.error('Error toggling dislike:', error);
      toast.error('ডিসলাইক করতে সমস্যা হয়েছে');
    }
  };

  const handleAddComment = async () => {
    if (!currentUser || !userData) {
      toast.error('কমেন্ট করতে লগইন করতে হবে');
      return;
    }

    if (!commentText.trim()) {
      toast.error('কমেন্ট লিখুন');
      return;
    }

    try {
      setSubmitting(true);
      await addComment(
        contentType,
        contentId,
        currentUser.uid,
        userData.displayName,
        userData.photoURL,
        commentText.trim()
      );
      setCommentText('');
      toast.success('কমেন্ট যোগ হয়েছে');
      await loadEngagementData();
      setShowComments(true);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('কমেন্ট যোগ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: string) => {
    if (!editingText.trim()) {
      toast.error('কমেন্ট লিখুন');
      return;
    }

    try {
      setSubmitting(true);
      await updateComment(contentType, contentId, commentId, editingText.trim());
      setEditingCommentId(null);
      setEditingText('');
      toast.success('কমেন্ট আপডেট হয়েছে');
      await loadEngagementData();
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('কমেন্ট আপডেট করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async () => {
    if (!deletingCommentId) return;

    try {
      setSubmitting(true);
      await deleteComment(contentType, contentId, deletingCommentId);
      setDeletingCommentId(null);
      toast.success('কমেন্ট ডিলিট হয়েছে');
      await loadEngagementData();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('কমেন্ট ডিলিট করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getLastName = (name: string) => {
    const parts = name.trim().split(' ');
    return parts[parts.length - 1];
  };

  return (
    <div className="space-y-1">
      {/* Like/Dislike/Comment Counts */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={userEngagement.hasLiked ? 'default' : 'outline'}
            className="h-6 px-1.5 gap-0.5"
            onClick={handleLike}
            disabled={!currentUser}
          >
            <ThumbsUp className={`w-3 h-3 ${userEngagement.hasLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">{summary.likesCount}</span>
          </Button>
          <Button
            size="sm"
            variant={userEngagement.hasDisliked ? 'default' : 'outline'}
            className="h-6 px-1.5 gap-0.5"
            onClick={handleDislike}
            disabled={!currentUser}
          >
            <ThumbsDown className={`w-3 h-3 ${userEngagement.hasDisliked ? 'fill-current' : ''}`} />
            <span className="text-xs">{summary.dislikesCount}</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-6 px-1.5 gap-0.5"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="w-3 h-3" />
            <span className="text-xs">{summary.commentsCount}</span>
          </Button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-1.5 pt-1 border-t border-border/50">
          {/* Add Comment */}
          {currentUser ? (
            <div className="flex gap-1">
              <Textarea
                placeholder="আপনার মতামত লিখুন..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="text-xs min-h-[32px] py-1 px-2"
                rows={1}
              />
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={submitting || !commentText.trim()}
                className="h-auto px-1.5"
              >
                {submitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              </Button>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-1">
              কমেন্ট করতে লগইন করুন
            </p>
          )}

          {/* Comments List */}
          <div className="space-y-1">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-accent/50 border border-border/30 rounded p-1.5 space-y-0.5">
                <div className="flex items-start gap-1.5">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={comment.photoURL} />
                    <AvatarFallback className="text-[8px]">
                      {getInitials(comment.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium">{getLastName(comment.displayName)}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true, locale: bn })}
                        {comment.isEdited && ' (সম্পাদিত)'}
                      </p>
                    </div>
                    {editingCommentId === comment.id ? (
                      <div className="space-y-1 mt-0.5">
                        <Textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="text-xs min-h-[32px] py-1 px-2"
                          rows={1}
                        />
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleEditComment(comment.id)}
                            disabled={submitting}
                            className="h-5 text-[10px] px-1.5"
                          >
                            {submitting ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              'সংরক্ষণ'
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditingText('');
                            }}
                            className="h-5 text-[10px] px-1.5"
                          >
                            বাতিল
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-foreground/90 mt-0.5 font-normal">{comment.text}</p>
                    )}
                  </div>
                </div>
                {/* Edit/Delete Actions */}
                {currentUser &&
                  (comment.userId === currentUser.uid || isAdmin) &&
                  editingCommentId !== comment.id && (
                    <div className="flex gap-1 mt-0.5">
                      {comment.userId === currentUser.uid && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 px-1 text-[10px]"
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditingText(comment.text);
                          }}
                        >
                          <Edit2 className="w-2.5 h-2.5 mr-0.5" />
                          এডিট
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 px-1 text-[10px] text-destructive"
                        onClick={() => setDeletingCommentId(comment.id)}
                      >
                        <Trash2 className="w-2.5 h-2.5 mr-0.5" />
                        ডিলিট
                      </Button>
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCommentId} onOpenChange={(open) => !open && setDeletingCommentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>নিশ্চিত করুন</AlertDialogTitle>
            <AlertDialogDescription>
              আপনি কি নিশ্চিত যে আপনি এই কমেন্ট ডিলিট করতে চান?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>বাতিল করুন</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteComment}
              className="bg-destructive text-destructive-foreground"
              disabled={submitting}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'ডিলিট করুন'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
