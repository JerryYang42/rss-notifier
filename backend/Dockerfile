FROM node:14
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

# build-then-serve approach. executed during the Docker image build process. 
# It compiles the TypeScript code into JavaScript, 
# typically creating a dist or build directory with 
# the compiled files. The compiled files become part 
# of the Docker image.
# RUN npm run build
EXPOSE 4000
CMD ["npm", "start"]
# CMD ["npm", "run", "serve"]