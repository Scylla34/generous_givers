'use client'

import { useState, useCallback, useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { uploadService } from '@/services/uploadService'
import { ModuleType, UploadResponse } from '@/types'
import { Upload, X, File, Image as ImageIcon, FileText, Music, Video, Download, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface FileUploadProps {
  moduleType: ModuleType
  moduleId?: string
  onUploadComplete?: (uploads: UploadResponse[]) => void
  maxFiles?: number
  acceptedFileTypes?: string
  showExistingFiles?: boolean
}

const getFileIcon = (fileType?: string) => {
  if (!fileType) return <File className="w-8 h-8 text-gray-400" />
  if (fileType.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-blue-500" />
  if (fileType.startsWith('video/')) return <Video className="w-8 h-8 text-purple-500" />
  if (fileType.startsWith('audio/')) return <Music className="w-8 h-8 text-green-500" />
  if (fileType.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
  return <File className="w-8 h-8 text-gray-400" />
}

const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'Unknown size'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUpload({
  moduleType,
  moduleId,
  onUploadComplete,
  maxFiles = 10,
  acceptedFileTypes = '*',
  showExistingFiles = true,
}: FileUploadProps) {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // Fetch existing files for this module
  const { data: existingUploads = [], isLoading: isLoadingExisting } = useQuery({
    queryKey: ['uploads', moduleType, moduleId],
    queryFn: () => moduleId ? uploadService.getByModule(moduleType, moduleId) : Promise.resolve([]),
    enabled: showExistingFiles && !!moduleId,
  })

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      if (moduleId) {
        return uploadService.uploadMultiple(files, moduleType, moduleId)
      } else {
        // Upload one by one if no moduleId yet
        const uploads: UploadResponse[] = []
        for (const file of files) {
          const upload = await uploadService.upload(file, moduleType)
          uploads.push(upload)
        }
        return uploads
      }
    },
    onSuccess: (uploads) => {
      queryClient.invalidateQueries({ queryKey: ['uploads', moduleType, moduleId] })
      setSelectedFiles([])
      onUploadComplete?.(uploads)
      toast.success(`${uploads.length} file(s) uploaded successfully`)
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to upload files'
      toast.error(message)
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: uploadService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads', moduleType, moduleId] })
      toast.success('File deleted successfully')
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to delete file'
      toast.error(message)
    },
  })

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const addFiles = useCallback((files: File[]) => {
    setSelectedFiles(prev => {
      const totalFiles = prev.length + files.length
      if (totalFiles > maxFiles) {
        toast.error(`Maximum ${maxFiles} files allowed`)
        return prev
      }
      return [...prev, ...files]
    })
  }, [maxFiles])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    addFiles(droppedFiles)
  }, [addFiles])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    addFiles(files)
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to upload')
      return
    }
    uploadMutation.mutate(selectedFiles)
  }

  const handleDelete = (uploadId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      deleteMutation.mutate(uploadId)
    }
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          <span className="font-medium text-primary-600">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Maximum {maxFiles} files
        </p>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Selected Files ({selectedFiles.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {getFileIcon(file.type)}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeSelectedFile(index)
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleUpload}
            disabled={uploadMutation.isPending}
            className="w-full mt-2 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload {selectedFiles.length} file(s)
              </>
            )}
          </button>
        </div>
      )}

      {/* Existing Files */}
      {showExistingFiles && moduleId && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files</h4>
          {isLoadingExisting ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : existingUploads.length === 0 ? (
            <p className="text-sm text-gray-500 py-2">No files uploaded yet</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {existingUploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getFileIcon(upload.fileType)}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">
                        {upload.originalFileName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(upload.fileSize)} • {upload.uploadedByName || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <a
                      href={upload.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Download"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                    </a>
                    <button
                      onClick={() => handleDelete(upload.id)}
                      disabled={deleteMutation.isPending}
                      className="p-2 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
