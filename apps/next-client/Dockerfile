# Base Image
FROM node:20-alpine3.18 AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Define build-time variables
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXT_PUBLIC_LOCAL_BACKEND_URL
ARG NEXTAUTH_URL
ARG NEXT_PUBLIC_KAKAO_MAP_KEY
ARG DATA_API_KEY

# Set environment variables to be used in the container
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXT_PUBLIC_LOCAL_BACKEND_URL=$NEXT_PUBLIC_LOCAL_BACKEND_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXT_PUBLIC_KAKAO_MAP_KEY=$NEXT_PUBLIC_KAKAO_MAP_KEY
ENV DATA_API_KEY=$DATA_API_KEY

# Create the next-client directory and copy necessary files
RUN mkdir -p apps/next-client

# Copy root package.json and yarn.lock
COPY package.json yarn.lock /app/

# Copy next-client package.json
COPY ./apps/next-client/package.json /app/apps/next-client/

# Copy the rest of the next-client files
COPY ./apps/next-client /app/apps/next-client/

# Install dependencies for next-client
WORKDIR /app/apps/next-client
RUN yarn --frozen-lockfile

# Copy the rest of the next-client application code into the container
COPY --chown=node:node ./apps/next-client ./apps/next-client/

# Build the Next.js app
RUN yarn workspace next-client build

# Expose the port Next.js app runs on (default is 3000)
EXPOSE 3000

# Start the app
CMD ["yarn", "workspace", "next-client", "start"]