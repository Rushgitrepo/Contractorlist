import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Search,
  Send,
  Paperclip,
  Image,
  Phone,
  Video,
  MoreVertical,
  Star,
  CheckCircle,
  Clock,
  Bot,
  Info
} from 'lucide-react';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState('buildright');
  const [messageText, setMessageText] = useState('');

  const conversations = [
    {
      id: 'buildright',
      contractor: 'BuildRight Construction',
      project: 'Kitchen Remodel',
      lastMessage: "I've attached the revised quote for the cabinets.",
      timestamp: '10:42 AM',
      unread: true,
      online: true,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5ewjeJgrApF0MXKRhkWKXoN6gY4ByOJdVY_MhP784tLQca2Cjdu_PxUZiSC_XzNR4wACdhOqdWCymqCR9wtsj0ZOugtrBD9qXKjp3PQtcrlmIJGGEFS1isIwsjtQN7SHqeQxIt7y-UgFvHZ-4_b1tjL-pMHvNBQGvm50q0nHVLmKiDu1wYr1slZeYtvvmE16_IVUtHNFn5rRt91bx7I-CQG6RzniGxmpKyv2tMyHM7ejsqYYfB4tqAaZWtDKjvRYymgFQWhaLxEZo'
    },
    {
      id: 'elite-roofers',
      contractor: 'Elite Roofers',
      project: 'Roof Repair',
      lastMessage: 'New Bid Received: $4,500',
      timestamp: 'Yesterday',
      unread: true,
      online: false,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIwC7KAbe9ClzamGqfbWwaOmsRGC-XkI0lxYeHzOxNerZRXQvXZFefaovO2XGXAoT2PMvqXvmMaZqDvrXxB6q4xk7luD9SxJ3xpQ1-XS--9p3KSeX-PXeJHmH0z87_hO-0FphleTDGXMwoRSMTXfQyLydpW2UhwQx8K22jG92Q9F3KRt2yXChAMFgtzcWnNk0zCVzeRqVyyMayjIKV43UN6vWNiGYfynC_lNhldBhmgmIw_p_kFVU_Dvhc1_obQ-hLCEZ0GSh--vGN'
    },
    {
      id: 'support',
      contractor: 'Platform Support',
      project: 'Ticket #9021',
      lastMessage: 'How can we help you with your account?',
      timestamp: 'Tue',
      unread: false,
      online: true,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmwXkSGehdf0zASGL4dxga6hVmIG9pzYI7DbeFwcjU_ukxS9lLI5k7aVBy-Mpc5quREWXmvms23EpuXw8UzHXSyfiUrn2PIxiqtkKP__jQTu1Ypk3SdyTlfiwAYanDgu5nOtxFnj5CHxzPBxIRGR99L5Su4UWVW7gvx3WPZ9WtRTXkcQ7X1bRjPklsS1RnxFMDXSM8_dSnjJypsCPQWTcwGpNMYAt_bUWA_-gOHucsOHXzFY8sbJpoWuza2NI1tzkz1fUU-gRbns5b'
    },
    {
      id: 'thompson',
      contractor: 'Thompson Electric',
      project: 'Garage Wiring',
      lastMessage: 'Thanks for the opportunity. We will...',
      timestamp: 'Oct 24',
      unread: false,
      online: false,
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCsTx2roOmmxOWxOH3KbpLU9mpLZccVRZOYENEjFys_ZmSXdUHQfpw2P6Tq_5d9zL6ttoR6AvtQVdUFshTH5asQCu8IDyA_0uiuA3TwfggLGb87NWEpZgvPA6DRuwojQ3bRtGwf6IJbGhiC6gS8QNp70L70jytB58oT3--5nISbHO1jBjXqQ57AdUy_o1kwMoT--ejJOYEYzQmQbchq_IC4ecraRSx84jYuU7sFjAu4hSAEevUdHltnnFXV1Y7gsN4pX_-ujRiW5O3r'
    }
  ];

  const messages = [
    {
      id: 1,
      sender: 'contractor',
      content: "Hi John, thanks for inviting us to bid on your Kitchen Remodel. I see you uploaded the floor plan. Do you have a specific timeline for when you want this started?",
      timestamp: '4:30 PM',
      date: 'Yesterday'
    },
    {
      id: 2,
      sender: 'user',
      content: "Ideally, we'd like to start next month. We have the permits in progress.",
      timestamp: '4:45 PM',
      date: 'Yesterday'
    },
    {
      id: 3,
      sender: 'system',
      content: 'New Bid Received - BuildRight updated their estimate',
      timestamp: 'Today',
      date: 'Today',
      type: 'bid'
    },
    {
      id: 4,
      sender: 'contractor',
      content: "Great. I've attached the revised quote including the cabinet changes we discussed. Let me know if the price works for you.",
      timestamp: '10:42 AM',
      date: 'Today',
      attachment: {
        name: 'Revised_Quote_v2.pdf',
        size: '2.4 MB'
      }
    }
  ];

  const selectedConversationData = conversations.find(c => c.id === selectedConversation) || conversations[0];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Handle sending message
      setMessageText('');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Messages
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
            Manage communications for your active projects
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Conversation List */}
        <div className="lg:col-span-4 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="border-b border-border-light dark:border-border-dark">
              <div className="space-y-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-10"
                  />
                </div>
                
                {/* Filter Chips */}
                <div className="flex gap-2 overflow-x-auto">
                  <Button size="sm" className="bg-primary text-white">
                    All
                  </Button>
                  <Button size="sm" variant="outline">
                    Unread
                  </Button>
                  <Button size="sm" variant="outline">
                    Contractors
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-0">
              <div className="space-y-0">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`flex gap-3 p-4 cursor-pointer transition-colors border-l-4 ${
                      selectedConversation === conversation.id
                        ? 'border-primary bg-primary/5 hover:bg-primary/10'
                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="relative">
                      <div 
                        className="size-12 rounded-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${conversation.avatar})` }}
                      />
                      {conversation.online && (
                        <span className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-surface-dark rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-sm font-semibold text-text-primary-light dark:text-white truncate">
                          {conversation.contractor}
                        </h3>
                        <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark whitespace-nowrap">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-primary font-medium mb-1">
                        {conversation.project}
                      </p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unread && (
                      <div className="flex items-center">
                        <div className="size-2 bg-primary rounded-full" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-8 flex flex-col">
          <Card className="flex-1 flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b border-border-light dark:border-border-dark">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="size-10 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${selectedConversationData.avatar})` }}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-text-primary-light dark:text-white">
                        {selectedConversationData.contractor}
                      </h2>
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark flex items-center gap-1">
                      <span className={`size-2 rounded-full ${selectedConversationData.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {selectedConversationData.online ? 'Online' : 'Offline'} • Responds in ~1 hr
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Info className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Date Separator */}
              <div className="flex justify-center">
                <Badge variant="secondary" className="text-xs">
                  Yesterday
                </Badge>
              </div>

              {messages.map((message) => (
                <div key={message.id}>
                  {message.type === 'bid' ? (
                    /* System Message */
                    <div className="flex justify-center">
                      <Card className="max-w-md bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark">
                        <CardContent className="p-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
                              <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-sm font-bold text-text-primary-light dark:text-white">
                                New Bid Received
                              </span>
                              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                BuildRight updated their estimate
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            View Bid
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    /* Regular Message */
                    <div className={`flex gap-4 ${message.sender === 'user' ? 'flex-row-reverse' : ''} max-w-[80%] ${message.sender === 'user' ? 'ml-auto' : ''}`}>
                      <div 
                        className="size-8 rounded-full bg-cover bg-center flex-shrink-0 mt-1"
                        style={{ 
                          backgroundImage: message.sender === 'user' 
                            ? "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAD5kg1NqvcOFiOB0ixgCUlKVSvweCK-IzDyN9sI6aS7nTQAHUd76_2mRZ1pl1jsl_Xa7rzr7TbiCJ5pP78yK2BsGs52cBXXxqRkNBIYzgQzIFeD6SLOu6kfaa4XfnFt9rLm0ty5ZFfcKtZVGNJk1vn-jMhpsi4HM7szMcC35ruCLxiJW2yPmu_UqK-kQwNjEV7Iy-MjrFCtADGeaeNePJ8h0ht0scgM4gVUu04lTAEqxjkAkNQ5B39ZmcDheclaiDUXGiP7HjRbS4n')"
                            : `url(${selectedConversationData.avatar})`
                        }}
                      />
                      <div className={`flex flex-col gap-1 ${message.sender === 'user' ? 'items-end' : ''}`}>
                        <div className={`flex items-baseline gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm font-semibold text-text-primary-light dark:text-white">
                            {message.sender === 'user' ? 'You' : selectedConversationData.contractor}
                          </span>
                          <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                            {message.timestamp}
                          </span>
                        </div>
                        <div className={`p-3 rounded-2xl shadow-sm text-sm leading-relaxed max-w-[90%] ${
                          message.sender === 'user'
                            ? 'bg-primary text-white rounded-tr-none'
                            : 'bg-white dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark border border-border-light dark:border-border-dark rounded-tl-none'
                        }`}>
                          {message.content}
                        </div>
                        
                        {/* Attachment */}
                        {message.attachment && (
                          <div className="flex items-center gap-3 mt-1 p-2 bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded text-red-600 dark:text-red-400">
                              <Paperclip className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-text-primary-light dark:text-white">
                                {message.attachment.name}
                              </span>
                              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">
                                {message.attachment.size}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>

            {/* Input Area */}
            <div className="p-4 border-t border-border-light dark:border-border-dark">
              {/* AI Suggestion */}
              <div className="mb-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-xs bg-blue-50 dark:bg-blue-900/20 text-primary border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40"
                >
                  <Bot className="w-3 h-3 mr-1" />
                  Suggest reply: "Does this include permits?"
                </Button>
              </div>
              
              <div className="flex flex-col gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-2 focus-within:ring-2 ring-primary transition-shadow">
                <Textarea
                  placeholder={`Type your message to ${selectedConversationData.contractor}...`}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="border-none bg-transparent focus:ring-0 resize-none min-h-[48px]"
                  rows={2}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Image className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-primary">
                      <Bot className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-primary hover:bg-blue-600 text-white"
                    disabled={!messageText.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
              <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark text-center mt-2">
                Do not share sensitive payment info outside of ContractorsList.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Messages;