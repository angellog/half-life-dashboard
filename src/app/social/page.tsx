"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Image as ImageIcon, 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Camera, 
  Music2, 
  Send, 
  Flag, 
  Users, 
  Play,
  GripVertical,
  Link as LinkIcon,
  Hash,
  MessageSquare,
  Clock,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { Post, PostStatus, PostType, Platform, PLATFORM_COLORS, PLATFORM_LABELS } from "@/types";
import { useSocialMediaStore } from "@/hooks/useSocialMediaStore";
import { formatDate, formatNumber, cn } from "@/lib/utils";

const STATUS_COLUMNS: { key: PostStatus; label: string; color: string }[] = [
  { key: "scheduled", label: "Scheduled", color: "bg-blue-500" },
  { key: "draft", label: "Drafts", color: "bg-yellow-500" },
  { key: "published", label: "Published", color: "bg-green-500" },
  { key: "backlog", label: "Backlog", color: "bg-zinc-500" },
];

const TYPE_BADGES: Record<PostType, { label: string; className: string }> = {
  reel: { label: "Reel", className: "bg-pink-500/20 text-pink-400 border-0" },
  carousel: { label: "Carousel", className: "bg-blue-500/20 text-blue-400 border-0" },
  story: { label: "Story", className: "bg-purple-500/20 text-purple-400 border-0" },
  single: { label: "Single", className: "bg-zinc-500/20 text-zinc-400 border-0" },
};

const PLATFORMS: { id: Platform; icon: any; color: string; hover: string }[] = [
  { id: "instagram", icon: Camera, color: "text-pink-400", hover: "hover:bg-pink-500/10" },
  { id: "tiktok", icon: Music2, color: "text-cyan-400", hover: "hover:bg-cyan-500/10" },
  { id: "twitter", icon: Send, color: "text-blue-400", hover: "hover:bg-blue-500/10" },
  { id: "facebook-pages", icon: Flag, color: "text-blue-600", hover: "hover:bg-blue-600/10" },
  { id: "facebook-groups", icon: Users, color: "text-indigo-500", hover: "hover:bg-indigo-500/10" },
  { id: "youtube", icon: Play, color: "text-red-500", hover: "hover:bg-red-500/10" },
];

