'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Heart, Target, ArrowRight, Check, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { donationService, DonationRequest } from '@/services/donationService';
import { projectService, Project } from '@/services/projectService';

const donationSchema = z.object({
  donorName: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phoneNumber: z.string().optional(),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  method: z.string().min(1, 'Payment method is required'),
  projectId: z.string().optional(),
});

const suggestedAmounts = [100, 500, 1000, 2500, 5000, 10000];

export default function DonatePage() {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [step, setStep] = useState<'amount' | 'details' | 'payment'>('amount');

  const { data: projects = [] } = useQuery({
    queryKey: ['projects', 'active'],
    queryFn: () => projectService.getActive(),
  });

  const form = useForm<DonationRequest>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      donorName: '',
      email: '',
      phoneNumber: '',
      amount: 0,
      method: '',
      projectId: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: DonationRequest) => donationService.createDonation(data),
    onSuccess: () => {
      toast.success('Thank you for your donation! 🎉');
      form.reset();
      setStep('amount');
      setSelectedAmount(0);
    },
    onError: () => {
      toast.error('Failed to process donation. Please try again.');
    },
  });

  const selectedProjectData = Array.isArray(projects) ? projects.find(p => p.id === selectedProject && selectedProject !== 'general') : null;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    form.setValue('amount', amount);
  };

  const handleCustomAmount = (amount: number) => {
    setSelectedAmount(amount);
    form.setValue('amount', amount);
  };

  const onSubmit = (data: DonationRequest) => {
    const donationData = {
      ...data,
      projectId: selectedProject === 'general' ? undefined : selectedProject,
    };
    
    if (data.method === 'mpesa' && data.phoneNumber) {
      donationService.initiateMpesaPayment({
        phoneNumber: data.phoneNumber,
        amount: data.amount,
        donorName: data.donorName,
        email: data.email,
        projectId: donationData.projectId,
      }).then(() => {
        toast.success('M-Pesa payment initiated! Check your phone for the payment prompt.');
      }).catch(() => {
        toast.error('Failed to initiate M-Pesa payment. Please try again.');
      });
    } else {
      createMutation.mutate(donationData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Make a Difference Today
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your donation helps us support children&apos;s homes and communities in need. 
            Every contribution makes a meaningful impact.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Donation Form */}
          <div className="lg:col-span-2">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Heart className="w-6 h-6 text-red-500" />
                  Donate Now
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Choose your donation amount and help us make a difference
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {step === 'amount' && (
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium text-gray-900 mb-2 block">Select Project (Optional)</Label>
                      <Select value={selectedProject} onValueChange={setSelectedProject}>
                        <SelectTrigger className="h-11 border-gray-300 focus:border-primary-500 focus:ring-primary-500 bg-white text-gray-900">
                          <SelectValue placeholder="Choose a project or donate to general fund" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          <SelectItem value="general" className="hover:bg-gray-50 focus:bg-gray-50 text-gray-900 bg-white">General Fund</SelectItem>
                          {Array.isArray(projects) && projects.map((project: Project) => (
                            <SelectItem key={project.id} value={project.id} className="hover:bg-gray-50 focus:bg-gray-50 text-gray-900 bg-white">
                              {project.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-base font-medium text-gray-900 mb-3 block">Donation Amount</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {suggestedAmounts.map((amount) => (
                          <Button
                            key={amount}
                            type="button"
                            variant={selectedAmount === amount ? 'default' : 'outline'}
                            onClick={() => handleAmountSelect(amount)}
                            className="h-12 text-base font-medium bg-white text-gray-900 border-gray-300 hover:bg-gray-50 data-[variant=default]:bg-primary-600 data-[variant=default]:text-white data-[variant=default]:border-primary-600"
                          >
                            KSH {amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="customAmount" className="text-sm font-medium text-gray-700 mb-1 block">Custom Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">KSH</span>
                          <Input
                            id="customAmount"
                            type="number"
                            placeholder="Enter amount"
                            className="pl-12 h-11 border-gray-300 focus:border-primary-500 focus:ring-primary-500 bg-white text-gray-900"
                            onChange={(e) => {
                              const value = parseFloat(e.target.value);
                              if (value > 0) handleCustomAmount(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => setStep('details')}
                      disabled={!selectedAmount || selectedAmount <= 0}
                      className="w-full h-11 text-base font-medium bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:text-gray-500"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {step === 'details' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="donorName" className="text-base font-medium text-gray-900 mb-1 block">Full Name</Label>
                      <Input
                        id="donorName"
                        {...form.register('donorName')}
                        placeholder="Enter your full name"
                        className="h-11 border-gray-300 focus:border-primary-500 focus:ring-primary-500 bg-white text-gray-900"
                      />
                      {form.formState.errors.donorName && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.donorName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-base font-medium text-gray-900 mb-1 block">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register('email')}
                        placeholder="Enter your email"
                        className="h-11 border-gray-300 focus:border-primary-500 focus:ring-primary-500 bg-white text-gray-900"
                      />
                      {form.formState.errors.email && (
                        <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep('amount')} className="h-11 bg-white text-gray-900 border-gray-300 hover:bg-gray-50">
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => {
                          const name = form.getValues('donorName');
                          const email = form.getValues('email');
                          if (name && email && email.includes('@')) {
                            setStep('payment');
                          } else {
                            form.trigger(['donorName', 'email']);
                          }
                        }}
                        className="flex-1 h-11 bg-primary-600 text-white hover:bg-primary-700"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                )}

                {step === 'payment' && (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="font-medium text-gray-900 mb-2">Donation Summary</h3>
                      <div className="space-y-1 text-sm text-gray-900">
                        <div className="flex justify-between">
                          <span className="text-gray-700">Amount:</span>
                          <span className="font-medium text-gray-900">KSH {selectedAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Project:</span>
                          <span className="text-gray-900">{selectedProjectData?.title || 'General Fund'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-700">Donor:</span>
                          <span className="text-gray-900">{form.watch('donorName')}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium text-gray-900 mb-1 block">Payment Method</Label>
                      <Select onValueChange={(value) => form.setValue('method', value)}>
                        <SelectTrigger className="h-11 border-gray-300 focus:border-primary-500 focus:ring-primary-500 bg-white text-gray-900">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
                          <SelectItem value="mpesa" className="hover:bg-gray-50 focus:bg-gray-50 text-gray-900 bg-white">
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              M-Pesa (Mobile Money)
                            </div>
                          </SelectItem>
                          <SelectItem value="bank_transfer" className="hover:bg-gray-50 focus:bg-gray-50 text-gray-900 bg-white">Bank Transfer</SelectItem>
                          <SelectItem value="cash" className="hover:bg-gray-50 focus:bg-gray-50 text-gray-900 bg-white">Cash Donation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {form.watch('method') === 'mpesa' && (
                      <div>
                        <Label htmlFor="phoneNumber" className="text-base font-medium text-gray-900 mb-1 block">Phone Number (M-Pesa)</Label>
                        <Input
                          id="phoneNumber"
                          {...form.register('phoneNumber')}
                          placeholder="254712345678"
                          className="h-11 border-gray-300 focus:border-primary-500 focus:ring-primary-500 bg-white text-gray-900"
                        />
                        <p className="text-sm text-gray-500 mt-1">Enter your M-Pesa registered phone number</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" onClick={() => setStep('details')} className="h-11 bg-white text-gray-900 border-gray-300 hover:bg-gray-50">
                        Back
                      </Button>
                      <Button type="submit" disabled={createMutation.isPending} className="flex-1 h-11 bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:text-gray-500">
                        {createMutation.isPending ? 'Processing...' : 'Complete Donation'}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedProjectData && (
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">{selectedProjectData.title}</CardTitle>
                  <CardDescription>{selectedProjectData.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{Math.round((selectedProjectData.fundsRaised / selectedProjectData.targetAmount) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{
                            width: `${Math.min((selectedProjectData.fundsRaised / selectedProjectData.targetAmount) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Raised</p>
                        <p className="font-semibold">KSH {selectedProjectData.fundsRaised.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Goal</p>
                        <p className="font-semibold">KSH {selectedProjectData.targetAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    <Badge variant={selectedProjectData.status === 'ACTIVE' ? 'default' : 'secondary'}>
                      {selectedProjectData.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5 text-blue-500" />
                  Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Direct Support</p>
                      <p className="text-xs text-gray-600">Your donation directly supports children and families in need</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Transparent Use</p>
                      <p className="text-xs text-gray-600">Track how your donation is used through our regular updates</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Community Impact</p>
                      <p className="text-xs text-gray-600">Join a community of donors making lasting change</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}