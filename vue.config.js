module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
          "extraFiles":{
            "from":"node_modules/ffmpeg-static/bin",
            "to":"./resources/app.asar.unpacked/bin/"
          },
          "linux": {
            "icon": './icons/png/1024x1024.ico'
          },
          "win":{
            "icon": './icons/win/app.ico'
          },
          "mac":{
            "icon": './icons/mac/app.icns'
          }

        }
      }
    }
  }

