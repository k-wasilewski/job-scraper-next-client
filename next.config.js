module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    environment: process.env.NODE_ENV,
    nodeServerHost: process.env.NEXT_PUBLIC_NODE_SERVER_HOST,
    springServerHost: process.env.NEXT_PUBLIC_SPRING_SERVER_HOST,
  },
  env: {
    NEXT_PUBLIC_NODE_SERVER_HOST: process.env.NEXT_PUBLIC_NODE_SERVER_HOST,
    NEXT_PUBLIC_SPRING_SERVER_HOST: process.env.NEXT_PUBLIC_SPRING_SERVER_HOST,
  }
}
