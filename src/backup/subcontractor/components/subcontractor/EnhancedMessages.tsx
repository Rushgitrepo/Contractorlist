import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Reply,
  Forward,
  Pin,
  Smile,
  Image,
  File,
  Calendar,
  CheckCheck,
  Check,
  Clock,
  Users,
  Plus,
  Filter,
  Settings,
  MessageSquare,
  Zap,
  AlertCircle,
  ThumbsUp,
  Heart,
  Laugh
} from 'lucide-react';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  edited?: boolean;
  editedAt?: Date;
  readBy: string[];
  reactions: Reaction[];
  attachments: Attachment[];
  replyTo?: string;
  pinned?: boolean;
  type: 'text' | 'image' | 'file' | 'system';
  threadId?: string;
}

interface Reaction {
  emoji: string;
  users: string[];
  count: number;
}

interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  thumbnail?: string;
}

interface Conversation {
  id: string;
  name: string;
  type: 'direct' | 'group' | 'project';
  participants: Participant[];
  lastMessage?: Message;
  unreadCount: number;
  pinned: boolean;
  archived: boolean;
  muted: boolean;
  projectId?: string;
  avatar?: string;
}

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  online: boolean;
  lastSeen?: Date;
}

const EnhancedMessages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: '1',
        name: 'Austin Medical Group',
        type: 'direct',
        participants: [
          { id: '1', name: 'Sarah Johnson', role: 'Project Manager', online: true, avatar: '/client-1.jpg' },
          { id: 'me', name: 'You', role: 'HVAC Contractor', online: true }
        ],
        unreadCount: 3,
        pinned: true,
        archived: false,
        muted: false,
        projectId: 'proj-123',
        avatar: '/client-1.jpg'
      },
      {
        id: '2',
        name: 'Hospital HVAC Project',
        type: 'project',
        participants: [
          { id: '2', name: 'Mike Chen', role: 'General Contractor', online: true, avatar: '/contractor.jpg' },
          { id: '3', name: 'Lisa Rodriguez', role: 'Architect', online: false, lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000) },
          { id: 'me', name: 'You', role: 'HVAC Contractor', online: true }
        ],
        unreadCount: 1,
        pinned: false,
        archived: false,
        muted: false,
        projectId: 'proj-456',
        avatar: '/hospital.jpg'
      },
      {
        id: '3',
        name: 'Corporate Properties LLC',
        type: 'direct',
        participants: [
          { id: '4', name: 'David Wilson', role: 'Facilities Manager', online: false, lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          { id: 'me', name: 'You', role: 'HVAC Contractor', online: true }
        ],
        unreadCount: 0,
        pinned: false,
        archived: false,
        muted: false,
        projectId: 'proj-789',
        avatar: '/contractor-2.jpg'
      },
      {
        id: '4',
        name: 'HVAC Contractors Network',
        type: 'group',
        participants: [
          { id: '5', name: 'John Smith', role: 'HVAC Contractor', online: true },
          { id: '6', name: 'Emma Davis', role: 'HVAC Contractor', online: false },
          { id: '7', name: 'Robert Brown', role: 'HVAC Contractor', online: true },
          { id: 'me', name: 'You', role: 'HVAC Contractor', online: true }
        ],
        unreadCount: 5,
        pinned: false,
        archived: false,
        muted: true,
        avatar: '/group-hvac.jpg'
      }
    ];

    const mockMessages: Message[] = [
      {
        id: '1',
        conversationId: '1',
        senderId: '1',
        senderName: 'Sarah Johnson',
        senderAvatar: '/client-1.jpg',
        content: 'Hi! I reviewed your HVAC proposal for the medical center. The technical specifications look great, but I have a few questions about the timeline.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        readBy: ['me'],
        reactions: [],
        attachments: [],
        type: 'text'
      },
      {
        id: '2',
        conversationId: '1',
        senderId: 'me',
        senderName: 'You',
        content: 'Thank you for reviewing it! I\'d be happy to discuss the timeline. What specific aspects would you like to clarify?',
        timestamp: new Date(Date.now() - 90 * 60 * 1000),
        readBy: ['1'],
        reactions: [{ emoji: '👍', users: ['1'], count: 1 }],
        attachments: [],
        type: 'text'
      },
      {
        id: '3',
        conversationId: '1',
        senderId: '1',
        senderName: 'Sarah Johnson',
        senderAvatar: '/client-1.jpg',
        content: 'Mainly the installation phase. We need to ensure minimal disruption to our operations. Can you provide a detailed schedule?',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        readBy: ['me'],
        reactions: [],
        attachments: [],
        type: 'text'
      },
      {
        id: '4',
        conversationId: '1',
        senderId: 'me',
        senderName: 'You',
        content: 'Absolutely! I\'ll prepare a detailed installation schedule with phased approach to minimize disruption. I can also work during off-hours if needed.',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        readBy: [],
        reactions: [],
        attachments: [
          {
            id: 'att-1',
            name: 'HVAC_Installation_Schedule.pdf',
            size: 2048000,
            type: 'application/pdf',
            url: '/documents/schedule.pdf'
          }
        ],
        type: 'text'
      },
      {
        id: '5',
        conversationId: '1',
        senderId: '1',
        senderName: 'Sarah Johnson',
        senderAvatar: '/client-1.jpg',
        content: 'Perfect! When can we schedule a call to discuss this in detail? I\'m available tomorrow afternoon or Friday morning.',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        readBy: [],
        reactions: [],
        attachments: [],
        type: 'text'
      }
    ];

    setConversations(mockConversations);
    setMessages(mockMessages);
    setSelectedConversation('1');
  }, []);

  const currentConversation = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = messages.filter(m => m.conversationId === selectedConversation);

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' ||
      (activeTab === 'unread' && conv.unreadCount > 0) ||
      (activeTab === 'pinned' && conv.pinned) ||
      (activeTab === 'archived' && conv.archived);
    return matchesSearch && matchesTab;
  });

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      conversationId: selectedConversation,
      senderId: 'me',
      senderName: 'You',
      content: newMessage,
      timestamp: new Date(),
      readBy: [],
      reactions: [],
      attachments: [],
      type: 'text',
      replyTo: replyingTo?.id
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setReplyingTo(null);

    // Update conversation last message
    setConversations(prev => prev.map(conv =>
      conv.id === selectedConversation
        ? { ...conv, lastMessage: message }
        : conv
    ));
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          if (existingReaction.users.includes('me')) {
            // Remove reaction
            return {
              ...msg,
              reactions: msg.reactions.map(r =>
                r.emoji === emoji
                  ? { ...r, users: r.users.filter(u => u !== 'me'), count: r.count - 1 }
                  : r
              ).filter(r => r.count > 0)
            };
          } else {
            // Add reaction
            return {
              ...msg,
              reactions: msg.reactions.map(r =>
                r.emoji === emoji
                  ? { ...r, users: [...r.users, 'me'], count: r.count + 1 }
                  : r
              )
            };
          }
        } else {
          // New reaction
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, users: ['me'], count: 1 }]
          };
        }
      }
      return msg;
    }));
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
    if (days === 1) return 'Yesterday';
    return timestamp.toLocaleDateString();
  };

  const getMessageStatus = (message: Message) => {
    if (message.senderId === 'me') {
      if (message.readBy.length > 0) {
        return <CheckCheck className="w-4 h-4 text-yellow-500" />;
      } else {
        return <Check className="w-4 h-4 text-gray-400" />;
      }
    }
    return null;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">Messages</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
              Communicate with clients, contractors, and project teams
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-semibold text-xs h-9">
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
            <Button variant="outline" className="h-9 w-9 p-0">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="text-lg font-bold">Conversations</CardTitle>
                  <Badge className="bg-accent/10 text-accent border-accent/20 font-medium text-[10px] uppercase tracking-wider">
                    {conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)} unread
                  </Badge>
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-white/5 p-1 rounded-xl h-auto">
                    <TabsTrigger value="all" className="rounded-lg font-semibold text-xs py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">All</TabsTrigger>
                    <TabsTrigger value="unread" className="rounded-lg font-semibold text-xs py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Unread</TabsTrigger>
                    <TabsTrigger value="pinned" className="rounded-lg font-semibold text-xs py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Pinned</TabsTrigger>
                    <TabsTrigger value="archived" className="rounded-lg font-semibold text-xs py-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Archived</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>

              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100%-200px)]">
                  <div className="space-y-1">
                    {filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedConversation === conversation.id ? 'bg-accent/10 border-r-2 border-accent' : ''
                          }`}
                        onClick={() => setSelectedConversation(conversation.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={conversation.avatar} />
                              <AvatarFallback>
                                {conversation.type === 'group' ? (
                                  <Users className="w-6 h-6" />
                                ) : (
                                  conversation.name.charAt(0)
                                )}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.participants.some(p => p.online && p.id !== 'me') && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold truncate text-gray-900 dark:text-white">{conversation.name}</h3>
                                {conversation.pinned && <Pin className="w-3.5 h-3.5 text-accent" />}
                                {conversation.muted && <AlertCircle className="w-3.5 h-3.5 text-gray-400" />}
                              </div>
                              <div className="flex items-center gap-1">
                                {conversation.lastMessage && (
                                  <span className="text-xs text-gray-500">
                                    {formatTimestamp(conversation.lastMessage.timestamp)}
                                  </span>
                                )}
                                {conversation.unreadCount > 0 && (
                                  <Badge className="bg-red-500 text-white text-xs">
                                    {conversation.unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-[10px] font-semibold text-gray-500 px-1.5 py-0">
                                {conversation.type === 'project' ? 'Project' :
                                  conversation.type === 'group' ? 'Group' : 'Direct'}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {conversation.participants.length} participants
                              </span>
                            </div>

                            {conversation.lastMessage && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                                {conversation.lastMessage.content}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            {selectedConversation && currentConversation ? (
              <Card className="h-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex flex-col">
                {/* Chat Header */}
                <CardHeader className="border-b border-border-light dark:border-border-dark">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={currentConversation.avatar} />
                        <AvatarFallback>
                          {currentConversation.type === 'group' ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            currentConversation.name.charAt(0)
                          )}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{currentConversation.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>
                            {currentConversation.participants.filter(p => p.online && p.id !== 'me').length} online
                          </span>
                          {typingUsers.length > 0 && (
                            <span className="text-accent font-medium">
                              {typingUsers.join(', ')} typing...
                            </span>
                          )}
                        </div>
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
                        <Search className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      {conversationMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          {message.senderId !== 'me' && (
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={message.senderAvatar} />
                              <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}

                          <div className={`max-w-[70%] ${message.senderId === 'me' ? 'order-first' : ''}`}>
                            {message.replyTo && (
                              <div className="text-xs text-gray-500 mb-1 p-2 bg-gray-100 dark:bg-gray-800 rounded border-l-2 border-gray-300">
                                Replying to previous message
                              </div>
                            )}

                            <div
                              className={`p-3 rounded-lg ${message.senderId === 'me'
                                ? 'bg-accent text-accent-foreground ml-auto'
                                : 'bg-gray-100 dark:bg-gray-800'
                                }`}
                            >
                              {message.senderId !== 'me' && (
                                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                  {message.senderName}
                                </p>
                              )}

                              <p className="text-sm">{message.content}</p>

                              {message.attachments.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.attachments.map((attachment) => (
                                    <div key={attachment.id} className="flex items-center gap-2 p-2 bg-white/10 rounded">
                                      <File className="w-4 h-4" />
                                      <span className="text-xs">{attachment.name}</span>
                                      <span className="text-xs text-gray-500">
                                        ({(attachment.size / 1024 / 1024).toFixed(1)} MB)
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs opacity-70">
                                  {formatTimestamp(message.timestamp)}
                                  {message.edited && ' (edited)'}
                                </span>
                                {getMessageStatus(message)}
                              </div>
                            </div>

                            {/* Reactions */}
                            {message.reactions.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {message.reactions.map((reaction) => (
                                  <button
                                    key={reaction.emoji}
                                    className={`text-xs px-2 py-1 rounded-full border ${reaction.users.includes('me')
                                      ? 'bg-accent/20 border-accent'
                                      : 'bg-gray-100 dark:bg-gray-800 border-gray-300'
                                      }`}
                                    onClick={() => addReaction(message.id, reaction.emoji)}
                                  >
                                    {reaction.emoji} {reaction.count}
                                  </button>
                                ))}
                                <button
                                  className="text-xs px-2 py-1 rounded-full border border-gray-300 hover:bg-gray-100"
                                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                >
                                  +
                                </button>
                              </div>
                            )}

                            {/* Quick reactions */}
                            <div className="flex gap-1 mt-1 opacity-0 hover:opacity-100 transition-opacity">
                              {['👍', '❤️', '😂', '😮', '😢', '😡'].map((emoji) => (
                                <button
                                  key={emoji}
                                  className="text-sm p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                  onClick={() => addReaction(message.id, emoji)}
                                >
                                  {emoji}
                                </button>
                              ))}
                              <button
                                className="text-xs p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                                onClick={() => setReplyingTo(message)}
                              >
                                <Reply className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {message.senderId === 'me' && (
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>You</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                {/* Message Input */}
                <div className="border-t border-border-light dark:border-border-dark p-4">
                  {replyingTo && (
                    <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                      <div className="flex items-center justify-between">
                        <span>Replying to {replyingTo.senderName}</span>
                        <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                          ×
                        </Button>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 truncate">{replyingTo.content}</p>
                    </div>
                  )}

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        className="min-h-[40px] max-h-[120px] resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Image className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="h-full bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-2">Select a conversation</h3>
                  <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMessages;
