import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreHorizontal,
  Archive
} from 'lucide-react';

const Messages = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState('1');
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: '1',
      name: 'Turner Construction',
      project: 'Medical Center Expansion',
      lastMessage: 'Thanks for the updated timeline. Looks good!',
      timestamp: '2 hours ago',
      unread: 2,
      status: 'active',
      avatar: 'TC'
    },
    {
      id: '2',
      name: 'Skanska',
      project: 'Riverside High School',
      lastMessage: 'Can you provide the material specifications?',
      timestamp: '1 day ago',
      unread: 0,
      status: 'pending',
      avatar: 'SK'
    },
    {
      id: '3',
      name: 'D.R. Horton',
      project: 'Aurora Apartments Phase 2',
      lastMessage: 'Meeting scheduled for tomorrow at 2 PM',
      timestamp: '2 days ago',
      unread: 1,
      status: 'scheduled',
      avatar: 'DH'
    },
    {
      id: '4',
      name: 'McCarthy Building',
      project: 'Downtown Shopping Center',
      lastMessage: 'Project completed successfully. Great work!',
      timestamp: '1 week ago',
      unread: 0,
      status: 'completed',
      avatar: 'MC'
    }
  ];

  const messages = [
    {
      id: '1',
      sender: 'Turner Construction',
      message: 'Hi Acme Construction, we received your bid for the Medical Center project. Very competitive pricing!',
      timestamp: '10:30 AM',
      type: 'received'
    },
    {
      id: '2',
      sender: 'You',
      message: 'Thank you! We\'re excited about this opportunity. Our team has extensive experience with medical facilities.',
      timestamp: '10:45 AM',
      type: 'sent'
    },
    {
      id: '3',
      sender: 'Turner Construction',
      message: 'That\'s great to hear. Can you provide a detailed timeline for the HVAC installation phase?',
      timestamp: '11:15 AM',
      type: 'received'
    },
    {
      id: '4',
      sender: 'You',
      message: 'Absolutely. I\'ll have our project manager prepare a detailed schedule and send it over by end of day.',
      timestamp: '11:20 AM',
      type: 'sent'
    },
    {
      id: '5',
      sender: 'Turner Construction',
      message: 'Thanks for the updated timeline. Looks good!',
      timestamp: '2:30 PM',
      type: 'received'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">Pending</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">Scheduled</Badge>;
      case 'completed':
        return <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    // Add message logic here
    setNewMessage('');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Messages</h1>
            <p className="text-text-secondary-light dark:text-text-secondary-dark">
              Communicate with general contractors and project managers
            </p>
          </div>
          <Button className="bg-primary hover:bg-yellow-400 text-black font-semibold">
            <MessageSquare className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Conversations</CardTitle>
                  <Badge className="bg-primary/10 text-primary">
                    {conversations.filter(c => c.unread > 0).length} unread
                  </Badge>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3 mx-4 mb-4">
                    <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                    <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
                    <TabsTrigger value="archived" className="text-xs">Archived</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-0">
                    <div className="space-y-1">
                      {conversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => setSelectedConversation(conversation.id)}
                          className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-l-4 ${
                            selectedConversation === conversation.id
                              ? 'border-primary bg-primary/5'
                              : 'border-transparent'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-primary">{conversation.avatar}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-sm truncate">{conversation.name}</h4>
                                {conversation.unread > 0 && (
                                  <Badge className="bg-red-500 text-white text-xs rounded-full size-5 flex items-center justify-center p-0">
                                    {conversation.unread}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1 truncate">
                                {conversation.project}
                              </p>
                              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark truncate">
                                {conversation.lastMessage}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                  {conversation.timestamp}
                                </span>
                                {getStatusBadge(conversation.status)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="unread" className="mt-0">
                    <div className="space-y-1">
                      {conversations.filter(c => c.unread > 0).map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => setSelectedConversation(conversation.id)}
                          className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-primary">{conversation.avatar}</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-semibold text-sm">{conversation.name}</h4>
                                <Badge className="bg-red-500 text-white text-xs">
                                  {conversation.unread}
                                </Badge>
                              </div>
                              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">
                                {conversation.project}
                              </p>
                              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                {conversation.lastMessage}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="archived" className="mt-0">
                    <div className="p-8 text-center">
                      <Archive className="w-12 h-12 text-text-secondary-light dark:text-text-secondary-dark mx-auto mb-4" />
                      <p className="text-text-secondary-light dark:text-text-secondary-dark">No archived conversations</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Message Thread */}
          <div className="lg:col-span-2">
            <Card className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark h-[600px] flex flex-col">
              {/* Message Header */}
              <CardHeader className="border-b border-border-light dark:border-border-dark">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">TC</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Turner Construction</h3>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Medical Center Expansion
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'sent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${message.type === 'sent' ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-lg p-3 ${
                          message.type === 'sent'
                            ? 'bg-primary text-black ml-4'
                            : 'bg-gray-100 dark:bg-gray-800 mr-4'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <p
                        className={`text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1 ${
                          message.type === 'sent' ? 'text-right mr-4' : 'text-left ml-4'
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* Message Input */}
              <div className="border-t border-border-light dark:border-border-dark p-4">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="sm" className="mb-2">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="min-h-[40px] max-h-[120px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-primary hover:bg-yellow-400 text-black mb-2"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;