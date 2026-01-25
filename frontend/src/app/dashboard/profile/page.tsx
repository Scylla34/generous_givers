'use client'

import { useState, useRef, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/services/profileService'
import { UpdateProfileRequest, UserRole } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { Camera, User, Phone, Mail, Save, Upload, X, Edit2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
  const queryClient = useQueryClient()
  const { updateUser } = useAuthStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: '',
    lastName: '',
    phone: '',
  })
  const [originalData, setOriginalData] = useState<UpdateProfileRequest>({
    firstName: '',
    lastName: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: profileService.getCurrentProfile,
  })

  useEffect(() => {
    if (profile) {
      const data = {
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        phone: profile.phone || '',
      }
      setFormData(data)
      setOriginalData(data)
    }
  }, [profile])

  // Check if form has changes
  useEffect(() => {
    const changed =
      formData.firstName !== originalData.firstName ||
      formData.lastName !== originalData.lastName ||
      formData.phone !== originalData.phone
    setHasChanges(changed)
  }, [formData, originalData])

  const updateProfileMutation = useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      const userUpdate = {
        ...data,
        role: data.role as UserRole,
        name: `${data.firstName} ${data.lastName}`
      }
      updateUser(userUpdate)
      toast.success(
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" />
          <span>Profile updated successfully!</span>
        </div>
      )
      setErrors({})
      setIsEditing(false)
      setOriginalData({
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
      })
      setHasChanges(false)
    },
    onError: () => {
      toast.error('Failed to update profile')
    },
  })

  const uploadPictureMutation = useMutation({
    mutationFn: profileService.uploadProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success('Profile picture updated successfully!')
      setPreviewImage(null)
      setSelectedFile(null)
    },
    onError: () => {
      toast.error('Failed to upload profile picture')
    },
  })

  const handleInputChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    }

    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      updateProfileMutation.mutate(formData)
    }
  }

  const handleCancelEdit = () => {
    setFormData(originalData)
    setIsEditing(false)
    setErrors({})
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setSelectedFile(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadPicture = () => {
    if (selectedFile) {
      uploadPictureMutation.mutate(selectedFile)
    }
  }

  const handleCancelUpload = () => {
    setPreviewImage(null)
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const profilePictureUrl = profile?.profilePicture
    ? profileService.getProfilePictureUrl(profile.profilePicture)
    : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Header */}
      <div className="px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your account information and profile picture</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Picture Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
              Profile Picture
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Upload a profile picture to personalize your account
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0 space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
                  <AvatarImage
                    src={previewImage || profilePictureUrl || undefined}
                    alt="Profile picture"
                  />
                  <AvatarFallback className="text-xl sm:text-2xl bg-primary-100 text-primary-700">
                    {getInitials(profile?.firstName, profile?.lastName)}
                  </AvatarFallback>
                </Avatar>
                {!previewImage && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-primary-600 text-white p-1.5 sm:p-2 rounded-full hover:bg-primary-700 transition-colors shadow-lg"
                  >
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {previewImage ? (
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={handleUploadPicture}
                    disabled={uploadPictureMutation.isPending}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm"
                    size="sm"
                  >
                    <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {uploadPictureMutation.isPending ? 'Uploading...' : 'Upload'}
                  </Button>
                  <Button
                    onClick={handleCancelUpload}
                    variant="outline"
                    className="flex-1 bg-white text-gray-900 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                    size="sm"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full bg-white text-gray-900 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                  size="sm"
                >
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Choose Picture
                </Button>
              )}

              <div className="text-xs text-gray-500 text-center">
                <p>Supported formats: JPEG, PNG</p>
                <p>Maximum size: 5MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  {isEditing
                    ? 'Edit your personal details below'
                    : 'Click Edit Profile to update your details'}
                </CardDescription>
              </div>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="bg-white text-primary-600 border-primary-300 hover:bg-primary-50 text-xs sm:text-sm w-full sm:w-auto"
                  size="sm"
                >
                  <Edit2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="firstName" className="text-xs sm:text-sm">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!isEditing}
                    className={cn(
                      "text-sm",
                      isEditing ? "bg-white text-gray-900" : "bg-gray-50 text-gray-600 cursor-not-allowed",
                      errors.firstName && "border-red-500"
                    )}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="lastName" className="text-xs sm:text-sm">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!isEditing}
                    className={cn(
                      "text-sm",
                      isEditing ? "bg-white text-gray-900" : "bg-gray-50 text-gray-600 cursor-not-allowed",
                      errors.lastName && "border-red-500"
                    )}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && (
                    <p className="text-xs sm:text-sm text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="pl-8 sm:pl-10 bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                  />
                </div>
                <p className="text-xs text-gray-500">Email address cannot be changed</p>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className={cn(
                      "pl-8 sm:pl-10 text-sm",
                      isEditing ? "bg-white text-gray-900" : "bg-gray-50 text-gray-600 cursor-not-allowed",
                      errors.phone && "border-red-500"
                    )}
                    placeholder="+1234567890"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs sm:text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Action Buttons - Only show when editing */}
              {isEditing && (
                <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 border-t border-gray-100">
                  <Button
                    type="button"
                    onClick={handleCancelEdit}
                    variant="outline"
                    className="flex-1 sm:flex-none bg-white text-gray-700 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                    size="sm"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending || !hasChanges}
                    className={cn(
                      "flex-1 sm:flex-none sm:min-w-[140px] text-xs sm:text-sm",
                      hasChanges
                        ? "bg-primary-600 hover:bg-primary-700 text-white"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    )}
                    size="sm"
                  >
                    <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    {updateProfileMutation.isPending ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Account Info Card - Mobile optimized */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Account Information</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Your account details and membership information
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500">Role</p>
              <p className="font-medium text-gray-900 text-sm sm:text-base capitalize">
                {profile?.role?.replace(/_/g, ' ').toLowerCase() || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500">Member Number</p>
              <p className="font-medium text-gray-900 text-sm sm:text-base">
                {profile?.memberNumber || 'N/A'}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-gray-500">Account Status</p>
              <p className={cn(
                "font-medium text-sm sm:text-base",
                profile?.isActive ? "text-green-600" : "text-red-600"
              )}>
                {profile?.isActive ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
