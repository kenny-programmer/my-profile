/**
 * File upload validation and helper utilities
 */
export interface FileValidationOptions {
  maxSizeBytes?: number
  allowedTypes?: string[]
}

export interface FileValidationResult {
  valid: boolean
  error?: string
}

export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult {
  const { maxSizeBytes = 5 * 1024 * 1024, allowedTypes } = options

  if (file.size > maxSizeBytes) {
    const mb = (maxSizeBytes / 1024 / 1024).toFixed(0)
    return { valid: false, error: `File size must be under ${mb} MB` }
  }

  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type not allowed. Use: ${allowedTypes.join(', ')}` }
  }

  return { valid: true }
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}
