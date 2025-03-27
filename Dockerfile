# ==== Build Stage ====
# Use a specific Node.js LTS version on Alpine for a smaller build environment
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json and lock file (if it exists)
# This leverages Docker cache efficiently
COPY package.json package-lock.json* ./

# Install dependencies using 'ci' for cleaner, reproducible installs
# If you use yarn, use 'yarn install --frozen-lockfile'
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Run the Vite build command (outputs to /app/dist by default)
# Ensure your build script in package.json uses 'vite build'
RUN npm run build

# ==== Runtime Stage ====
# Use the official Nginx image on Alpine (very small)
FROM nginx:stable-alpine

# Nginx configuration
# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the custom Nginx configuration prepared earlier
# Adjust the source path if you placed nginx.conf in a subdirectory (e.g., nginx/nginx.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (Nginx default port)
EXPOSE 80

# Start Nginx and keep it in the foreground
# This is the default CMD for the nginx image, but explicitly stating it is fine
CMD ["nginx", "-g", "daemon off;"]
