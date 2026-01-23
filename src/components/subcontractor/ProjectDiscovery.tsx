import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Bot,
  Building,
  Clock,
  Star,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

const ProjectDiscovery = () => {
  const [savedProjects, setSavedProjects] = useState<Set<string>>(new Set());

  const toggleSave = (projectId: string) => {
    const newSaved = new Set(savedProjects);
    if (newSaved.has(projectId)) {
      newSaved.delete(projectId);
    } else {
      newSaved.add(projectId);
    }
    setSavedProjects(newSaved);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Project Discovery</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Discover new opportunities that match your expertise
            </p>
          </div>
          <Button className="bg-primary hover:bg-yellow-400 text-black font-semibold">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark w-4 h-4" />
                  <Input
                    placeholder="Search by project name, location, or GC..."
                    className="pl-10"
                  />
                </div>
              </div>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Trade Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hvac">HVAC</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="concrete">Concrete</SelectItem>
                  <SelectItem value="roofing">Roofing</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Project Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="public">Public Works</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Showing <span className="font-semibold">24 projects</span> matching your criteria
          </p>
          <Select>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by: Best Match" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Best Match</SelectItem>
              <SelectItem value="budget">Budget (High to Low)</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="posted">Recently Posted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Project Cards */}
        <div className="space-y-4">
          {/* Project 1 */}
          <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors group">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="size-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 bg-cover bg-center flex items-center justify-center">
                    <Building className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded">
                        Commercial
                      </Badge>
                      <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs font-bold px-2 py-1 rounded">
                        HVAC
                      </Badge>
                      <div className="flex items-center gap-1 text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs">
                        <Bot className="w-3 h-3" />
                        <span>98% Match</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors mb-2">
                      Downtown Medical Center Expansion
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Austin, TX
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        Turner Construction
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        4.8 GC Rating
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                      Seeking experienced HVAC contractor for 150,000 sq ft medical facility expansion. 
                      Project includes installation of advanced climate control systems, medical gas systems, and energy-efficient HVAC solutions.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between gap-4 min-w-[200px]">
                  <div className="text-right">
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">Est. Budget</p>
                    <p className="font-bold text-2xl">$2.4M - $3M</p>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Button className="bg-primary text-black text-sm font-bold hover:bg-yellow-400">
                      View Details & Bid
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSave('project-1')}
                      className="flex items-center gap-2"
                    >
                      {savedProjects.has('project-1') ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                      {savedProjects.has('project-1') ? 'Saved' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-between text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <div className="flex gap-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: Oct 24, 2023
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Posted 2 days ago
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    45 views
                  </span>
                </div>
                <span className="text-green-600 font-semibold">12 bids submitted</span>
              </div>
            </CardContent>
          </Card>

          {/* Project 2 */}
          <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors group">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="size-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 bg-cover bg-center flex items-center justify-center">
                    <Building className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-xs font-bold px-2 py-1 rounded">
                        Public Works
                      </Badge>
                      <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 text-xs font-bold px-2 py-1 rounded">
                        HVAC
                      </Badge>
                      <div className="flex items-center gap-1 text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs">
                        <Bot className="w-3 h-3" />
                        <span>92% Match</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors mb-2">
                      Riverside High School Renovation
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        San Marcos, TX
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        Skanska
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        4.9 GC Rating
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                      Complete HVAC system upgrade for 80,000 sq ft high school facility. 
                      Includes new energy-efficient units, ductwork replacement, and smart climate controls.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between gap-4 min-w-[200px]">
                  <div className="text-right">
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">Est. Budget</p>
                    <p className="font-bold text-2xl">$850k</p>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Button className="bg-primary text-black text-sm font-bold hover:bg-yellow-400">
                      View Details & Bid
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSave('project-2')}
                      className="flex items-center gap-2"
                    >
                      {savedProjects.has('project-2') ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                      {savedProjects.has('project-2') ? 'Saved' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-between text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <div className="flex gap-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: Oct 28, 2023
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Posted 5 days ago
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    12 views
                  </span>
                </div>
                <span className="text-green-600 font-semibold">3 bids submitted</span>
              </div>
            </CardContent>
          </Card>

          {/* Project 3 */}
          <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors group">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="size-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0 bg-cover bg-center flex items-center justify-center">
                    <Building className="w-8 h-8 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-bold px-2 py-1 rounded">
                        Multi-Family
                      </Badge>
                      <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded">
                        Plumbing
                      </Badge>
                      <div className="flex items-center gap-1 text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded text-xs">
                        <Bot className="w-3 h-3" />
                        <span>88% Match</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl leading-tight group-hover:text-primary transition-colors mb-2">
                      The Aurora Apartments Phase 2
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary-light dark:text-text-secondary-dark mb-3">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Austin, TX
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        D.R. Horton
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        4.7 GC Rating
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed">
                      Plumbing installation for 200-unit luxury apartment complex. 
                      Includes rough-in, fixtures, and water efficiency systems for all units and common areas.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between gap-4 min-w-[200px]">
                  <div className="text-right">
                    <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark font-medium">Est. Budget</p>
                    <p className="font-bold text-2xl">$1.2M</p>
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <Button className="bg-primary text-black text-sm font-bold hover:bg-yellow-400">
                      View Details & Bid
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSave('project-3')}
                      className="flex items-center gap-2"
                    >
                      {savedProjects.has('project-3') ? (
                        <BookmarkCheck className="w-4 h-4" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                      {savedProjects.has('project-3') ? 'Saved' : 'Save'}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark flex items-center justify-between text-sm text-text-secondary-light dark:text-text-secondary-dark">
                <div className="flex gap-6">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Due: Nov 02, 2023
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Posted 1 week ago
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    210 views
                  </span>
                </div>
                <span className="text-green-600 font-semibold">8 bids submitted</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Load More */}
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="px-8">
            Load More Projects
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDiscovery;