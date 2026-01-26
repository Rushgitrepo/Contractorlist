import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  MessageSquare,
  ArrowLeft,
  SearchIcon,
  PlusCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const CleanCommunications = () => {
  const { toast } = useToast();
  const [activeChat, setActiveChat] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(520);
  const [isResizing, setIsResizing] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [messagesList, setMessagesList] = useState<any[]>([]);

  // Resize Handlers
  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (mouseMoveEvent: MouseEvent) => {
    if (isResizing) {
      // Calculate new width based on mouse position
      // Using clientX directly since sidebar is on the left
      const newWidth = mouseMoveEvent.clientX; // Simplified, in a real app might need offset adjustment if sidebar isn't at 0
      // Ideally we want relative to the container, but since this is a full page sidebar, clientX approximates it well enough if the main sidebar is fixed width. 
      // Actually, let's just use the movement to adjust. 
      // Better: newWidth = mouseMoveEvent.clientX - (sidebar offset). 
      // Given the page structure: Sidebar (global) -> Content. 
      // If the global sidebar is open, we need to account for it. 
      // Let's rely on standard resizing constraints: min 250, max 600.

      // Let's stick to a simpler logic: Clamp the width. 
      // Since the main sidebar might be 72px or 288px, active offset matters. 
      // To make it robust without complex ref calculations:
      // We will assume the user controls the size visually. 
      // BUT, since we have a global sidebar on the left `CleanCommunications` is inside a layout.
      // So `mouseMoveEvent.clientX` includes the global sidebar width.
      // We should probably rely on `movementX` or similar, but absolute position is safer. 
      // Let's try to maintain the existing width + delta, OR just set it based on visual feedback if we had a ref to the container.

      // For now, let's just set constraints.
      // We need to account for the global sidebar if it exists. 
      // However, simplified approach:
      // Just update width based on mouse X for now, clamped.
      // We'll trust the user sees what they are doing.

      // Actually, `CleanCommunications` is rendered potentially next to a `w-72` sidebar.
      // So real width ~= clientX - 288 (or 80).

      // Let's use a simpler approach: 
      // On drag, just update state.
      // Since we don't know the exact offset easily without refs, let's just use a ref for the sidebar to get initial rect.
    }
  };

  // Improved Resize Logic with useEffect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      // Get the container's left offset to subtract from clientX
      // Since we don't have a ref handy in this simplified view, we can approximate or just use movement.
      // Let's try to be precise:
      // The `w-full` container handles the layout.
      // Let's just assume standard offsets aren't huge issues if we allow flexible resizing.
      // But a better UX is: SidebarWidth = currentWidth + e.movementX
      setSidebarWidth((prevWidth) => {
        const newWidth = prevWidth + e.movementX;
        if (newWidth < 250) return 250;
        if (newWidth > 600) return 600;
        return newWidth;
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const chats = [
    {
      id: 1,
      name: 'VoltMaster Electric',
      type: 'Subcontractor',
      avatar: 'VM',
      image: 'https://images.unsplash.com/photo-1542384701-c0e46e4c7980?auto=format&fit=crop&q=80&w=150&h=150',
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
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
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
      image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=150&h=150',
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
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
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
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150',
      status: 'offline',
      lastMessage: 'We can start the installation next week.',
      time: '3 days ago',
      unread: 0,
      project: 'Skyline Heights'
    }
  ];

  const initialMessages = [
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

  useEffect(() => {
    setMessagesList(initialMessages);
  }, []);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: messagesList.length + 1,
      sender: 'me',
      content: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setMessagesList([...messagesList, newMessage]);
    setMessageInput('');

    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "Your message has been delivered.",
      });
    }, 500);
  };

  const activeContact = chats.find(c => c.id === activeChat);

  return (
    <>
      <div className="flex h-full w-full bg-gray-50 dark:bg-[#0f1115] overflow-hidden text-gray-900 dark:text-white font-sans transition-colors duration-300">
        <div className="flex w-full max-w-7xl mx-auto h-full relative z-10">
          {/* Background Ambience */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-yellow-400/5 dark:bg-yellow-600/5 blur-[150px] pointer-events-none" />

          {/* Conversations Sidebar */}
          <div
            className={`flex flex-col border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#14161b] shrink-0 sticky left-0 z-20 ${activeChat ? 'hidden md:flex' : 'flex'}`}
            style={{ width: `${sidebarWidth}px`, maxWidth: '100%' }}
          >
            <div className="p-4 border-b border-gray-200 dark:border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
                <Button
                  size="icon"
                  onClick={() => setIsNewChatModalOpen(true)}
                  className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-black h-8 w-8 rounded-full shadow-lg shadow-yellow-500/20"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-yellow-600 dark:group-focus-within:text-yellow-400" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9 h-10 bg-gray-100 dark:bg-[#1c1e24] border-gray-200 dark:border-white/5 text-sm text-gray-900 dark:text-gray-200 placeholder:text-gray-500 dark:placeholder:text-gray-600 focus:border-yellow-500/50 rounded-xl"
                />
              </div>
            </div>

            <ScrollArea className="flex-1 custom-scrollbar">
              <div className="p-2 space-y-1">
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat.id)}
                    className={`p-3 rounded-xl cursor-pointer transition-all duration-200 group ${activeChat === chat.id
                      ? 'bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 shadow-sm'
                      : 'hover:bg-gray-100 dark:hover:bg-white/5 border border-transparent'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative shrink-0">
                        <Avatar className="w-10 h-10 bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 group-hover:border-yellow-500/50 transition-colors">
                          <AvatarImage src={chat.image} className="object-cover" />
                          <AvatarFallback className="text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gradient-to-br dark:from-gray-700 dark:to-gray-800">{chat.avatar}</AvatarFallback>
                        </Avatar>
                        {chat.status === 'online' && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#14161b] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className={`font-semibold text-sm truncate transition-colors ${activeChat === chat.id ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-900 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white'}`}>
                            {chat.name}
                          </p>
                          <span className="text-[10px] text-gray-500 shrink-0 ml-2">{chat.time}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400">
                            {chat.type}
                          </Badge>
                          {chat.unread > 0 && (
                            <Badge className="bg-yellow-400 dark:bg-yellow-500 text-black text-[10px] px-1.5 py-0 h-4 min-w-[16px] flex items-center justify-center font-bold">
                              {chat.unread}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate mb-1 group-hover:text-gray-700 dark:group-hover:text-gray-400">
                          {chat.lastMessage}
                        </p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-600 truncate flex items-center gap-1">
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

          {/* Resizer Handle */}
          <div
            className="w-1 cursor-col-resize hover:bg-yellow-400 active:bg-yellow-500 bg-transparent transition-colors z-30 hidden md:block"
            onMouseDown={startResizing}
          />

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col bg-gray-50 dark:bg-[#0f1115] min-w-0 relative ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
            {activeContact ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-white/5 bg-white/50 dark:bg-[#14161b]/50 backdrop-blur-md shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <Button variant="ghost" size="icon" className="md:hidden text-gray-500 dark:text-gray-400" onClick={() => setActiveChat(null)}>
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <Avatar className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600 text-black font-bold border border-yellow-500/20 shrink-0 shadow-lg shadow-yellow-500/10">
                      <AvatarImage src={activeContact.image} className="object-cover" />
                      <AvatarFallback>{activeContact.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-bold text-gray-900 dark:text-white truncate">{activeContact.name}</h2>
                        {activeContact.status === 'online' && (
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full shrink-0 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{activeContact.type} • {activeContact.project}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5">
                      <Video className="w-4 h-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                        <DropdownMenuItem className="focus:bg-gray-100 dark:focus:bg-white/5 cursor-pointer">View Profile</DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-gray-100 dark:focus:bg-white/5 cursor-pointer">Project Details</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 dark:text-red-400 focus:bg-red-50 dark:focus:bg-white/5 cursor-pointer">Archive Conversation</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 custom-scrollbar">
                  <div className="p-6 space-y-6">
                    {messagesList.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[85%] md:max-w-[70%] ${message.sender === 'me' ? 'ml-auto' : 'mr-auto'}`}>
                          <div
                            className={`rounded-2xl p-4 shadow-sm backdrop-blur-sm ${message.sender === 'me'
                              ? 'bg-yellow-400 dark:bg-yellow-500 text-black rounded-tr-sm'
                              : 'bg-white dark:bg-[#1c1e24] border border-gray-200 dark:border-white/5 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                              }`}
                          >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            {message.attachment && (
                              <div className={`mt-3 p-3 rounded-lg flex items-center gap-3 border ${message.sender === 'me'
                                ? 'bg-black/10 border-black/5'
                                : 'bg-gray-50 dark:bg-black/30 border-gray-100 dark:border-white/5'
                                }`}>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${message.sender === 'me'
                                  ? 'bg-black/10 text-black'
                                  : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500'
                                  }`}>
                                  <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-xs font-bold truncate ${message.sender === 'me' ? 'text-black' : 'text-gray-900 dark:text-white'}`}>{message.attachment.name}</p>
                                  <p className={`text-[10px] ${message.sender === 'me' ? 'text-black/60' : 'text-gray-500'}`}>{message.attachment.size}</p>
                                </div>
                              </div>
                            )}
                            <div className={`flex items-center justify-end gap-1.5 mt-2 text-[10px] ${message.sender === 'me' ? 'text-black/60' : 'text-gray-400 dark:text-gray-500'}`}>
                              <span>{message.time}</span>
                              {message.sender === 'me' && (
                                <CheckCheck className="w-3 h-3" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-white dark:bg-[#14161b] shrink-0">
                  <div className="flex items-end gap-2 max-w-4xl mx-auto">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-black dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5">
                      <Paperclip className="w-5 h-5" />
                    </Button>
                    <div className="flex-1 bg-gray-100 dark:bg-[#1c1e24] rounded-xl border border-gray-200 dark:border-white/5 focus-within:border-yellow-500/50 transition-colors p-1">
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        className="border-none bg-transparent min-h-[44px] focus-visible:ring-0 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && messageInput.trim()) {
                            handleSendMessage();
                          }
                        }}
                      />
                    </div>
                    <Button
                      size="icon"
                      className={`h-11 w-11 rounded-xl shadow-lg transition-all duration-200 ${messageInput.trim()
                        ? 'bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-black shadow-yellow-500/20'
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-[#1c1e24] text-gray-400 dark:text-gray-500 dark:hover:bg-white/5'
                        }`}
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                  <div className="w-24 h-24 rounded-3xl bg-yellow-100 dark:bg-gradient-to-br dark:from-yellow-500/10 dark:to-yellow-600/5 flex items-center justify-center mx-auto mb-6 border border-yellow-200 dark:border-yellow-500/20 shadow-sm dark:shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                    <MessageSquare className="w-10 h-10 text-yellow-600 dark:text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Choose a conversation from the sidebar to start messaging with your team members, clients, or subcontractors.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Dialog open={isNewChatModalOpen} onOpenChange={setIsNewChatModalOpen}>
        <DialogContent className="bg-white dark:bg-[#1c1e24] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
            <DialogDescription>
              Start a conversation with a subcontractor, architect, or client.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>To</Label>
              <Input placeholder="Search people or projects..." className="bg-gray-100 dark:bg-black/20" />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <textarea
                className="w-full h-32 p-3 rounded-xl bg-gray-100 dark:bg-black/20 border-none focus:ring-1 focus:ring-yellow-500 text-sm resize-none"
                placeholder="Write your message here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsNewChatModalOpen(false)}>Cancel</Button>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black" onClick={() => {
              toast({ title: "Conversation Started", description: "Your message has been initiated." });
              setIsNewChatModalOpen(false);
            }}>
              Start Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CleanCommunications;
