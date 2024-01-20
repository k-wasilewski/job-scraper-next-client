module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    nodeServerHost: process.env.NEXT_PUBLIC_NODE_SERVER_HOST,
    springServerHost: process.env.NEXT_PUBLIC_SPRING_SERVER_HOST,
  },
  env: {
    NEXT_PUBLIC_NODE_SERVER_HOST: process.env.NEXT_PUBLIC_NODE_SERVER_HOST,
    NEXT_PUBLIC_SPRING_SERVER_HOST: process.env.NEXT_PUBLIC_SPRING_SERVER_HOST,
  }
}
