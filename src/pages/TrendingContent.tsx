
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { 
  TrendingUp, 
  BookText, 
  Video, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Bookmark, 
  ExternalLink, 
  ThumbsUp,
  Search,
  Filter,
  Star,
  Heart,
  Share
} from "lucide-react";

// Mock data for trending content
const trendingBlogs = [
  {
    id: "blog-1",
    title: "The Future of Serverless Architecture in 2025",
    excerpt: "Explore how serverless architecture is transforming cloud infrastructure and what skills you need to stay ahead.",
    author: "Jamie Wilson",
    authorRole: "Cloud Architect",
    authorAvatar: "",
    date: "April 2, 2025",
    readTime: "8 min",
    tags: ["Cloud", "Architecture", "Serverless"],
    likes: 243,
    category: "Technology",
    url: "#"
  },
  {
    id: "blog-2",
    title: "Understanding Large Language Model Prompting",
    excerpt: "A comprehensive guide to crafting effective prompts for LLMs and how this skill can enhance your productivity.",
    author: "Maya Patel",
    authorRole: "AI Researcher",
    authorAvatar: "",
    date: "March 28, 2025",
    readTime: "12 min",
    tags: ["AI", "Machine Learning", "Productivity"],
    likes: 187,
    category: "AI & Data",
    url: "#"
  },
  {
    id: "blog-3",
    title: "Micro-Frontends: Breaking Down the Monolith",
    excerpt: "Learn how to architect scalable frontend applications using micro-frontend patterns and when to use them.",
    author: "Carlos Mendez",
    authorRole: "Frontend Architect",
    authorAvatar: "",
    date: "March 25, 2025",
    readTime: "10 min",
    tags: ["Frontend", "Architecture", "JavaScript"],
    likes: 156,
    category: "Web Development",
    url: "#"
  },
];

const trendingVideos = [
  {
    id: "video-1",
    title: "Advanced TypeScript Patterns Every Developer Should Know",
    thumbnail: "https://placehold.co/600x400/3b82f6/ffffff?text=TypeScript+Patterns",
    channel: "CodeMastery",
    duration: "24:16",
    views: "43K",
    date: "April 1, 2025",
    tags: ["TypeScript", "Programming", "Advanced"],
    category: "Programming",
    url: "#"
  },
  {
    id: "video-2",
    title: "Building Resilient Microservices with Kubernetes",
    thumbnail: "https://placehold.co/600x400/10b981/ffffff?text=Kubernetes+Tutorial",
    channel: "Cloud Native Academy",
    duration: "42:05",
    views: "28K",
    date: "March 27, 2025",
    tags: ["Kubernetes", "DevOps", "Microservices"],
    category: "DevOps",
    url: "#"
  },
  {
    id: "video-3",
    title: "React Performance Optimization Master Class",
    thumbnail: "https://placehold.co/600x400/6366f1/ffffff?text=React+Performance",
    channel: "Frontend Masters",
    duration: "36:48",
    views: "35K",
    date: "March 22, 2025",
    tags: ["React", "Performance", "JavaScript"],
    category: "Web Development",
    url: "#"
  },
];

const trendingResearch = [
  {
    id: "research-1",
    title: "Transformers for Code: Advancing Software Engineering Through AI",
    authors: ["Samantha Chen", "David Kumar", "Alex Johnson"],
    institution: "Stanford AI Lab",
    publicationDate: "March 2025",
    abstract: "This paper explores the application of transformer models to code generation, refactoring, and bug detection, with implications for the future of software development.",
    keywords: ["AI", "Code Generation", "Machine Learning", "Software Engineering"],
    citationCount: 28,
    category: "AI & Data",
    url: "#"
  },
  {
    id: "research-2",
    title: "Neural Network Compression Techniques for Edge Devices",
    authors: ["Michael Zhang", "Elena Rodriguez", "Hiroshi Tanaka"],
    institution: "MIT CSAIL",
    publicationDate: "February 2025",
    abstract: "A comparative analysis of neural network compression techniques enabling deployment of complex models on resource-constrained edge devices.",
    keywords: ["Edge Computing", "Neural Networks", "Model Optimization", "Mobile"],
    citationCount: 43,
    category: "AI & Data",
    url: "#"
  },
  {
    id: "research-3",
    title: "Sustainable Computing: Energy Efficiency in Modern Data Centers",
    authors: ["Olivia Williams", "James Peterson"],
    institution: "ETH Zurich",
    publicationDate: "January 2025",
    abstract: "This research investigates novel approaches to reducing energy consumption in data centers while maintaining performance, with a focus on sustainable computing practices.",
    keywords: ["Sustainability", "Energy Efficiency", "Data Centers", "Green Computing"],
    citationCount: 35,
    category: "Technology",
    url: "#"
  },
];

