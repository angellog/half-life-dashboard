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
  GripVertical
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
    <Card className="group cursor-pointer transition-colors hover:border-primary/20 relative">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className={typeBadge.className}>
            {typeBadge.label}
          </Badge>
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

        {/* Image placeholder */}
        <div className="flex h-24 items-center justify-center rounded-md bg-accent mb-3">
          <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
        </div>

        {/* Caption */}
        <p className="text-sm text-foreground line-clamp-3 mb-3">
          {post.caption}
        </p>

        {/* Date */}
        {(post.scheduledDate || post.publishedDate) && (
          <p className="text-xs text-muted-foreground mb-2">
            {post.status === "published" ? "Published" : "Scheduled"}:{" "}
            {formatDate(post.publishedDate || post.scheduledDate || "")}
          </p>
        )}

        {/* Engagement stats (published posts only) */}
        {post.engagement && (
          <div className="flex items-center gap-3 text-xs text-muted-foreground border-t border-border pt-2 mt-2">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {formatNumber(post.engagement.likes)}
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="h-3 w-3" />
              {formatNumber(post.engagement.comments)}
            </span>
            <span className="flex items-center gap-1">
              <Share2 className="h-3 w-3" />
              {formatNumber(post.engagement.shares)}
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="h-3 w-3" />
              {formatNumber(post.engagement.saves)}
            </span>
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
  });

  const handleSubmit = () => {
    if (!formData.caption) return;
    
    addPost(platform, {
      caption: formData.caption,
      type: formData.type,
      status: formData.status,
      scheduledDate: formData.date || undefined,
    });
    
    setFormData({
      caption: "",
      type: "reel",
      status: "draft",
      date: "",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Content
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New {PLATFORM_LABELS[platform]} Post</DialogTitle>
          <DialogDescription>
            Create a new content idea for your {PLATFORM_LABELS[platform]} pipeline.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="caption">Caption / Content</Label>
            <textarea
              id="caption"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Write your content here..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Post Type</Label>
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
                  <SelectItem value="single">Single Post / Tweet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
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
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!formData.caption}>Create Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SocialManagerPage() {
  const { activePlatform, setActivePlatform, posts } = useSocialMediaStore();
  const currentPosts = posts[activePlatform] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Manager</h1>
          <p className="text-muted-foreground mt-1">
            Omni-channel content pipeline for your brand.
          </p>
        </div>
        
        {/* Platform Switcher */}
        <div className="flex items-center gap-1.5 p-1.5 bg-accent/30 rounded-2xl border border-border/50">
          {PLATFORMS.map((p) => {
            const Icon = p.icon;
            const isActive = activePlatform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setActivePlatform(p.id)}
                className={cn(
                  "p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center",
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
           <Button variant="outline" size="sm" onClick={() => alert(`Connecting ${PLATFORM_LABELS[activePlatform]}...`)}>
              Connect
           </Button>
           <AddPostDialog platform={activePlatform} />
        </div>
      </div>

      <Separator className="opacity-50" />

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {STATUS_COLUMNS.map((column) => {
          const filteredPosts = currentPosts.filter(p => p.status === column.key);
          return (
            <div key={column.key} className="space-y-3">
              {/* Column header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-sm">{column.label}</h3>
                  <span className="text-xs text-muted-foreground bg-accent rounded-full px-2 py-0.5">
                    {filteredPosts.length}
                  </span>
                </div>
              </div>

              {/* Column content */}
              <ScrollArea className="h-[calc(100vh-280px)]">
                <div className="space-y-3 pr-3">
                  {filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} platform={activePlatform} />
                  ))}
                  {filteredPosts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 border border-dashed border-border rounded-xl opacity-40">
                      <p className="text-[10px] font-medium uppercase tracking-widest">Empty</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border", className)} />;
}
