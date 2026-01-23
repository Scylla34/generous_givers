'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, DollarSign, TrendingUp, Users, Download, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { donationService, DonationRequest } from '@/services/donationService';
import { projectService, Project } from '@/services/projectService';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionButton } from '@/components/ui/permission-button';

const donationSchema = z.object({
  donorName: z.string().min(1, 'Donor name is required'),
  email: z.string().email('Valid email is required'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  method: z.string().min(1, 'Payment method is required'),
  projectId: z.string().optional(),
});

export default function DonationsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();
  const { canRead } = usePermissions();

  const { data: donations, isLoading } = useQuery({
    queryKey: ['donations'],
    queryFn: () => donationService.getAllDonations(),
    enabled: canRead('donations'),
  });

  const { data: projects } = useQuery({
    queryKey: ['projects', 'active'],
    queryFn: () => projectService.getActive(),
  });

  const { data: totalDonations } = useQuery({
    queryKey: ['donations', 'total'],
    queryFn: () => donationService.getTotalDonations(),
  });

  const safedonations = Array.isArray(donations) ? donations : [];
  const safeProjects = Array.isArray(projects) ? projects : [];
  const safeTotalDonations = typeof totalDonations === 'number' ? totalDonations : 0;

  const form = useForm<DonationRequest>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donorName: '',
      email: '',
      amount: 0,
      method: '',
      projectId: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: DonationRequest) => donationService.createDonation(data),
    onSuccess: (newDonation) => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donations', 'total'] });
      setIsCreateOpen(false);
      form.reset();
      toast.success(
        <div className="space-y-1">
          <div className="font-medium">Donation recorded successfully!</div>
          <div className="text-sm text-gray-600">Thank you for recording the donation from {newDonation.donorName}</div>
        </div>,
        { duration: 4000 }
      );
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : 'Failed to record donation'
      toast.error(
        <div className="space-y-1">
          <div className="font-medium">Failed to record donation</div>
          <div className="text-sm text-gray-600">{errorMessage}</div>
        </div>,
        { duration: 6000 }
      );
    },
  });

  const filteredDonations = safedonations.filter(donation => {
    const matchesFilter = filter === 'all' || donation.status.toLowerCase() === filter;
    const matchesSearch = donation.donorName.toLowerCase().includes(search.toLowerCase()) ||
                         donation.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = [
    {
      title: 'Total Donations',
      value: `$${safeTotalDonations.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-green-600 bg-green-50',
    },
    {
      title: 'Total Donors',
      value: safedonations.length > 0 ? new Set(safedonations.map(d => d.email)).size : 0,
      icon: Users,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'This Month',
      value: safedonations.filter(d => 
        new Date(d.date).getMonth() === new Date().getMonth()
      ).length,
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  const onSubmit = (data: DonationRequest) => {
    createMutation.mutate({
      ...data,
      projectId: data.projectId === 'general' ? undefined : data.projectId,
    });
  };

  if (!canRead('donations')) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">You don&apos;t have permission to view donations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="text-gray-600">Track and manage all donations</p>
        </div>
        <PermissionButton
          resource="donations"
          action="create"
        >
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Record Donation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Donation</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="donorName">Donor Name</Label>
                  <Input
                    id="donorName"
                    {...form.register('donorName')}
                    placeholder="Enter donor name"
                  />
                  {form.formState.errors.donorName && (
                    <p className="text-sm text-red-600">{form.formState.errors.donorName.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...form.register('email')}
                    placeholder="Enter email address"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="amount">Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    {...form.register('amount', { valueAsNumber: true })}
                    placeholder="Enter amount"
                  />
                  {form.formState.errors.amount && (
                    <p className="text-sm text-red-600">{form.formState.errors.amount.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="method">Payment Method</Label>
                  <Select onValueChange={(value) => form.setValue('method', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="projectId">Project (Optional)</Label>
                  <Select onValueChange={(value) => form.setValue('projectId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Fund</SelectItem>
                      {safeProjects.map((project: Project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending}>
                    {createMutation.isPending ? 'Recording...' : 'Record Donation'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </PermissionButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search donations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filter} onValueChange={(value: 'all' | 'completed' | 'pending') => setFilter(value)}>
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading donations...</p>
            </div>
          ) : filteredDonations.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
              <p className="text-gray-500">No donations match your current filters.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Project</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDonations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{donation.donorName}</p>
                        <p className="text-sm text-gray-500">{donation.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${donation.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">
                      {donation.method.replace('_', ' ')}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {donation.projectTitle || 'General Fund'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {format(new Date(donation.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={donation.status === 'COMPLETED' ? 'default' : 'secondary'}>
                        {donation.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}