// All unique categories across content types
const allCategories = [
  "All", 
  "Technology", 
  "AI & Data", 
  "Web Development", 
  "Programming", 
  "DevOps"
];

const TrendingContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("blogs");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedItems, setSavedItems] = useState<string[]>([]);
  
  // Filter content based on category and search query
  const filteredBlogs = trendingBlogs.filter(blog => 
    (selectedCategory === "All" || blog.category === selectedCategory) &&
    (blog.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredVideos = trendingVideos.filter(video => 
    (selectedCategory === "All" || video.category === selectedCategory) &&
    (video.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const filteredResearch = trendingResearch.filter(paper => 
    (selectedCategory === "All" || paper.category === selectedCategory) &&
    (paper.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle saving/bookmarking content
  const handleSaveItem = (id: string) => {
    if (savedItems.includes(id)) {
      setSavedItems(savedItems.filter(itemId => itemId !== id));
      toast({
        title: "Removed from saved items",
        description: "The content has been removed from your saved items.",
      });
    } else {
      setSavedItems([...savedItems, id]);
      toast({
        title: "Saved for later",
        description: "The content has been added to your saved items.",
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Header Section with Hero Banner */}
      <div className="rounded-lg p-6 bg-gradient-to-r from-purple-50 to-blue-50 mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <div className="flex items-center mb-2">
              <TrendingUp className="h-6 w-6 text-primary mr-2" />
              <h1 className="text-3xl font-bold tracking-tight">Trending Content</h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Stay updated with the latest trends and resources in your field. 
              Our AI constantly analyzes thousands of resources to bring you the most relevant content.
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button 
              variant="outline"
              onClick={() => navigate("/skills")}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Back to Skills
            </Button>
          </div>
        </div>
        
        {/* Search and Filter Section */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search trending content..."
              className="w-full pl-9 bg-white/90"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => (
              <Badge 
                key={category} 
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/20"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="blogs" onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="blogs" className="flex items-center gap-2">
            <BookText className="h-4 w-4" />
            <span className="hidden sm:inline">Blog Posts</span>
            <span className="sm:hidden">Blogs</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            <span>Videos</span>
          </TabsTrigger>
          <TabsTrigger value="research" className="flex items-center gap-2">
            <BookText className="h-4 w-4" />
            <span className="hidden sm:inline">Research Papers</span>
            <span className="sm:hidden">Research</span>
          </TabsTrigger>
        </TabsList>

        {/* Blog Posts */}
        <TabsContent value="blogs" className="mt-6">
          {filteredBlogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <Card key={blog.id} className="overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
                  <CardHeader className="pb-3 border-b">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="text-xl line-clamp-2">{blog.title}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          <span>{blog.date}</span>
                          <Separator orientation="vertical" className="mx-2 h-3" />
                          <Clock className="h-3.5 w-3.5 mr-1" />
                          <span>{blog.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-3">{blog.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {blog.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between items-center border-t mt-3 pt-3">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex items-center cursor-pointer">
                          <Avatar className="h-7 w-7 mr-2">
                            <AvatarImage src={blog.authorAvatar} alt={blog.author} />
                            <AvatarFallback>{blog.author.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="text-xs">
                            <p className="font-medium">{blog.author}</p>
                            <p className="text-muted-foreground">{blog.authorRole}</p>
                          </div>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-64">
                        <div className="flex justify-between space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={blog.authorAvatar} />
                            <AvatarFallback>{blog.author.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <h4 className="text-sm font-semibold">{blog.author}</h4>
                            <p className="text-sm text-muted-foreground">{blog.authorRole}</p>
                            <div className="flex items-center pt-2">
                              <span className="text-xs text-muted-foreground">3 articles this month</span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                    <div className="flex items-center gap-3">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs flex items-center">
                              <ThumbsUp className={cn("h-3.5 w-3.5 mr-1", "text-muted-foreground")} />
                              {blog.likes}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{blog.likes} people found this helpful</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" 
                              onClick={() => handleSaveItem(blog.id)}>
                              <Bookmark className={cn(
                                "h-4 w-4", 
                                savedItems.includes(blog.id) ? "fill-primary text-primary" : "text-muted-foreground"
                              )} />
                              <span className="sr-only">Save for later</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{savedItems.includes(blog.id) ? "Remove from saved" : "Save for later"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                        <a href={blog.url} target="_blank" rel="noopener noreferrer">
                          <span className="sr-only">Read article</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No blog posts found matching your criteria.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Videos */}
        <TabsContent value="videos" className="mt-6">
          {filteredVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]">
                  <div className="relative group">
                    <AspectRatio ratio={16 / 9}>
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        className="object-cover w-full rounded-t-lg"
                      />
                    </AspectRatio>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-0.5 rounded text-xs font-medium">
                      {video.duration}
                    </div>
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity" asChild>
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                          Watch Now
                        </a>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-base line-clamp-2 mb-2">{video.title}</h3>
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <span>{video.channel}</span>
                      <span className="mx-2">•</span>
                      <span>{video.views} views</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {video.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between border-t mt-3 pt-3">
                    <div className="text-xs text-muted-foreground">
                      {video.date}
                    </div>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" 
                              onClick={() => handleSaveItem(video.id)}>
                              <Bookmark className={cn(
                                "h-4 w-4", 
                                savedItems.includes(video.id) ? "fill-primary text-primary" : "text-muted-foreground"
                              )} />
                              <span className="sr-only">Save for later</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{savedItems.includes(video.id) ? "Remove from saved" : "Save for later"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <Button variant="ghost" size="sm" asChild>
                        <a href={video.url} target="_blank" rel="noopener noreferrer">
                          Watch <ExternalLink className="ml-1 h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No videos found matching your criteria.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Research Papers */}
        <TabsContent value="research" className="mt-6">
          {filteredResearch.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredResearch.map((paper) => (
                <Card key={paper.id} className="transition-all duration-300 hover:shadow-md hover:border-primary/20">
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle className="text-xl">{paper.title}</CardTitle>
                      <Badge variant="outline">{paper.category}</Badge>
                    </div>
                    <CardDescription>
                      <div className="flex flex-wrap items-center text-sm">
                        <span>{paper.authors.join(", ")}</span>
                        <span className="mx-2">•</span>
                        <span>{paper.institution}</span>
                        <span className="mx-2">•</span>
                        <span>{paper.publicationDate}</span>
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{paper.abstract}</p>
                    <div className="flex flex-wrap gap-2">
                      {paper.keywords.map((keyword) => (
                        <Badge key={keyword} variant="outline" className="text-xs">{keyword}</Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-amber-500 mr-1" />
                              <span className="text-sm text-muted-foreground">Citations: {paper.citationCount}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Cited by {paper.citationCount} other papers</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleSaveItem(paper.id)}
                      >
                        <Bookmark className={cn(
                          "mr-1 h-4 w-4", 
                          savedItems.includes(paper.id) ? "fill-primary text-primary" : ""
                        )} />
                        {savedItems.includes(paper.id) ? "Saved" : "Save"}
                      </Button>
                      <Button size="sm" asChild>
                        <a href={paper.url} target="_blank" rel="noopener noreferrer">
                          Read Paper
                        </a>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No research papers found matching your criteria.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrendingContent;
