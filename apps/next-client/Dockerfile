FROM node:20-alpine3.18 AS base

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine 
# to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Set working directory in the container
WORKDIR /app

# first create these directories, else the copying won't work.
RUN mkdir -p apps/next-client

COPY --chown=node:node package.json .
COPY --chown=node:node yarn.lock .
COPY --chown=node:node ./apps/next-client/package.json  ./apps/next-client

# Install dependencies
RUN yarn --frozen-lockfile

# Copy the rest of the application code to the container
COPY ./apps/next-client ./apps/next-client

# Build arguments for environment variables
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL

# Set environment variables
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL

# Build the Next.js app
RUN yarn workspace next-client build

# Expose the port Next.js app runs on (default is 3000)
EXPOSE 3000

CMD [ "yarn", "workspace", "next-client", "start" ]
