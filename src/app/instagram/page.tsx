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
import { Plus, Image, Heart, MessageCircle, Share2, Bookmark, GripVertical } from "lucide-react";
import { Post, PostStatus, PostType } from "@/types";
import { getPostsByStatus } from "@/lib/data/instagram";
import { formatDate, formatNumber } from "@/lib/utils";

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

function PostCard({ post }: { post: Post }) {
  const typeBadge = TYPE_BADGES[post.type];

  return (
    <Card className="group cursor-pointer transition-colors hover:border-primary/20">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <Badge variant="secondary" className={typeBadge.className}>
            {typeBadge.label}
          </Badge>
          <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Image placeholder */}
        <div className="flex h-24 items-center justify-center rounded-md bg-accent mb-3">
          <Image className="h-8 w-8 text-muted-foreground/50" />
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

function AddPostDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Post
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Post Idea</DialogTitle>
          <DialogDescription>
            Create a new content idea for your Instagram pipeline.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="caption">Caption</Label>
            <textarea
              id="caption"
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Write your caption here..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Post Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reel">Reel</SelectItem>
                  <SelectItem value="carousel">Carousel</SelectItem>
                  <SelectItem value="story">Story</SelectItem>
                  <SelectItem value="single">Single Post</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="backlog">Backlog</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Scheduled Date</Label>
            <Input id="date" type="date" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={() => setOpen(false)}>Add Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function InstagramPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Instagram Manager</h1>
          <p className="text-muted-foreground mt-1">
            Manage your content pipeline — schedule, draft, and track posts.
          </p>
        </div>
        <AddPostDialog />
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {STATUS_COLUMNS.map((column) => {
          const posts = getPostsByStatus(column.key);
          return (
            <div key={column.key} className="space-y-3">
              {/* Column header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${column.color}`} />
                  <h3 className="font-semibold text-sm">{column.label}</h3>
                  <span className="text-xs text-muted-foreground bg-accent rounded-full px-2 py-0.5">
                    {posts.length}
                  </span>
                </div>
              </div>

              {/* Column content */}
              <ScrollArea className="h-[calc(100vh-220px)]">
                <div className="space-y-3 pr-3">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          );
        })}
      </div>
    </div>
  );
}
