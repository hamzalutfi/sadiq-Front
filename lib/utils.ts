import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { config } from "./config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to get full image URL from backend
export function getImageUrl(imagePath: string | undefined): string {
  if (!imagePath) {
    return '/placeholder.svg'
  }
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // If it's a relative path, construct full URL
  if (imagePath.startsWith('/')) {
    return `${config.api.backendUrl}${imagePath}`
  }
  
  // If it doesn't start with /, add it
  return `${config.api.backendUrl}${imagePath}`
}
