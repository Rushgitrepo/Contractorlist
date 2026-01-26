import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Upload,
  Download,
  Search,
  Filter,
  Plus,
  Folder,
  File,
  Image,
  Video,
  Archive,
  Share2,
  MoreVertical,
  Eye,
  Star,
  Clock,
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'archive';
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
  project: string;
  category: string;
  starred: boolean;
  shared: boolean;
}

const EnhancedDocuments = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const documents: Document[] = [
    {
      id: '1',
      name: 'Austin Medical Center - Architectural Plans.pdf',
      type: 'pdf',
      size: 15728640,
      uploadedBy: 'John Smith',
      uploadedAt: new Date('2024-01-15'),
      project: 'Austin Medical Center',
      category: 'Plans',
      starred: true,
      shared: true
    },
    {
      id: '2',
      name: 'Office Complex - Structural Drawings.dwg',
      type: 'doc',
      size: 8388608,
      uploadedBy: 'Sarah Johnson',
      uploadedAt: new Date('2024-02-01'),
      project: 'Downtown Office Complex',
      category: 'Drawings',
      starred: false,
      shared: true
    },
    {
      id: '3',
      name: 'Site Progress Photos - Week 12.zip',
      type: 'archive',
      size: 52428800,
      uploadedBy: 'Mike Davis',
      uploadedAt: new Date('2024-03-10'),
      project: 'Riverside Shopping Center',
      category: 'Photos',
      starred: false,
      shared: false
    }
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
      case 'doc':
        return <FileText className="w-5 h-5 text-red-500 dark:text-red-400" />;
      case 'image':
        return <Image className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'video':
        return <Video className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'archive':
        return <Archive className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      default:
        return <File className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20 bg-gray-50 dark:bg-[#0f1115] min-h-screen text-gray-900 dark:text-white font-sans transition-colors duration-300">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] rounded-full bg-yellow-400/5 dark:bg-yellow-600/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">
              Document Management
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Enterprise document storage, sharing, and collaboration platform
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Cloud Storage Active</span>
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500">
                2.1TB of 5TB used
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 bg-transparent">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filter
            </Button>
            <Button variant="outline" className="border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 bg-transparent">
              <Download className="w-4 h-4 mr-2" />
              Bulk Download
            </Button>
            <Button className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-black font-semibold shadow-sm dark:shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <Upload className="w-4 h-4 mr-2" />
              Upload Documents
            </Button>
          </div>
        </div>

        {/* Document Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 shadow-sm hover:border-yellow-400 dark:hover:border-yellow-500/20 transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-xl group-hover:bg-blue-200 dark:group-hover:bg-blue-500/20 transition-colors">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <Badge className="bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20">
                  +12 Today
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1,247</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Documents</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Across all projects</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 shadow-sm hover:border-yellow-400 dark:hover:border-yellow-500/20 transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-500/10 rounded-xl group-hover:bg-green-200 dark:group-hover:bg-green-500/20 transition-colors">
                  <Share2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <Badge className="bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20">
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">89</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Shared Documents</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">With external clients</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 shadow-sm hover:border-yellow-400 dark:hover:border-yellow-500/20 transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-500/10 rounded-xl group-hover:bg-purple-200 dark:group-hover:bg-purple-500/20 transition-colors">
                  <Folder className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge className="bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20">
                  24 Projects
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">156</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Project Folders</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Organized by project</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 shadow-sm hover:border-yellow-400 dark:hover:border-yellow-500/20 transition-all cursor-pointer group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-500/10 rounded-xl group-hover:bg-orange-200 dark:group-hover:bg-orange-500/20 transition-colors">
                  <Archive className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <Badge className="bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20">
                  2.1TB Used
                </Badge>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">42%</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Storage Used</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Of 5TB total capacity</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Document Interface */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Document List */}
          <div className="xl:col-span-3">
            <Card className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">Document Library</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 bg-transparent">
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 bg-transparent">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 group-focus-within:text-yellow-600 dark:group-focus-within:text-yellow-400" />
                    <Input
                      placeholder="Search documents, projects, or file types..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-100 dark:bg-black/20 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 focus:border-yellow-500/50"
                    />
                  </div>
                  <Button variant="outline" className="border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 bg-transparent">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5 bg-gray-100 dark:bg-black/20 border border-gray-200 dark:border-white/5 p-1 rounded-xl mb-4">
                    <TabsTrigger value="all" className="data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-gray-500 dark:text-gray-400 rounded-lg">All Files</TabsTrigger>
                    <TabsTrigger value="recent" className="data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-gray-500 dark:text-gray-400 rounded-lg">Recent</TabsTrigger>
                    <TabsTrigger value="shared" className="data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-gray-500 dark:text-gray-400 rounded-lg">Shared</TabsTrigger>
                    <TabsTrigger value="starred" className="data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-gray-500 dark:text-gray-400 rounded-lg">Starred</TabsTrigger>
                    <TabsTrigger value="archived" className="data-[state=active]:bg-yellow-400 dark:data-[state=active]:bg-yellow-500 data-[state=active]:text-black text-gray-500 dark:text-gray-400 rounded-lg">Archived</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-4">
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-white/5 rounded-xl bg-gray-50 dark:bg-white/[0.02] hover:bg-gray-100 dark:hover:bg-white/[0.05] hover:border-yellow-400 dark:hover:border-yellow-500/20 transition-all cursor-pointer group">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 dark:bg-black/20 rounded-lg border border-gray-200 dark:border-white/5 group-hover:border-yellow-400 dark:group-hover:border-yellow-500/20 transition-colors">
                              {getFileIcon(doc.type)}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">{doc.name}</h3>
                              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mt-1">
                                <span>{formatFileSize(doc.size)}</span>
                                <span>•</span>
                                <span>{doc.uploadedBy}</span>
                                <span>•</span>
                                <span>{doc.uploadedAt.toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hidden lg:inline-flex">
                              {doc.project}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hidden lg:inline-flex">
                              {doc.category}
                            </Badge>
                            {doc.starred && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
                            {doc.shared && <Share2 className="w-4 h-4 text-blue-500 dark:text-blue-400" />}
                          </div>

                          <div className="flex gap-1 opaicty-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" className="text-gray-400 dark:text-gray-400 hover:text-black dark:hover:text-white">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 dark:text-gray-400 hover:text-black dark:hover:text-white">
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 dark:text-gray-400 hover:text-black dark:hover:text-white">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="recent" className="space-y-4">
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Recent Documents</h3>
                      <p className="text-gray-500 dark:text-gray-500">Documents you've accessed recently will appear here</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="shared" className="space-y-4">
                    <div className="text-center py-12">
                      <Share2 className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Shared Documents</h3>
                      <p className="text-gray-500 dark:text-gray-500">Documents shared with clients and team members</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="starred" className="space-y-4">
                    <div className="text-center py-12">
                      <Star className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Starred Documents</h3>
                      <p className="text-gray-500 dark:text-gray-500">Important documents you've marked with a star</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="archived" className="space-y-4">
                    <div className="text-center py-12">
                      <Archive className="w-16 h-16 text-gray-300 dark:text-gray-500 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Archived Documents</h3>
                      <p className="text-gray-500 dark:text-gray-500">Completed project documents and archived files</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Upload */}
            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-500/10 dark:to-yellow-600/10 border-yellow-200 dark:border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-lg text-yellow-800 dark:text-white">Quick Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start gap-3 bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-black font-semibold">
                  <Upload className="w-4 h-4" />
                  Upload Files
                </Button>
                <Button className="w-full justify-start gap-3 border-yellow-200 dark:border-white/10 text-yellow-700 dark:text-gray-300 hover:text-yellow-900 dark:hover:text-white hover:bg-yellow-100 dark:hover:bg-white/5 bg-transparent" variant="outline">
                  <Folder className="w-4 h-4" />
                  Create Folder
                </Button>
                <Button className="w-full justify-start gap-3 border-yellow-200 dark:border-white/10 text-yellow-700 dark:text-gray-300 hover:text-yellow-900 dark:hover:text-white hover:bg-yellow-100 dark:hover:bg-white/5 bg-transparent" variant="outline">
                  <Plus className="w-4 h-4" />
                  New Document
                </Button>
              </CardContent>
            </Card>

            {/* Storage Info */}
            <Card className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">Storage Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                    <span>Used Storage</span>
                    <span>2.1TB / 5TB</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-400 dark:bg-yellow-500 h-2 rounded-full shadow-[0_0_8px_rgba(234,179,8,0.5)]" style={{ width: '42%' }}></div>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"></div>
                      Documents
                    </span>
                    <span>1.2TB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full"></div>
                      Images
                    </span>
                    <span>650GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full"></div>
                      Videos
                    </span>
                    <span>250GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 dark:text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Document uploaded</p>
                      <p className="text-xs text-gray-500">Architectural Plans.pdf - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Document shared</p>
                      <p className="text-xs text-gray-500">With Austin Medical Group - 4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 shadow-[0_0_5px_rgba(168,85,247,0.5)]"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Folder created</p>
                      <p className="text-xs text-gray-500">Office Complex Phase 2 - 1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDocuments;