import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  MessageSquare,
  Search,
  Filter,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  User
} from 'lucide-react';

const SupplierMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState(0);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    {
      id: 1,
      contractor: 'Turner Construction',
      lastMessage: 'Can you provide a quote for 500 bags of Portland cement?',
      timestamp: '2 min ago',
      unread: 3,
      priority: 'high',
      status: 'active',
      avatar: '/contractor.jpg'
    },
    {
      id: 2,
      contractor: 'ABC Construction',
      lastMessage: 'Thank you for the quick delivery. The rebar quality was excellent.',
      timestamp: '1 hour ago',
      unread: 0,
      priority: 'normal',
      status: 'completed',
      avatar: '/contractor-2.jpg'
    },
    {
      id: 3,
      contractor: 'Metro Builders',
      lastMessage: 'When can you deliver the ready mix concrete?',
      timestamp: '3 hours ago',
      unread: 1,
      priority: 'medium',
      status: 'pending',
      avatar: '/contractor-3.png'
    },
    {
      id: 4,
      contractor: 'Skyline Construction',
      lastMessage: 'We need to discuss the steel beam specifications.',
      timestamp: '1 day ago',
      unread: 0,
      priority: 'normal',
      status: 'active',
      avatar: '/contractor.jpg'
    },
    {
      id: 5,
      contractor: 'Prime Contractors',
      lastMessage: 'The aggregate stone order has been received. Thanks!',
      timestamp: '2 days ago',
      unread: 0,
      priority: 'low',
      status: 'completed',
      avatar: '/contractor-2.jpg'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'Turner Construction',
      content: 'Hi, we need a quote for 500 bags of Portland cement Type I for our downtown project.',
      timestamp: '10:30 AM',
      isSupplier: false,
      attachments: []
    },
    {
      id: 2,
      sender: 'You',
      content: 'Hello! I can definitely help with that. For 500 bags of Portland cement Type I, our current price is $25 per bag. Total would be $12,500. We can deliver within 2-3 business days.',
      timestamp: '10:35 AM',
      isSupplier: true,
      attachments: []
    },
    {
      id: 3,
      sender: 'Turner Construction',
      content: 'That sounds good. Can you also provide pricing for 200 pieces of rebar #4 - 20ft?',
      timestamp: '10:40 AM',
      isSupplier: false,
      attachments: []
    },
    {
      id: 4,
      sender: 'You',
      content: 'Absolutely! For 200 pieces of rebar #4 - 20ft, the price is $42 per piece. Total would be $8,400. I can bundle both orders for a 3% discount if you\'re interested.',
      timestamp: '10:45 AM',
      isSupplier: true,
      attachments: ['quote-turner-construction.pdf']
    },
    {
      id: 5,
      sender: 'Turner Construction',
      content: 'Perfect! Please send me the formal quote with the bundled pricing. We\'d like to proceed with both orders.',
      timestamp: '11:00 AM',
      isSupplier: false,
      attachments: []
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <MessageSquare className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'completed': return <CheckCircle2 className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage('');
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-120px)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Messages
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Communicate with contractors and manage inquiries
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-primary hover:bg-yellow-400 text-black">
            <MessageSquare className="w-4 h-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Conversations</span>
              <Badge className="bg-primary/20 text-primary">
                {conversations.filter(c => c.unread > 0).length} unread
              </Badge>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary-light dark:text-text-secondary-dark" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conversation, index) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(index)}
                  className={`
                    p-4 cursor-pointer border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                    ${selectedConversation === index ? 'bg-primary/10 border-l-4 border-l-primary' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                      {conversation.unread > 0 && (
                        <div className="absolute -top-1 -right-1 size-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">{conversation.unread}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm truncate">{conversation.contractor}</h4>
                        <div className="flex items-center gap-1">
                          <Badge className={`text-xs ${getPriorityColor(conversation.priority)}`}>
                            {getStatusIcon(conversation.status)}
                            <span className="ml-1 capitalize">{conversation.status}</span>
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark truncate">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1">
                        {conversation.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="border-b border-border-light dark:border-border-dark">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{conversations[selectedConversation]?.contractor}</h3>
                  <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Active now
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Star className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSupplier ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-[70%] p-3 rounded-lg
                    ${message.isSupplier 
                      ? 'bg-primary text-black' 
                      : 'bg-gray-100 dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark'
                    }
                  `}>
                    <p className="text-sm">{message.content}</p>
                    {message.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-white/20 rounded">
                            <Paperclip className="w-3 h-3" />
                            <span className="text-xs">{attachment}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          {/* Message Input */}
          <div className="p-4 border-t border-border-light dark:border-border-dark">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <Textarea
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="min-h-[60px] resize-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  className="bg-primary hover:bg-yellow-400 text-black"
                  disabled={!newMessage.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SupplierMessages;