'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Calendar,
  User,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';

interface Transaction {
  id: string;
  transaction_id: string;
  user_id: string;
  course_id: string;
  amount: number;
  currency: string;
  status: 'success' | 'failed' | 'pending' | 'refunded';
  payment_method: string;
  created_at: string;
  updated_at: string;
  user?: {
    full_name: string;
    email: string;
  };
  course?: {
    title: string;
  };
  metadata?: any;
}

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      // For MVP, we'll simulate transaction data since the actual payment webhook
      // integration would depend on your payment provider (Stripe, PayPal, etc.)
      const mockTransactions: Transaction[] = [
        {
          id: '1',
          transaction_id: 'txn_1234567890',
          user_id: 'user_1',
          course_id: 'course_1',
          amount: 99.00,
          currency: 'USD',
          status: 'success',
          payment_method: 'card',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          user: {
            full_name: 'John Doe',
            email: 'john@example.com',
          },
          course: {
            title: 'Digital Marketing Mastery',
          },
        },
        {
          id: '2',
          transaction_id: 'txn_0987654321',
          user_id: 'user_2',
          course_id: 'course_2',
          amount: 149.00,
          currency: 'USD',
          status: 'failed',
          payment_method: 'card',
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
          updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          user: {
            full_name: 'Jane Smith',
            email: 'jane@example.com',
          },
          course: {
            title: 'E-commerce Strategy',
          },
        },
        {
          id: '3',
          transaction_id: 'txn_1122334455',
          user_id: 'user_3',
          course_id: 'course_3',
          amount: 79.00,
          currency: 'USD',
          status: 'pending',
          payment_method: 'bank_transfer',
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          user: {
            full_name: 'Mike Johnson',
            email: 'mike@example.com',
          },
          course: {
            title: 'No-Code Development',
          },
        },
        {
          id: '4',
          transaction_id: 'txn_5566778899',
          user_id: 'user_4',
          course_id: 'course_1',
          amount: 99.00,
          currency: 'USD',
          status: 'refunded',
          payment_method: 'card',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          user: {
            full_name: 'Sarah Wilson',
            email: 'sarah@example.com',
          },
          course: {
            title: 'Digital Marketing Mastery',
          },
        },
      ];

      setTransactions(mockTransactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      const matchesSearch = 
        transaction.transaction_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.user?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.course?.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const transactionDate = new Date(transaction.created_at);
        const now = new Date();
        
        switch (dateFilter) {
          case 'today':
            matchesDate = transactionDate.toDateString() === now.toDateString();
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = transactionDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = transactionDate >= monthAgo;
            break;
        }
      }
      
      return matchesSearch && matchesStatus && matchesDate;
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'bg-green-100 text-green-700 border-green-200',
      failed: 'bg-red-100 text-red-700 border-red-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      refunded: 'bg-blue-100 text-blue-700 border-blue-200',
    };

    const icons = {
      success: <CheckCircle className="w-3 h-3 mr-1" />,
      failed: <XCircle className="w-3 h-3 mr-1" />,
      pending: <Clock className="w-3 h-3 mr-1" />,
      refunded: <AlertTriangle className="w-3 h-3 mr-1" />,
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants] || variants.pending}>
        {icons[status as keyof typeof icons]}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateStats = () => {
    const totalRevenue = transactions
      .filter(t => t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalTransactions = transactions.length;
    const successfulTransactions = transactions.filter(t => t.status === 'success').length;
    const failedTransactions = transactions.filter(t => t.status === 'failed').length;
    const successRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;

    return {
      totalRevenue,
      totalTransactions,
      successfulTransactions,
      failedTransactions,
      successRate,
    };
  };

  const filteredTransactions = getFilteredTransactions();
  const stats = calculateStats();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">Transaction Monitoring</h1>
        <p className="text-[#2C3E50]/70">
          Monitor all payment transactions and diagnose enrollment issues.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="border-[#E5E8E8]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2C3E50]">
                  {formatAmount(stats.totalRevenue, 'USD')}
                </p>
                <p className="text-sm text-[#2C3E50]/60">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E8E8]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2C3E50]">{stats.totalTransactions}</p>
                <p className="text-sm text-[#2C3E50]/60">Total Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E8E8]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#4ECDC4]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2C3E50]">{stats.successfulTransactions}</p>
                <p className="text-sm text-[#2C3E50]/60">Successful</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E8E8]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2C3E50]">{stats.successRate.toFixed(1)}%</p>
                <p className="text-sm text-[#2C3E50]/60">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-[#E5E8E8] mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#2C3E50]/40 w-4 h-4" />
                <Input
                  placeholder="Search by transaction ID, user, or course..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#E5E8E8] focus:border-[#4ECDC4]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-[#E5E8E8]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-32 border-[#E5E8E8]">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border-[#E5E8E8]">
        <CardHeader>
          <CardTitle className="text-[#2C3E50]">
            Transactions ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="font-mono text-sm text-[#2C3E50]">
                        {transaction.transaction_id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-[#4ECDC4]" />
                        <div>
                          <p className="font-medium text-[#2C3E50]">
                            {transaction.user?.full_name}
                          </p>
                          <p className="text-sm text-[#2C3E50]/60">
                            {transaction.user?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#FF6B35]" />
                        <span className="text-sm text-[#2C3E50]">
                          {transaction.course?.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-[#2C3E50]">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                    <TableCell>
                      <div className="capitalize text-sm text-[#2C3E50]/70">
                        {transaction.payment_method.replace('_', ' ')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-[#2C3E50]/60">
                        {formatDate(transaction.created_at)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}