
import { useState } from "react";
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
import { 
  TrendingUp, 
  BookText, 
  Video, 
  ArrowRight, 
  Calendar, 
  Clock, 
  Bookmark, 
  ExternalLink, 
  ThumbsUp 
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
    url: "#"
  },
];

const TrendingContent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("blogs");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trending Content</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest trends and resources in your field
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingBlogs.map((blog) => (
              <Card key={blog.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-3">
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
                <CardContent className="pb-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">{blog.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {blog.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0 flex justify-between items-center">
                  <div className="flex items-center">
                    <Avatar className="h-7 w-7 mr-2">
                      <AvatarImage src={blog.authorAvatar} alt={blog.author} />
                      <AvatarFallback>{blog.author.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="text-xs">
                      <p className="font-medium">{blog.author}</p>
                      <p className="text-muted-foreground">{blog.authorRole}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs flex items-center">
                      <ThumbsUp className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                      {blog.likes}
                    </span>
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
        </TabsContent>

        {/* Videos */}
        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <div className="relative">
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
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-base line-clamp-2">{video.title}</h3>
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
                <CardFooter className="pt-0 flex justify-end">
                  <Button variant="ghost" size="sm" asChild>
                    <a href={video.url} target="_blank" rel="noopener noreferrer">
                      Watch Video <ExternalLink className="ml-1 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Research Papers */}
        <TabsContent value="research" className="mt-6">
          <div className="grid grid-cols-1 gap-6">
            {trendingResearch.map((paper) => (
              <Card key={paper.id} className="transition-all duration-300 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">{paper.title}</CardTitle>
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
                <CardFooter className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Citations: {paper.citationCount}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="mr-1 h-4 w-4" />
                      Save
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrendingContent;
