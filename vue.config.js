module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          linux: {
            icon: './icons/png/1024x1024.ico'
          },
          win:{
            icon: './icons/win/app.ico'
          },
          mac:{
            icon: './icons/mac/app.icns'
          },

        }
      }
    }
  }