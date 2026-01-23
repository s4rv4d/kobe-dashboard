"use client"

import { useRef, useState } from "react"
import { Camera, Loader2, Trash2, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  useUploadProfilePhoto,
  useDeleteProfilePhoto,
} from "@/hooks/use-user-profile"
import { validateProfilePhoto } from "@/lib/validations/user-profile"
import { cn } from "@/lib/utils"

interface ProfilePhotoUploadProps {
  photoUrl: string | null
  address: string
  editable?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "size-16",
  md: "size-20",
  lg: "size-24",
}

export function ProfilePhotoUpload({
  photoUrl,
  address,
  editable = false,
  size = "md",
  className,
}: ProfilePhotoUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | null>(null)

  const uploadMutation = useUploadProfilePhoto()
  const deleteMutation = useDeleteProfilePhoto()

  const isLoading = uploadMutation.isPending || deleteMutation.isPending

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    const validationError = validateProfilePhoto(file)
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      await uploadMutation.mutateAsync(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleDelete = async () => {
    setError(null)
    try {
      await deleteMutation.mutateAsync()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed")
    }
  }

  const initials = address.slice(2, 4).toUpperCase()

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative">
        <Avatar className={cn(sizeClasses[size], "border-2 border-border")}>
          <AvatarImage src={photoUrl || undefined} alt="Profile" />
          <AvatarFallback className="bg-muted text-muted-foreground">
            {photoUrl ? <User className="size-8" /> : initials}
          </AvatarFallback>
        </Avatar>

        {editable && (
          <div className="absolute -bottom-1 -right-1 flex gap-1">
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              className="size-7 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Camera className="size-3.5" />
              )}
            </Button>
            {photoUrl && (
              <Button
                type="button"
                size="icon-sm"
                variant="outline"
                className="size-7 rounded-full"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>

      {editable && (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WebP. Max 5MB
          </p>
        </>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
