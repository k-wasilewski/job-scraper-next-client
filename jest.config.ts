module.exports = {
    roots: [
      "<rootDir>"
    ],
    testMatch: [
      "**/tests/**/*.+(ts|tsx|js|jsx)",
      "**/?(*.)+(spec|test).+(ts|tsx|js|jsx)"
    ],
    transform: {
      "^.+\\.(ts|tsx)$": ["ts-jest", {
        babel: true,
        tsconfig: "jest.tsconfig.json"
      }],
    },
    coveragePathIgnorePatterns: [
      "/node_modules/",
    ],
    testEnvironment: "jsdom",
    setupFiles: ["./setup.jest.ts"],
    moduleNameMapper: {
      "\\.(css|sass)$": "identity-obj-proxy",
    },
}

export {}