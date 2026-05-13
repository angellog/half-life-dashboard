"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { CalendarItem, Platform, PLATFORM_COLORS, PLATFORM_LABELS } from "@/types";
import { getCalendarItems } from "@/lib/data/calendar";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { cn } from "@/lib/utils";

const ALL_PLATFORMS: Platform[] = [
  "instagram",
  "youtube",
  "tiktok",
  "twitter",
  "facebook-pages",
  "facebook-groups",
];

function AddEventDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Calendar Event</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Event Title</label>
            <Input placeholder="e.g. New Collection Drop" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Platform</label>
              <select className="bg-background border border-input rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary">
                {ALL_PLATFORMS.map(p => (
                  <option key={p} value={p}>{PLATFORM_LABELS[p]}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Type</label>
              <select className="bg-background border border-input rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary">
                <option value="post">Post</option>
                <option value="story">Story</option>
                <option value="reel">Reel/Video</option>
              </select>
            </div>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Date</label>
            <Input type="date" />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={() => {
            alert("Event scheduled successfully!");
            onOpenChange(false);
          }}>Schedule Event</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1)); // May 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [activePlatforms, setActivePlatforms] = useState<Set<Platform>>(
    new Set(ALL_PLATFORMS)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [addEventOpen, setAddEventOpen] = useState(false);

  const allItems = getCalendarItems();

  // Filter items by active platforms
  const filteredItems = allItems.filter((item) =>
    activePlatforms.has(item.platform)
  );

  // Build calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Get items for a specific date
  function getItemsForDate(date: Date): CalendarItem[] {
    const dateStr = format(date, "yyyy-MM-dd");
    return filteredItems.filter((item) => item.date === dateStr);
  }

  // Toggle platform filter
  function togglePlatform(platform: Platform) {
    setActivePlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(platform)) {
        next.delete(platform);
      } else {
        next.add(platform);
      }
      return next;
    });
  }

  // Selected date items for dialog
  const selectedDateItems = selectedDate ? getItemsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-muted-foreground mt-1">
            Plan and schedule content across all your platforms.
          </p>
        </div>
        <Button className="gap-2" onClick={() => setAddEventOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>

      <AddEventDialog open={addEventOpen} onOpenChange={setAddEventOpen} />

      {/* Platform Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground mr-1">Filter:</span>
        {ALL_PLATFORMS.map((platform) => {
          const isActive = activePlatforms.has(platform);
          return (
            <Button
              key={platform}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={cn(
                "gap-2 text-xs h-8",
                isActive && "border-0"
              )}
              style={
                isActive
                  ? { backgroundColor: PLATFORM_COLORS[platform] + "33", color: PLATFORM_COLORS[platform] }
                  : undefined
              }
              onClick={() => togglePlatform(platform)}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: PLATFORM_COLORS[platform] }}
              />
              {PLATFORM_LABELS[platform]}
            </Button>
          );
        })}
      </div>

      {/* Calendar */}
      <Card>
        <CardContent className="p-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {calendarDays.map((day) => {
              const dayItems = getItemsForDate(day);
              const inMonth = isSameMonth(day, currentMonth);
              const today = isToday(day);

              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[100px] bg-card p-1.5 cursor-pointer transition-colors hover:bg-accent/50",
                    !inMonth && "opacity-30",
                    today && "ring-1 ring-primary ring-inset"
                  )}
                  onClick={() => {
                    setSelectedDate(day);
                    if (dayItems.length > 0) {
                      setDialogOpen(true);
                    }
                  }}
                >
                  {/* Day number */}
                  <div
                    className={cn(
                      "text-xs font-medium mb-1",
                      today
                        ? "text-primary font-bold"
                        : "text-muted-foreground"
                    )}
                  >
                    {format(day, "d")}
                  </div>

                  {/* Content chips */}
                  <div className="space-y-0.5">
                    {dayItems.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="text-[10px] leading-tight truncate rounded px-1 py-0.5 font-medium"
                        style={{
                          backgroundColor: PLATFORM_COLORS[item.platform] + "25",
                          color: PLATFORM_COLORS[item.platform],
                        }}
                        title={item.title}
                      >
                        {item.title}
                      </div>
                    ))}
                    {dayItems.length > 3 && (
                      <div className="text-[10px] text-muted-foreground pl-1">
                        +{dayItems.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Day Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : ""}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-3">
              {selectedDateItems.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No content scheduled for this day.
                </p>
              ) : (
                selectedDateItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{item.title}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge
                              variant="secondary"
                              className="text-[10px] border-0"
                              style={{
                                backgroundColor:
                                  PLATFORM_COLORS[item.platform] + "25",
                                color: PLATFORM_COLORS[item.platform],
                              }}
                            >
                              {PLATFORM_LABELS[item.platform]}
                            </Badge>
                            <span className="text-xs text-muted-foreground capitalize">
                              {item.type}
                            </span>
                            {item.time && (
                              <span className="text-xs text-muted-foreground">
                                {item.time}
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px] border-0 shrink-0",
                            item.status === "published"
                              ? "bg-green-500/20 text-green-400"
                              : item.status === "scheduled"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          )}
                        >
                          {item.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
