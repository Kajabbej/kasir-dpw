# ==============================================================================
# STAGE 1: Build & Assets Optimization (Node.js)
# ==============================================================================
# We use Node.js 20 on Alpine Linux as the builder stage to optimize and minify
# our vanilla HTML, CSS, and JS files. This guarantees the smallest bundle size
# and fastest possible load times (< 0.5s) for production, meeting PRD requirements.
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy raw source files to the build environment
COPY index.html style.css app.js ./

# Install premium minification tools globally
# - html-minifier-terser: To minify HTML structures and inline scripting/styles
# - clean-css-cli: To compress styles, consolidate rules, and remove whitespace
# - terser: The industry-standard parser and mangler/compressor for ES6+ JavaScript
RUN npm install -g html-minifier-terser clean-css-cli terser

# Run optimization scripts:
# 1. Compress index.html (collapse whitespace, strip comments, minify embedded resources)
# 2. Compress style.css to style.min.css (remove empty rules, optimize values)
# 3. Compress and mangle (minify code & variables) app.js to app.min.js
RUN html-minifier-terser --collapse-whitespace --remove-comments --minify-js true --minify-css true -o index.min.html index.html && \
    cleancss -o style.min.css style.css && \
    terser app.js -c -m -o app.min.js

# Replace the original large source files with our optimized minified equivalents
RUN mv index.min.html index.html && \
    mv style.min.css style.css && \
    mv app.min.js app.js


# ==============================================================================
# STAGE 2: Secure Production Web Server (Unprivileged Nginx)
# ==============================================================================
# To ensure top-tier container security and compatibility with high-compliance
# environments (such as Kubernetes PSPs/policies and enterprise Docker guidelines),
# we use the official Nginx Unprivileged Alpine image. 
# - It runs as non-root (UID 101, user 'nginx') by default.
# - It binds to unprivileged port 8080 (which doesn't require root permissions).
# - It is extremely lightweight (~20MB), minimizing the container attack surface.
FROM nginxinc/nginx-unprivileged:1.25-alpine

# Set environment variables for production configuration
ENV PORT=8080
ENV NGINX_ENTRYPOINT_QUIET_LOGS=1

# Copy the minified static files from Stage 1 into the default Nginx public directory
COPY --from=builder /app/index.html /usr/share/nginx/html/index.html
COPY --from=builder /app/style.css /usr/share/nginx/html/style.css
COPY --from=builder /app/app.js /usr/share/nginx/html/app.js

# Copy our secure, highly optimized custom Nginx server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the unprivileged container port
EXPOSE 8080

# Configure a robust Docker Health Check
# - Runs every 30s to verify container viability
# - Calls the dedicated /healthz endpoint defined in nginx.conf
# - Exits with status 1 (unhealthy) if Nginx is dead or hung
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1

# Start Nginx in the foreground (essential for container runtimes)
CMD ["nginx", "-g", "daemon off;"]
