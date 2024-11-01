# Base Image
FROM node:20-alpine3.18 AS phase1

WORKDIR /app

# Copy necessary files
COPY --chown=node:node turbo.json .
COPY --chown=node:node tsconfig.json .
COPY --chown=node:node package.json .

# Create the express-server directory and copy relevant files
RUN mkdir -p apps/express-server
COPY --chown=node:node ./apps/express-server/package.json apps/express-server
COPY --chown=node:node ./apps/express-server apps/express-server

# Environment variables for build arguments
ARG JWT_SECRET
ARG DB_USER
ARG DB_HOST
ARG DB_NAME
ARG DB_PASSWORD
ARG DB_PORT
ARG FRONTEND_URL

# Set environment variables for runtime
ENV JWT_SECRET=$JWT_SECRET
ENV DB_USER=$DB_USER
ENV DB_HOST=$DB_HOST
ENV DB_NAME=$DB_NAME
ENV DB_PASSWORD=$DB_PASSWORD
ENV DB_PORT=$DB_PORT
ENV FRONTEND_URL=$FRONTEND_URL

# Install dependencies
RUN yarn

# Build express-server
RUN yarn build

# Start the server
CMD ["yarn", "workspace", "express-server", "start"]