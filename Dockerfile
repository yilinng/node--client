FROM node:14-alpine3.12

# Make folder to put our files in
#RUN mkdir -p /usr/src/app
#RUN mkdir -p /usr/src/app/frontend

# Set working directory so that all
# subsequent command runs in this folder
WORKDIR /usr/src/app

# Add a work directory
# Cache and Install dependencies
COPY package.json .
COPY yarn.lock .
#COPY yarn.lock .
#RUN yarn install --frozen-lockfile
# Copy app files
RUN yarn install

COPY . .

# Expose port
EXPOSE 3000
# Start the app
CMD [ "yarn", "start" ]

# RUN npm test - if you want to test before to build


