 'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  Shield,
  GraduationCap,
  User,
  Mail,
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface User {
  id: string;
  full_name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  status: 'active' | 'pending' | 'suspended';
  created_at: string;
  last_sign_in_at?: string;
  avatar_url?: string;
}

const USERS_PER_PAGE = 10;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole as any } : user
      ));

      toast.success('User role updated successfully');
      setSelectedUser(null);
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusUpdate = async (userId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) {
        throw error;
      }

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus as any } : user
      ));

      toast.success('User status updated successfully');
    } catch (error: any) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getFilteredUsers = () => {
    return users.filter(user => {
      // Safely handle null/undefined values for full_name and email
      const fullName = user.full_name || '';
      const email = user.email || '';
      const matchesSearch =
        fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  const getPaginatedUsers = () => {
    const filteredUsers = getFilteredUsers();
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    const endIndex = startIndex + USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const filteredUsers = getFilteredUsers();
    return Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-[#FF6B35]" />;
      case 'instructor':
        return <GraduationCap className="w-4 h-4 text-[#4ECDC4]" />;
      default:
        return <User className="w-4 h-4 text-[#2C3E50]" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: 'bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20',
      instructor: 'bg-[#4ECDC4]/10 text-[#4ECDC4] border-[#4ECDC4]/20',
      student: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
      <Badge variant="outline" className={variants[role as keyof typeof variants] || variants.student}>
        {getRoleIcon(role)}
        <span className="ml-1 capitalize">{role}</span>
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-700 border-green-200',
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      suspended: 'bg-red-100 text-red-700 border-red-200',
    };

    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants] || variants.active}>
        {status === 'active' && <UserCheck className="w-3 h-3 mr-1" />}
        {status === 'suspended' && <UserX className="w-3 h-3 mr-1" />}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredUsers = getFilteredUsers();
  const paginatedUsers = getPaginatedUsers();
  const totalPages = getTotalPages();

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#2C3E50] mb-2">User Management</h1>
        <p className="text-[#2C3E50]/70">
          Manage all user accounts, roles, and permissions across the platform.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="border-[#E5E8E8]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2C3E50]">{users.length}</p>
                <p className="text-sm text-[#2C3E50]/60">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E8E8]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-[#4ECDC4]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2C3E50]">
                  {users.filter(u => u.role === 'instructor').length}
                </p>
                <p className="text-sm text-[#2C3E50]/60">Instructors</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E8E8]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2C3E50]">
                  {users.filter(u => u.role === 'student').length}
                </p>
                <p className="text-sm text-[#2C3E50]/60">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E5E8E8]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#2C3E50]">
                  {users.filter(u => u.status === 'active').length}
                </p>
                <p className="text-sm text-[#2C3E50]/60">Active Users</p>
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
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-[#E5E8E8] focus:border-[#4ECDC4]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40 border-[#E5E8E8]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="instructor">Instructor</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-[#E5E8E8]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-[#E5E8E8]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#2C3E50]">
              Users ({filteredUsers.length})
            </CardTitle>
            <div className="text-sm text-[#2C3E50]/60">
              Showing {((currentPage - 1) * USERS_PER_PAGE) + 1}-{Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#4ECDC4]/20 rounded-full flex items-center justify-center">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.full_name}
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <User className="w-4 h-4 text-[#4ECDC4]" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#2C3E50]">{user.full_name}</p>
                          <p className="text-sm text-[#2C3E50]/60 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-[#2C3E50]/60">
                        <Calendar className="w-3 h-3" />
                        {formatDate(user.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-[#2C3E50]/60">
                        {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Never'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedUser(user)}
                            className="text-[#2C3E50] hover:text-[#4ECDC4]"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit User: {selectedUser?.full_name}</DialogTitle>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium text-[#2C3E50]">Role</label>
                                <Select
                                  value={selectedUser.role}
                                  onValueChange={(value) => handleRoleUpdate(selectedUser.id, value)}
                                  disabled={isUpdating}
                                >
                                  <SelectTrigger className="border-[#E5E8E8] focus:border-[#4ECDC4]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="student">Student</SelectItem>
                                    <SelectItem value="instructor">Instructor</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-sm font-medium text-[#2C3E50]">Status</label>
                                <Select
                                  value={selectedUser.status}
                                  onValueChange={(value) => handleStatusUpdate(selectedUser.id, value)}
                                  disabled={isUpdating}
                                >
                                  <SelectTrigger className="border-[#E5E8E8] focus:border-[#4ECDC4]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-[#2C3E50]/60">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="border-[#E5E8E8] hover:border-[#4ECDC4]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                {/* Page numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 p-0 ${
                          currentPage === pageNum 
                            ? 'bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-white' 
                            : 'border-[#E5E8E8] hover:border-[#4ECDC4]'
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="border-[#E5E8E8] hover:border-[#4ECDC4]"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}