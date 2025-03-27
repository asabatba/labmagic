# ==== Build Stage ====
# Use a specific Node.js LTS version on Alpine for a smaller build environment
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package.json AND the yarn.lock file
# This leverages Docker cache efficiently with Yarn
COPY package.json yarn.lock ./

# Install dependencies using Yarn
# --frozen-lockfile ensures we use the exact versions from yarn.lock
RUN yarn install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Run the Vite build command using yarn
# Ensure 'build' script is defined in package.json (e.g., "build": "tsc && vite build")
RUN yarn run build

# ==== Runtime Stage ====
# Use the official Nginx image on Alpine (very small)
FROM nginx:stable-alpine

# Nginx configuration
# Remove default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the custom Nginx configuration prepared earlier
# Adjust the source path if you placed nginx.conf in a subdirectory (e.g., nginx/nginx.conf)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from the 'builder' stage's /app/dist directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (Nginx default port)
EXPOSE 80

# Start Nginx and keep it in the foreground
# This is the default CMD for the nginx image, but explicitly stating it is fine
CMD ["nginx", "-g", "daemon off;"]
