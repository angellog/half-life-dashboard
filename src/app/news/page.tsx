"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ExternalLink,
  Search,
  Newspaper,
  RefreshCw,
} from "lucide-react";
import { NewsTopic, NEWS_TOPICS } from "@/types";
import { getNewsByTopic } from "@/lib/data/news";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const SOURCE_COLORS: Record<string, string> = {
  Hypebeast: "bg-red-500/20 text-red-400",
  Highsnobiety: "bg-orange-500/20 text-orange-400",
  Complex: "bg-yellow-500/20 text-yellow-400",
  "Sole Collector": "bg-blue-500/20 text-blue-400",
  "Sneaker News": "bg-green-500/20 text-green-400",
  GQ: "bg-purple-500/20 text-purple-400",
  Vogue: "bg-pink-500/20 text-pink-400",
  "Business of Fashion": "bg-emerald-500/20 text-emerald-400",
};

const TOPIC_COLORS: Record<NewsTopic, string> = {
  "sneaker-releases": "bg-blue-500/20 text-blue-400",
  "fashion-trends": "bg-pink-500/20 text-pink-400",
  streetwear: "bg-orange-500/20 text-orange-400",
  industry: "bg-emerald-500/20 text-emerald-400",
};

export default function NewsPage() {
  const [activeTopic, setActiveTopic] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const articles = getNewsByTopic(activeTopic);

  // Filter by search query
  const filteredArticles = searchQuery
    ? articles.filter(
        (a) =>
          a.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.source.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : articles;

  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert("News feed updated with latest industry trends!");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">News Feed</h1>
          <p className="text-muted-foreground mt-1">
            Latest sneakers & fashion industry news from top sources.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2" 
          onClick={handleSync}
          disabled={isSyncing}
        >
          <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
          {isSyncing ? "Syncing..." : "Sync News"}
        </Button>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search news..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Separator orientation="vertical" className="h-8 hidden sm:block" />
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={activeTopic === "all" ? "default" : "outline"}
            size="sm"
            className="h-8 text-xs"
            onClick={() => setActiveTopic("all")}
          >
            All
          </Button>
          {NEWS_TOPICS.map((topic) => (
            <Button
              key={topic.value}
              variant={activeTopic === topic.value ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setActiveTopic(topic.value)}
            >
              {topic.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""}
      </p>

      {/* News Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredArticles.map((article) => (
          <Card
            key={article.id}
            className="group cursor-pointer transition-colors hover:border-primary/20"
          >
            <CardContent className="p-5">
              <div className="space-y-3">
                {/* Source + Topic badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "border-0 text-[10px] font-semibold",
                      SOURCE_COLORS[article.source] || "bg-zinc-500/20 text-zinc-400"
                    )}
                  >
                    {article.source}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "border-0 text-[10px]",
                      TOPIC_COLORS[article.topic]
                    )}
                  >
                    {NEWS_TOPICS.find((t) => t.value === article.topic)?.label}
                  </Badge>
                </div>

                {/* Headline */}
                <h3 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                  {article.headline}
                </h3>

                {/* Summary */}
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {article.summary}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1">
                  <p className="text-xs text-muted-foreground">
                    {formatDate(article.publishDate)}
                  </p>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredArticles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Newspaper className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No articles found</h3>
          <p className="text-sm text-muted-foreground">
            Try a different search term or topic filter.
          </p>
        </div>
      )}
    </div>
  );
}
