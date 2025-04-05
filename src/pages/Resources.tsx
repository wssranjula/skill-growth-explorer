
import { useState } from "react";
import { useLearningItems, useSkills } from "@/lib/data-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookText, Search, Clock, Filter, BookOpen, Video, FileText, Code, CheckCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Resources = () => {
  const { data: learningItems, isLoading } = useLearningItems();
  const { data: skills } = useSkills();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  
  // Filter resources based on search, skill, and type
  const filteredResources = learningItems?.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSkill = selectedSkill === "all" || item.skillIds.includes(selectedSkill);
    
    const matchesType = selectedType === "all" || item.type === selectedType;
    
    return matchesSearch && matchesSkill && matchesType;
  });

  // Get resource type icon
  const getResourceTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Video className="h-4 w-4" />;
      case "article":
        return <FileText className="h-4 w-4" />;
      case "course":
        return <BookOpen className="h-4 w-4" />;
      case "documentation":
        return <Code className="h-4 w-4" />;
      default:
        return <BookText className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Content Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column - Title and Description */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Learning <span className="text-primary">Resources</span>
              </h1>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 mr-2">
                  Curated Content
                </Badge>
                <span className="text-sm text-muted-foreground">Updated today</span>
              </div>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground pl-14">
            Browse curated resources to deepen your skills
          </p>
        </div>
      </div>

      {/* Filters and search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {skills?.map(skill => (
                    <SelectItem key={skill.id} value={skill.id}>
                      {skill.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="article">Articles</SelectItem>
                  <SelectItem value="course">Courses</SelectItem>
                  <SelectItem value="documentation">Documentation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card className="relative overflow-hidden">
        {/* Decorative accent - blue line at the top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-blue-500"></div>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookText className="mr-2 h-5 w-5 text-primary" />
            <span>Curated Resources</span>
          </CardTitle>
          <CardDescription>
            {!isLoading && `Showing ${filteredResources?.length || 0} resources`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-32 w-full" />
                ))
              ) : filteredResources && filteredResources.length > 0 ? (
                // Actual resources
                filteredResources.map(resource => (
                  <ResourceCard
                    key={resource.id}
                    title={resource.title}
                    description={resource.description}
                    type={resource.type}
                    duration={resource.duration}
                    completed={resource.completed}
                    url={resource.url}
                    skillIds={resource.skillIds}
                    skills={skills || []}
                    icon={getResourceTypeIcon(resource.type)}
                  />
                ))
              ) : (
                // No resources found
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-1">No resources found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search query
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className="h-32 w-full" />
                ))
              ) : filteredResources?.filter(r => r.completed).length ? (
                filteredResources
                  .filter(resource => resource.completed)
                  .map(resource => (
                    <ResourceCard
                      key={resource.id}
                      title={resource.title}
                      description={resource.description}
                      type={resource.type}
                      duration={resource.duration}
                      completed={resource.completed}
                      url={resource.url}
                      skillIds={resource.skillIds}
                      skills={skills || []}
                      icon={getResourceTypeIcon(resource.type)}
                    />
                  ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No completed resources found
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pending" className="space-y-4">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <Skeleton key={index} className="h-32 w-full" />
                ))
              ) : filteredResources?.filter(r => !r.completed).length ? (
                filteredResources
                  .filter(resource => !resource.completed)
                  .map(resource => (
                    <ResourceCard
                      key={resource.id}
                      title={resource.title}
                      description={resource.description}
                      type={resource.type}
                      duration={resource.duration}
                      completed={resource.completed}
                      url={resource.url}
                      skillIds={resource.skillIds}
                      skills={skills || []}
                      icon={getResourceTypeIcon(resource.type)}
                    />
                  ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No pending resources found
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

interface ResourceCardProps {
  title: string;
  description: string;
  type: string;
  duration: number;
  completed: boolean;
  url: string;
  skillIds: string[];
  skills: Array<{ id: string; name: string }>;
  icon: JSX.Element;
}

const ResourceCard = ({
  title,
  description,
  type,
  duration,
  completed,
  url,
  skillIds,
  skills,
  icon,
}: ResourceCardProps) => {
  // Get skill names for this resource
  const skillNames = skillIds
    .map(id => skills.find(skill => skill.id === id)?.name)
    .filter(Boolean);

  return (
    <div className={`p-4 rounded-lg border ${completed ? 'bg-muted/50' : ''} transition-all hover:shadow-md`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full ${completed ? 'bg-muted' : 'bg-primary/10'} flex-shrink-0`}>
          {icon}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{title}</h3>
            {completed && (
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                <CheckCircle className="h-3 w-3 mr-1" /> Completed
              </Badge>
            )}
          </div>
          
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
          
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="secondary">
              {type}
            </Badge>
            
            <div className="text-xs text-muted-foreground flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{duration} min</span>
            </div>
            
            {skillNames.map(name => (
              <Badge key={name} variant="outline" className="text-xs">
                {name}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button variant="outline" size="sm" asChild>
          <a href={url} target="_blank" rel="noopener noreferrer">
            View Resource
          </a>
        </Button>
      </div>
    </div>
  );
};

export default Resources;
