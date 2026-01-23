import { ReactNode } from 'react'
import { usePermissions, Permissions } from '@/hooks/usePermissions'
import { cn } from '@/lib/utils'

interface PermissionButtonProps {
  resource: keyof Permissions
  action: 'create' | 'update' | 'delete'
  children: ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  title?: string
  type?: 'button' | 'submit'
}

export function PermissionButton({
  resource,
  action,
  children,
  className,
  onClick,
  disabled = false,
  title,
  type = 'button'
}: PermissionButtonProps) {
  const { hasPermission } = usePermissions()
  
  const canPerformAction = hasPermission(resource, action)
  
  if (!canPerformAction) {
    return null
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn('inline-block', className)}
    >
      {children}
    </button>
  )
}

interface PermissionWrapperProps {
  resource: keyof Permissions
  action: 'create' | 'read' | 'update' | 'delete'
  children: ReactNode
  fallback?: ReactNode
}

export function PermissionWrapper({
  resource,
  action,
  children,
  fallback = null
}: PermissionWrapperProps) {
  const { hasPermission } = usePermissions()
  
  const canPerformAction = hasPermission(resource, action)
  
  return canPerformAction ? <>{children}</> : <>{fallback}</>
}