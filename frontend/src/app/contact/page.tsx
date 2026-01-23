'use client';

import { useState } from 'react';
import { contactService, ContactRequest } from '@/services/contactService';
import { toast } from 'sonner';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { HeroImageSlider } from '@/components/HeroImageSlider';

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactRequest>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactService.submitContactForm(formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to send message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Image Slider Header */}
      <HeroImageSlider 
        title="Contact Us"
        subtitle="Get in touch with our team"
      />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 animate-slide-up">Get In Touch</h2>
            <p className="text-gray-700 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
              We would love to hear from you! Whether you have questions, want to get
              involved, or need more information about our work, please don&apos;t hesitate to
              reach out.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Mail className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <a
                    href="mailto:teddscylla@gmail.com"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    teddscylla@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Phone className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <a href="tel:+254700000000" className="text-gray-700 hover:text-primary-600">
                    +254 700 000 000
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                  <p className="text-gray-700">Nairobi, Kenya</p>
                </div>
              </div>

              <div className="flex items-start gap-4 animate-slide-up" style={{ animationDelay: '500ms' }}>
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Clock className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Office Hours</h3>
                  <p className="text-gray-700">
                    Monday - Friday: 9:00 AM - 5:00 PM
                    <br />
                    Saturday - Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 animate-scale-in" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 animate-slide-up">Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={100}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  placeholder="Your name"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength={20}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  placeholder="+254 700 000 000"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-gray-700">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  minLength={5}
                  maxLength={200}
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  placeholder="Message subject"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700">
                  Message <span className="text-red-500">*</span>
                </Label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Your message"
                  disabled={isSubmitting}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
                size="lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="w-4 h-4" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Send Message
                    <Send className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
