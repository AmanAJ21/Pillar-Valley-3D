export default ({ config }) => ({
  ...config,
  icon: "./src/assets/icon.png",
  splash: {
    image: "./src/assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ff7e5f",
  },
  web: {
    bundler: "metro",
    build: {
      babel: {
        include: ["react-native-vector-icons"]
      }
    },
    favicon: "./src/assets/icon.png"
  },
});
