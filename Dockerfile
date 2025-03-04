FROM node:20

WORKDIR /app

COPY ./ /app

ENV NODE_OPTIONS=--openssl-legacy-provider
ENV NODE_OPTIONS=--max_old_space_size=4096

RUN npm install
RUN echo "$(date)" && \
    export $(cat /app/*.env | xargs) && \
    npm run build
    
EXPOSE 3000
CMD [ "node", ".output/server/index.mjs" ]