function PostCard({ post, platform }: { post: Post; platform: Platform }) {
  const typeBadge = TYPE_BADGES[post.type];
  const deletePost = useSocialMediaStore((state) => state.deletePost);

  return (
    <Card className="group cursor-pointer transition-colors hover:border-primary/20 relative overflow-hidden">
      <div className={cn("h-1 w-full absolute top-0 left-0", 
        platform === "instagram" ? "bg-pink-500" :
        platform === "tiktok" ? "bg-cyan-400" :
        platform === "twitter" ? "bg-blue-400" :
        platform === "facebook-pages" ? "bg-blue-600" :
        platform === "facebook-groups" ? "bg-indigo-500" :
        "bg-red-500"
      )} />

      <CardContent className="p-4 pt-5">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5">
             <Badge variant="secondary" className={typeBadge.className}>
               {typeBadge.label}
             </Badge>
             {post.isThread && (
               <Badge variant="outline" className="text-[10px] gap-1 h-5 py-0">
                  <MessageSquare className="h-3 w-3" /> Thread
               </Badge>
             )}
             {post.metricoolStatus === "synced" && (
               <Badge variant="secondary" className="text-[10px] gap-1 h-5 py-0 bg-emerald-500/10 text-emerald-400 border-0">
                  <RefreshCw className="h-2.5 w-2.5" /> Metricool
               </Badge>
             )}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              deletePost(platform, post.id);
            }}
            className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-400"
          >
            <Plus className="h-4 w-4 rotate-45" />
          </button>
        </div>

        <div className="flex h-28 items-center justify-center rounded-md bg-accent/50 mb-3 relative group-hover:bg-accent/80 transition-colors">
          <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
          {post.videoDuration && (
            <div className="absolute bottom-1 right-1 bg-black/60 text-[10px] px-1.5 py-0.5 rounded text-white flex items-center gap-1">
               <Clock className="h-2.5 w-2.5" /> {post.videoDuration}
            </div>
          )}
        </div>

        <p className="text-sm text-foreground line-clamp-3 mb-3 leading-relaxed">
          {post.caption}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {post.hashtags && post.hashtags.slice(0, 3).map(h => (
            <span key={h} className="text-[10px] text-primary/80 hover:text-primary transition-colors">
               #{h}
            </span>
          ))}
          {post.link && (
            <div className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full max-w-full">
               <LinkIcon className="h-2.5 w-2.5 shrink-0" />
               <span className="truncate">{post.link}</span>
            </div>
          )}
        </div>

        {(post.scheduledDate || post.publishedDate) && (
          <p className="text-[10px] text-muted-foreground mb-2 flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {post.status === "published" ? "Published" : "Scheduled"}:{" "}
            {formatDate(post.publishedDate || post.scheduledDate || "")}
          </p>
        )}

        {post.engagement && (
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground border-t border-border pt-3 mt-1">
            <span className="flex items-center gap-1 hover:text-pink-400 transition-colors">
              <Heart className="h-3 w-3" />
              {formatNumber(post.engagement.likes)}
            </span>
            <span className="flex items-center gap-1 hover:text-blue-400 transition-colors">
              <MessageCircle className="h-3 w-3" />
              {formatNumber(post.engagement.comments)}
            </span>
            {platform !== "instagram" && (
               <span className="flex items-center gap-1 hover:text-green-400 transition-colors ml-auto">
                 <Share2 className="h-3 w-3" />
                 {formatNumber(post.engagement.shares)}
               </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddPostDialog({ platform }: { platform: Platform }) {
  const [open, setOpen] = useState(false);
  const addPost = useSocialMediaStore((state) => state.addPost);

  const [formData, setFormData] = useState({
    caption: "",
    type: "reel" as PostType,
    status: "draft" as PostStatus,
    date: "",
    hashtags: "",
    isThread: false,
    link: "",
    videoDuration: "",
  });

  const handleSubmit = () => {
    if (!formData.caption) return;
    
    addPost(platform, {
      caption: formData.caption,
      type: formData.type,
      status: formData.status,
      scheduledDate: formData.date || undefined,
      hashtags: formData.hashtags ? formData.hashtags.split(",").map(h => h.trim()) : undefined,
      isThread: formData.isThread,
      link: formData.link || undefined,
      videoDuration: formData.videoDuration || undefined,
      metricoolStatus: "pending",
    });
    
    setFormData({
      caption: "",
      type: "reel",
      status: "draft",
      date: "",
      hashtags: "",
      isThread: false,
      link: "",
      videoDuration: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="h-11 md:h-9 px-4 md:px-3 gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden xs:inline">Add Content</span>
            <span className="xs:hidden">Add</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px] h-[92dvh] sm:h-auto flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>New {PLATFORM_LABELS[platform]} Content</DialogTitle>
          <DialogDescription>
            Configure your {PLATFORM_LABELS[platform]} post for the pipeline.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 px-6">
          <div className="grid gap-5 py-4 pb-10">
            <div className="grid gap-2">
              <Label htmlFor="caption">Content / Caption</Label>
              <textarea
                id="caption"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder={platform === "twitter" ? "What's happening?" : "Write your caption..."}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Format</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(val) => setFormData({ ...formData, type: (val as PostType) || "single" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reel">Reel / Video</SelectItem>
                    <SelectItem value="carousel">Carousel</SelectItem>
                    <SelectItem value="story">Story</SelectItem>
                    <SelectItem value="single">Post / Tweet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Pipeline Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(val) => setFormData({ ...formData, status: (val as PostStatus) || "draft" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="backlog">Backlog</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Post Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="h-px w-full bg-border opacity-50" />

            <div className="space-y-4">
               <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Platform Context</h4>
               
               {(platform === "instagram" || platform === "tiktok") && (
                 <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                   <Label htmlFor="hashtags">Hashtags (comma separated)</Label>
                   <Input 
                     id="hashtags" 
                     placeholder="sneakers, style, kampala" 
                     value={formData.hashtags}
                     onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
                   />
                 </div>
               )}

               {platform === "twitter" && (
                 <div className="flex items-center justify-between p-3 rounded-lg border border-border animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="space-y-0.5">
                      <Label>Thread Mode</Label>
                      <p className="text-[10px] text-muted-foreground text-left">Flag as part of a thread</p>
                    </div>
                    <Switch 
                      checked={formData.isThread} 
                      onCheckedChange={(val) => setFormData({ ...formData, isThread: val })} 
                    />
                 </div>
               )}

               {(platform === "youtube" || platform === "tiktok") && (
                 <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                   <Label htmlFor="duration">Video Duration</Label>
                   <Input 
                     id="duration" 
                     placeholder="0:30" 
                     value={formData.videoDuration}
                     onChange={(e) => setFormData({ ...formData, videoDuration: e.target.value })}
                   />
                 </div>
               )}

               {(platform.startsWith("facebook") || platform === "instagram") && (
                 <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                   <Label htmlFor="link">Reference Link</Label>
                   <Input 
                     id="link" 
                     placeholder="https://..." 
                     value={formData.link}
                     onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                   />
                 </div>
               )}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="pt-4 border-t border-border bg-muted/30 -mx-6 -mb-6 p-6">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.caption}>Add to Pipeline</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SocialManagerPage() {
  const { activePlatform, setActivePlatform, posts } = useSocialMediaStore();
  const currentPosts = posts[activePlatform] || [];
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeColumn, setActiveColumn] = useState<PostStatus>("scheduled");

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert(`${PLATFORM_LABELS[activePlatform]} is now in sync with Metricool. 2 new drafts imported.`);
    }, 2000);
  };

  return (
    <div className="space-y-6 -mx-4 md:mx-0 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Social Manager</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Omni-channel content pipeline.
          </p>
        </div>
        
        <div className="flex items-center gap-1.5 p-1.5 bg-accent/30 rounded-2xl border border-border/50 overflow-x-auto no-scrollbar max-w-full">
          {PLATFORMS.map((p) => {
            const Icon = p.icon;
            const isActive = activePlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                className={cn(
                  "p-2.5 min-w-[44px] min-h-[44px] rounded-xl transition-all duration-200 flex items-center justify-center",
                  p.hover,
                  isActive 
                    ? "bg-background shadow-md scale-110 ring-1 ring-border" 
                    : "text-muted-foreground opacity-60 hover:opacity-100"
                )}
                title={PLATFORM_LABELS[p.id]}
              >
                <Icon className={cn("h-5 w-5", isActive ? p.color : "text-current")} />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
           <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSync}
            disabled={isSyncing}
            className={cn("h-11 md:h-9 px-4 md:px-3 gap-2 border-primary/20", isSyncing && "bg-primary/5")}
           >
              <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin text-primary")} /> 
              {isSyncing ? "Syncing..." : "Sync"}
           </Button>
           <AddPostDialog platform={activePlatform} />
        </div>
      </div>

      <div className="h-px w-full bg-border opacity-50 hidden md:block" />

      {/* Mobile Column Tabs */}
      <div className="flex md:hidden items-center gap-1 p-1 bg-accent/50 rounded-lg border border-border sticky top-0 z-10 backdrop-blur-sm">
        {STATUS_COLUMNS.map((col) => (
          <button
            key={col.key}
            onClick={() => setActiveColumn(col.key)}
            className={cn(
              "flex-1 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all",
              activeColumn === col.key
                ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {col.label}
          </button>
        ))}
      </div>

      {/* Desktop Grid / Mobile Swipe */}
      <div className="relative">
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 transition-all duration-300",
          "md:flex md:flex-row md:overflow-visible overflow-x-hidden"
        )}>
          {STATUS_COLUMNS.map((column) => {
            const filteredPosts = currentPosts.filter(p => p.status === column.key);
            const isHiddenOnMobile = activeColumn !== column.key;

            return (
              <div 
                key={column.key} 
                className={cn(
                  "space-y-3 transition-opacity duration-300",
                  isHiddenOnMobile ? "hidden md:block" : "block"
                )}
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2.5 w-2.5 rounded-full", column.color)} />
                    <h3 className="font-semibold text-sm">{column.label}</h3>
                    <span className="text-xs text-muted-foreground bg-accent rounded-full px-2 py-0.5">
                      {filteredPosts.length}
                    </span>
                  </div>
                </div>

                <ScrollArea className="h-[calc(100vh-320px)] md:h-[calc(100vh-280px)]">
                  <div className="space-y-3 pr-3">
                    {filteredPosts.map((post) => (
                      <PostCard key={post.id} post={post} platform={activePlatform} />
                    ))}
                    {filteredPosts.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl opacity-40">
                        <p className="text-[10px] font-medium uppercase tracking-widest text-center">No {column.label.toLowerCase()} content</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
