module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        linux: {
          icon: "./icons/png/256x256.png",
        },
        win: {
          icon: "./icons/win/app.ico",
        },
        mac: {
          icon: "./icons/mac/app.icns",
        },
      },
    },
  },
};
