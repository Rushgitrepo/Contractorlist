import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'concrete', label: 'Concrete & Cement' },
    { value: 'steel', label: 'Steel & Rebar' },
    { value: 'lumber', label: 'Lumber & Wood' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'plumbing', label: 'Plumbing' },
    { value: 'tools', label: 'Tools & Equipment' }
  ];

  const products = [
    {
      id: 'PRD-001',
      name: 'Portland Cement Type I',
      category: 'concrete',
      sku: 'PC-T1-50',
      price: 25.00,
      unit: 'bag',
      stock: 450,
      minStock: 200,
      status: 'in-stock',
      image: '/placeholder-product.jpg',
      description: '50lb bag of Portland Cement Type I',
      supplier: 'Lafarge',
      lastOrdered: '2024-01-03',
      monthlyDemand: 120,
      trend: 'up'
    },
    {
      id: 'PRD-002',
      name: 'Rebar #4 - 20ft',
      category: 'steel',
      sku: 'RB-4-20',
      price: 42.00,
      unit: 'piece',
      stock: 45,
      minStock: 100,
      status: 'low-stock',
      image: '/placeholder-product.jpg',
      description: '#4 Grade 60 Rebar, 20 feet length',
      supplier: 'Steel Dynamics',
      lastOrdered: '2024-01-02',
      monthlyDemand: 85,
      trend: 'up'
    },
    {
      id: 'PRD-003',
      name: 'Ready Mix Concrete 3000 PSI',
      category: 'concrete',
      sku: 'RMC-3000',
      price: 125.00,
      unit: 'cubic yard',
      stock: 0,
      minStock: 50,
      status: 'out-of-stock',
      image: '/placeholder-product.jpg',
      description: '3000 PSI Ready Mix Concrete',
      supplier: 'Local Concrete Co',
      lastOrdered: '2024-01-01',
      monthlyDemand: 45,
      trend: 'down'
    },
    {
      id: 'PRD-004',
      name: '2x4x8 Pressure Treated Lumber',
      category: 'lumber',
      sku: 'PT-2X4X8',
      price: 8.50,
      unit: 'piece',
      stock: 1200,
      minStock: 500,
      status: 'in-stock',
      image: '/placeholder-product.jpg',
      description: 'Pressure treated lumber 2"x4"x8"',
      supplier: 'Georgia Pacific',
      lastOrdered: '2024-01-04',
      monthlyDemand: 200,
      trend: 'stable'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'out-of-stock': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <div className="w-4 h-4" />;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const lowStockProducts = products.filter(p => p.stock < p.minStock);
  const outOfStockProducts = products.filter(p => p.stock === 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary-light dark:text-text-primary-dark">
            Product Catalog
          </h1>
          <p className="text-text-secondary-light dark:text-text-secondary-dark">
            Manage your inventory and product listings
          </p>
        </div>
        <Button className="bg-primary hover:bg-yellow-400 text-black">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total Products</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <Package className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockProducts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total Value</p>
                <p className="text-2xl font-bold text-green-600">$2.4M</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all-products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all-products">All Products</TabsTrigger>
          <TabsTrigger value="low-stock">Low Stock ({lowStockProducts.length})</TabsTrigger>
          <TabsTrigger value="out-of-stock">Out of Stock ({outOfStockProducts.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all-products" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark w-4 h-4" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-400" />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(product.status)}>
                        {product.status.replace('-', ' ')}
                      </Badge>
                      {getTrendIcon(product.trend)}
                    </div>

                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">SKU:</span>
                        <span>{product.sku}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">Price:</span>
                        <span className="font-semibold">${product.price}/{product.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">Stock:</span>
                        <span className={product.stock < product.minStock ? 'text-red-600 font-semibold' : ''}>
                          {product.stock} {product.unit}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary-light dark:text-text-secondary-dark">Monthly Demand:</span>
                        <span>{product.monthlyDemand}</span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="w-4 h-4 mr-2" />
                        Update Stock
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="low-stock">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lowStockProducts.map((product) => (
              <Card key={product.id} className="border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{product.name}</h3>
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Current Stock:</span>
                        <span className="text-yellow-600 font-semibold">{product.stock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Minimum Stock:</span>
                        <span>{product.minStock}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shortage:</span>
                        <span className="text-red-600 font-semibold">{product.minStock - product.stock}</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full bg-primary hover:bg-yellow-400 text-black">
                      Reorder Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="out-of-stock">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {outOfStockProducts.map((product) => (
              <Card key={product.id} className="border-red-200 dark:border-red-800">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{product.name}</h3>
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                          Out of Stock
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Ordered:</span>
                        <span>{product.lastOrdered}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Demand:</span>
                        <span>{product.monthlyDemand}</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
                      Urgent Reorder
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

export default ProductCatalog;