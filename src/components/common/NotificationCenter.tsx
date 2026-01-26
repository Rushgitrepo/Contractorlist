import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Bell,
  Search,
  Filter,
  Check,
  CheckCheck,
  Archive,
  Trash2,
  Settings,
  Clock,
  AlertCircle,
  Info,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  DollarSign,
  Calendar,
  FileText,
  Users,
  X
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'message' | 'bid' | 'project' | 'payment';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  starred: boolean;
  archived: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
  metadata?: any;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  // Mock notifications data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'bid',
        title: 'New Bid Opportunity',
        message: 'Medical Center HVAC project - $250K budget. Perfect match for your expertise!',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        starred: true,
        archived: false,
        priority: 'high',
        actionUrl: '/subcontractor-dashboard/find-projects',
        metadata: { projectId: 'proj-123', budget: 250000 }
      },
      {
        id: '2',
        type: 'message',
        title: 'New Message from Austin Medical Group',
        message: 'We have some questions about your HVAC proposal. Can we schedule a call?',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        starred: false,
        archived: false,
        priority: 'medium',
        actionUrl: '/subcontractor-dashboard/messages',
        metadata: { senderId: 'client-456' }
      },
      {
        id: '3',
        type: 'success',
        title: 'Bid Accepted!',
        message: 'Congratulations! Your bid for Office Building Renovation has been accepted.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        starred: true,
        archived: false,
        priority: 'high',
        actionUrl: '/subcontractor-dashboard/my-projects',
        metadata: { projectId: 'proj-789', amount: 150000 }
      },
      {
        id: '4',
        type: 'payment',
        title: 'Payment Received',
        message: 'Payment of $25,000 received for School District HVAC project milestone.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        read: true,
        starred: false,
        archived: false,
        priority: 'medium',
        actionUrl: '/subcontractor-dashboard/overview',
        metadata: { amount: 25000, projectId: 'proj-321' }
      },
      {
        id: '5',
        type: 'warning',
        title: 'Deadline Reminder',
        message: 'Hospital HVAC bid submission due in 2 days. Current completion: 87%',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        read: false,
        starred: false,
        archived: false,
        priority: 'high',
        actionUrl: '/subcontractor-dashboard/bid-management',
        metadata: { bidId: 'bid-654', dueDate: '2024-02-15' }
      },
      {
        id: '6',
        type: 'project',
        title: 'Project Status Update',
        message: 'Apartment Complex HVAC installation is 75% complete. Next milestone due Friday.',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        read: true,
        starred: false,
        archived: false,
        priority: 'low',
        actionUrl: '/subcontractor-dashboard/my-projects',
        metadata: { projectId: 'proj-987', progress: 75 }
      },
      {
        id: '7',
        type: 'info',
        title: 'AI Recommendation',
        message: 'Based on your recent wins, consider bidding on commercial projects in Round Rock area.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
        starred: false,
        archived: false,
        priority: 'low',
        actionUrl: '/subcontractor-dashboard/ai-assistant',
        metadata: { recommendation: 'location-expansion' }
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-blue-600" />;
      case 'bid': return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'project': return <FileText className="w-5 h-5 text-purple-600" />;
      case 'payment': return <DollarSign className="w-5 h-5 text-green-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-300';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unread' && !notification.read) ||
                      (activeTab === 'starred' && notification.starred) ||
                      (activeTab === notification.type);
    
    return matchesSearch && matchesTab && !notification.archived;
  });

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;
  const starredCount = notifications.filter(n => n.starred && !n.archived).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleStar = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, starred: !n.starred } : n
    ));
  };

  const archiveNotification = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, archived: true } : n
    ));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md h-full shadow-2xl">
        <Card className="h-full rounded-none border-0">
          <CardHeader className="border-b border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                <CardTitle>Notifications</CardTitle>
                {unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white">{unreadCount}</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>

          <CardContent className="p-0 h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4 rounded-none">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </TabsTrigger>
                <TabsTrigger value="starred">
                  Starred {starredCount > 0 && `(${starredCount})`}
                </TabsTrigger>
                <TabsTrigger value="bid">Bids</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="flex-1 m-0">
                <ScrollArea className="h-full">
                  <div className="space-y-1">
                    {filteredNotifications.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No notifications found</p>
                      </div>
                    ) : (
                      filteredNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-l-4 ${getPriorityColor(notification.priority)} ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                          } hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`text-sm font-medium ${!notification.read ? 'font-bold' : ''}`}>
                                  {notification.title}
                                </h4>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(notification.timestamp)}
                                  </span>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              
                              {/* Action buttons */}
                              <div className="flex items-center gap-2 mt-3">
                                {notification.actionUrl && (
                                  <Button size="sm" variant="outline" className="text-xs">
                                    View Details
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleStar(notification.id);
                                  }}
                                  className="text-xs"
                                >
                                  <Star className={`w-3 h-3 ${notification.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    archiveNotification(notification.id);
                                  }}
                                  className="text-xs"
                                >
                                  <Archive className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="text-xs text-red-600"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationCenter;