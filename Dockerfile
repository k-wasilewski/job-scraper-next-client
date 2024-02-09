FROM node:18 as dependencies

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile


FROM node:18 as builder

WORKDIR /app

COPY . .

COPY --from=dependencies /app/node_modules ./node_modules

# ENV NEXT_PUBLIC_NODE_SERVER_HOST="192.168.0.8:8080"

# ENV NEXT_PUBLIC_SPRING_SERVER_HOST="192.168.0.8:8081"

RUN yarn test

RUN yarn build


FROM node:18 as runner

WORKDIR /app

ENV NODE_ENV production

# ENV NEXT_PUBLIC_NODE_SERVER_HOST="192.168.0.8:8080"

# ENV NEXT_PUBLIC_SPRING_SERVER_HOST="192.168.0.8:8081"

COPY --from=builder /app/public ./public

COPY --from=builder /app/.next ./.next

COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/package.json ./package.json

CMD ["yarn", "start"]
