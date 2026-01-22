import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Search,
  Plus,
  MoreVertical,
  Phone,
  Video,
  Paperclip,
  Send,
  CheckCheck,
  FileText,
  Building2,
  MessageSquare
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const CleanCommunications = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const chats = [
    {
      id: 1,
      name: 'VoltMaster Electric',
      type: 'Subcontractor',
      avatar: 'VM',
      status: 'online',
      lastMessage: 'The revised wiring layout for the 2nd floor has been uploaded.',
      time: '12:42 PM',
      unread: 2,
      project: 'Downtown Office Renovation'
    },
    {
      id: 2,
      name: 'Sarah Chen',
      type: 'Architect',
      avatar: 'SC',
      status: 'offline',
      lastMessage: 'Can we schedule a walkthrough for next Tuesday?',
      time: '10:15 AM',
      unread: 0,
      project: 'Medical Center Expansion'
    },
    {
      id: 3,
      name: 'Titan Concrete Pros',
      type: 'Subcontractor',
      avatar: 'TC',
      status: 'online',
      lastMessage: 'Pouring schedule updated due to weather forecast.',
      time: 'Yesterday',
      unread: 0,
      project: 'Riverside Apartments'
    },
    {
      id: 4,
      name: 'Metro Properties',
      type: 'Client',
      avatar: 'MP',
      status: 'online',
      lastMessage: 'Approved the change order for additional electrical work.',
      time: '2 hours ago',
      unread: 1,
      project: 'Downtown Office Renovation'
    },
    {
      id: 5,
      name: 'Austin Electrical Co',
      type: 'Subcontractor',
      avatar: 'AE',
      status: 'offline',
      lastMessage: 'We can start the installation next week.',
      time: '3 days ago',
      unread: 0,
      project: 'Skyline Heights'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'them',
      content: 'Hey, just wanted to check on the status of the electrical rough-in for the Downtown Commercial project.',
      time: '12:30 PM',
      status: 'read'
    },
    {
      id: 2,
      sender: 'me',
      content: 'We are on track. The crew is finishing up the conduit work on the 2nd floor today.',
      time: '12:35 PM',
      status: 'read'
    },
    {
      id: 3,
      sender: 'them',
      content: 'Great. Also, did you see the RFI response regarding the panel location?',
      time: '12:38 PM',
      status: 'read'
    },
    {
      id: 4,
      sender: 'them',
      content: 'The revised wiring layout for the 2nd floor has been uploaded.',
      time: '12:42 PM',
      status: 'read',
      attachment: { type: 'file', name: '2nd_Floor_Electrical_Rev2.pdf', size: '2.4 MB' }
    },
    {
      id: 5,
      sender: 'me',
      content: 'Perfect, I\'ll review it and get back to you by end of day.',
      time: '12:45 PM',
      status: 'read'
    }
  ];

  const activeContact = chats.find(c => c.id === activeChat);

  return (
    <div className="flex h-full w-full bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div className="flex w-full max-w-7xl mx-auto h-full">
        {/* Conversations Sidebar */}
        <div className="w-[320px] flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shrink-0">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
              <Button size="sm" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 h-8 w-8 p-0">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-9 h-9 text-sm border-gray-200 dark:border-gray-800"
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    activeChat === chat.id
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <Avatar className="w-10 h-10 bg-yellow-400 dark:bg-yellow-500 text-gray-900">
                        <AvatarFallback className="text-sm font-semibold">{chat.avatar}</AvatarFallback>
                      </Avatar>
                      {chat.status === 'online' && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm text-gray-900 dark:text-white truncate">
                          {chat.name}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 ml-2">{chat.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                          {chat.type}
                        </Badge>
                        {chat.unread > 0 && (
                          <Badge className="bg-yellow-400 text-gray-900 text-xs px-1.5 py-0 h-5 min-w-[20px] flex items-center justify-center">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate mb-1">
                        {chat.lastMessage}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 truncate flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {chat.project}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-950 min-w-0">
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="w-10 h-10 bg-yellow-400 dark:bg-yellow-500 text-gray-900 shrink-0">
                      <AvatarFallback className="text-sm font-semibold">{activeContact.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-900 dark:text-white truncate">{activeContact.name}</h2>
                        {activeContact.status === 'online' && (
                          <div className="w-2 h-2 bg-green-500 rounded-full shrink-0"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{activeContact.type} • {activeContact.project}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Video className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Project Details</DropdownMenuItem>
                        <DropdownMenuItem>Archive Conversation</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1">
                <div className="p-6 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] ${message.sender === 'me' ? 'ml-auto' : 'mr-auto'}`}>
                        <div
                          className={`rounded-lg p-4 shadow-sm ${
                            message.sender === 'me'
                              ? 'bg-yellow-400 dark:bg-yellow-500 text-gray-900'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          {message.attachment && (
                            <div className="mt-3 p-3 bg-white/70 dark:bg-gray-900/50 rounded-lg flex items-center gap-3 border border-gray-200 dark:border-gray-700">
                              <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                                <FileText className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{message.attachment.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{message.attachment.size}</p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-end gap-1.5 mt-2">
                            <span className="text-xs text-gray-600 dark:text-gray-400">{message.time}</span>
                            {message.sender === 'me' && (
                              <CheckCheck className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shrink-0">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="sm" className="h-9 w-9 p-0 shrink-0">
                    <Paperclip className="w-4 h-4" />
                  </Button>
                  <div className="flex-1">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="border-gray-200 dark:border-gray-800 min-h-[40px]"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && messageInput.trim()) {
                          setMessageInput('');
                        }
                      }}
                    />
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 h-9 px-4 shrink-0"
                    onClick={() => {
                      if (messageInput.trim()) {
                        setMessageInput('');
                      }
                    }}
                    disabled={!messageInput.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center max-w-md px-6">
                <div className="w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a conversation from the sidebar to start messaging with your team members, clients, or subcontractors.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CleanCommunications;
