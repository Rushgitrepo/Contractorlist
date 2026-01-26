import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ShoppingCart,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  Download,
  Filter,
  Search,
  Calendar,
  DollarSign,
  Package
} from 'lucide-react';

const OrdersRFQs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const orders = [
    {
      id: 'ORD-001',
      contractor: 'Turner Construction',
      contactPerson: 'John Smith',
      email: 'john@turner.com',
      phone: '(555) 123-4567',
      items: [
        { name: 'Portland Cement Type I', quantity: 500, unit: 'bags', price: 25.00 },
        { name: 'Rebar #4 - 20ft', quantity: 100, unit: 'pieces', price: 42.00 }
      ],
      totalValue: 16700,
      status: 'pending',
      priority: 'high',
      orderDate: '2024-01-05',
      deliveryDate: '2024-01-10',
      notes: 'Urgent delivery required for downtown project'
    },
    {
      id: 'ORD-002',
      contractor: 'ABC Construction',
      contactPerson: 'Sarah Johnson',
      email: 'sarah@abc.com',
      phone: '(555) 987-6543',
      items: [
        { name: 'Ready Mix Concrete 3000 PSI', quantity: 15, unit: 'cubic yards', price: 125.00 }
      ],
      totalValue: 1875,
      status: 'confirmed',
      priority: 'medium',
      orderDate: '2024-01-04',
      deliveryDate: '2024-01-08',
      notes: 'Standard delivery schedule'
    },
    {
      id: 'ORD-003',
      contractor: 'Metro Builders',
      contactPerson: 'Mike Davis',
      email: 'mike@metro.com',
      phone: '(555) 456-7890',
      items: [
        { name: '2x4x8 Pressure Treated Lumber', quantity: 200, unit: 'pieces', price: 8.50 }
      ],
      totalValue: 1700,
      status: 'delivered',
      priority: 'low',
      orderDate: '2024-01-02',
      deliveryDate: '2024-01-05',
      notes: 'Completed successfully'
    }
  ];

  const rfqs = [
    {
      id: 'RFQ-001',
      contractor: 'Skyline Construction',
      contactPerson: 'Lisa Chen',
      email: 'lisa@skyline.com',
      phone: '(555) 234-5678',
      items: [
        { name: 'Steel Beams 8" I-Beam', quantity: 50, unit: 'pieces', estimatedPrice: 150.00 },
        { name: 'Welding Rods E7018', quantity: 100, unit: 'lbs', estimatedPrice: 3.50 }
      ],
      estimatedValue: 7850,
      status: 'pending-quote',
      priority: 'high',
      requestDate: '2024-01-05',
      responseDeadline: '2024-01-07',
      projectName: 'Downtown Office Complex',
      notes: 'Need competitive pricing for large commercial project'
    },
    {
      id: 'RFQ-002',
      contractor: 'Green Valley Homes',
      contactPerson: 'Tom Wilson',
      email: 'tom@greenvalley.com',
      phone: '(555) 345-6789',
      items: [
        { name: 'Insulation R-30', quantity: 2000, unit: 'sq ft', estimatedPrice: 1.25 }
      ],
      estimatedValue: 2500,
      status: 'quoted',
      priority: 'medium',
      requestDate: '2024-01-03',
      responseDeadline: '2024-01-06',
      projectName: 'Residential Development Phase 2',
      notes: 'Bulk order for multiple homes'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending-quote': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'quoted': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

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
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'pending-quote': return <FileText className="w-4 h-4" />;
      case 'quoted': return <Send className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Orders & RFQs
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Manage your orders and respond to quote requests
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Active RFQs</p>
                <p className="text-2xl font-bold text-orange-600">
                  {rfqs.filter(r => r.status === 'pending-quote').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">This Month</p>
                <p className="text-2xl font-bold text-green-600">$156K</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Delivered</p>
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="rfqs">RFQs ({rfqs.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark w-4 h-4" />
              <Input
                placeholder="Search orders by ID or contractor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{order.id}</h3>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark">
                          {order.contractor}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                        <Badge className={getPriorityColor(order.priority)}>
                          {order.priority} priority
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        ${order.totalValue.toLocaleString()}
                      </p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Total Value
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Contact</p>
                      <p className="font-semibold">{order.contactPerson}</p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{order.email}</p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Order Date</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {order.orderDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Delivery Date</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {order.deliveryDate}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Items</p>
                      <p className="font-semibold flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {order.items.length} products
                      </p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{item.name}</span>
                          <span className="text-sm font-medium">
                            {item.quantity} {item.unit} × ${item.price} = ${(item.quantity * item.price).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark mb-1">Notes</p>
                      <p className="text-sm bg-blue-50 dark:bg-blue-900/20 p-2 rounded">{order.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - {order.id}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Contractor Information</h4>
                              <p><strong>Company:</strong> {order.contractor}</p>
                              <p><strong>Contact:</strong> {order.contactPerson}</p>
                              <p><strong>Email:</strong> {order.email}</p>
                              <p><strong>Phone:</strong> {order.phone}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Order Information</h4>
                              <p><strong>Order Date:</strong> {order.orderDate}</p>
                              <p><strong>Delivery Date:</strong> {order.deliveryDate}</p>
                              <p><strong>Status:</strong> {order.status}</p>
                              <p><strong>Priority:</strong> {order.priority}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Items</h4>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                                  <span>{item.name}</span>
                                  <span>{item.quantity} {item.unit} × ${item.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    {order.status === 'pending' && (
                      <Button size="sm" className="bg-primary hover:bg-yellow-400 text-black">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Confirm Order
                      </Button>
                    )}
                    
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rfqs" className="space-y-4">
          {/* RFQs List */}
          <div className="space-y-4">
            {rfqs.map((rfq) => (
              <Card key={rfq.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{rfq.id}</h3>
                        <p className="text-text-secondary-light dark:text-text-secondary-dark">
                          {rfq.contractor}
                        </p>
                        <p className="text-sm font-medium text-blue-600">{rfq.projectName}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(rfq.status)}>
                          {getStatusIcon(rfq.status)}
                          <span className="ml-1 capitalize">{rfq.status.replace('-', ' ')}</span>
                        </Badge>
                        <Badge className={getPriorityColor(rfq.priority)}>
                          {rfq.priority} priority
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">
                        ${rfq.estimatedValue.toLocaleString()}
                      </p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Estimated Value
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Contact</p>
                      <p className="font-semibold">{rfq.contactPerson}</p>
                      <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{rfq.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Request Date</p>
                      <p className="font-semibold">{rfq.requestDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Response Deadline</p>
                      <p className="font-semibold text-red-600">{rfq.responseDeadline}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">Items</p>
                      <p className="font-semibold">{rfq.items.length} products</p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold mb-2">Requested Items</h4>
                    <div className="space-y-2">
                      {rfq.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{item.name}</span>
                          <span className="text-sm">
                            {item.quantity} {item.unit} (Est. ${item.estimatedPrice}/{item.unit})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {rfq.status === 'pending-quote' && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="bg-primary hover:bg-yellow-400 text-black">
                            <Send className="w-4 h-4 mr-2" />
                            Submit Quote
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Submit Quote - {rfq.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Quote Items</h4>
                              {rfq.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-4 gap-4 items-center p-2 border rounded">
                                  <span className="text-sm">{item.name}</span>
                                  <span className="text-sm">{item.quantity} {item.unit}</span>
                                  <Input placeholder="Your price" className="text-sm" />
                                  <span className="text-sm font-medium">Total: $0</span>
                                </div>
                              ))}
                            </div>
                            <div>
                              <label className="text-sm font-medium">Additional Notes</label>
                              <Textarea placeholder="Add any additional information about your quote..." />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline">Save Draft</Button>
                              <Button className="bg-primary hover:bg-yellow-400 text-black">
                                Submit Quote
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrdersRFQs;