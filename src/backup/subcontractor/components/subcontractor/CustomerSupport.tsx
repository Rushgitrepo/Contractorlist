import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  MessageCircle,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  BookOpen,
  Headphones,
  ArrowRight,
  LifeBuoy,
  Send,
  HelpCircle
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

const CustomerSupport = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      toast({
        title: "Missing Info",
        description: "Please provide a subject and message.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast({
      title: "Support Request Sent",
      description: "A member of our team will review your request and get back to you shortly.",
    });
    setFormData({ subject: '', message: '' });
  };

  const quickActions = [
    {
      name: 'Direct Call',
      description: 'Call us at +1 (281) 623-6289',
      icon: Phone,
      color: 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white',
    },
    {
      name: 'Email Support',
      description: 'support@phoenixestimating.com',
      icon: Mail,
      color: 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white',
    },
    {
      name: 'Documentation',
      description: 'Browse our help articles',
      icon: BookOpen,
      color: 'bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white',
    }
  ];

  return (
    <div className="p-6 md:p-8 bg-gray-50 dark:bg-[#0f1115] min-h-screen text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Simple Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Customer Support</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
            Get help with your account, find answers to common questions, or contact our support team. We're here to help you succeed.
          </p>
        </div>

        {/* Quick Contact Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Card key={index} className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardContent className="p-5">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4", action.color)}>
                  <action.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{action.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ticket Form */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Submit a Request</CardTitle>
                <CardDescription>Our team typically responds within 2 hours during business hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Subject</label>
                    <Input
                      placeholder="What do you need help with?"
                      className="border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea
                      placeholder="Describe your issue in detail..."
                      className="min-h-[150px] border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20 resize-none"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  <Button
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-accent" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Monday - Friday</span>
                  <span className="font-medium text-gray-900 dark:text-white">8:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Saturday</span>
                  <span className="font-medium text-gray-900 dark:text-white">9:00 AM - 2:00 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Sunday</span>
                  <span className="font-medium text-gray-900 dark:text-white">Closed</span>
                </div>
                <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-green-500">Specialists currently online</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-white/5 bg-white dark:bg-[#1c1e24] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-accent" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Dashboard</span>
                  <Badge variant="outline" className="border-green-500/20 text-green-500 bg-green-500/5">Operational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Bid System</span>
                  <Badge variant="outline" className="border-green-500/20 text-green-500 bg-green-500/5">Operational</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
