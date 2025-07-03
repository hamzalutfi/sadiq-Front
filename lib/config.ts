// Configuration for the application
export const config = {
  // API Configuration
  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL ||
      "https://sadiq-backend-4.onrender.com/api/v1",
    timeout: 10000, // 10 seconds
    backendUrl: "http://localhost:5000",
  },

  // App Configuration
  app: {
    name: "Sadiq Store",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },

  // Feature Flags
  features: {
    enableAnalytics: true,
    enableNotifications: true,
    enableOfflineMode: false,
  },

  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },

  // File Upload
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
  },
};

// Helper function to get API URL
export const getApiUrl = (endpoint: string): string => {
  return `${config.api.baseUrl}${endpoint}`;
};

// Helper function to check if running in development
export const isDevelopment = (): boolean => {
  return config.app.environment === "development";
};

// Helper function to check if running in production
export const isProduction = (): boolean => {
  return config.app.environment === "production";
};
