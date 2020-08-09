var axios = require("axios");

var config = {
  headers: {
    "X-ListenAPI-Key": "ebda0a8f7b964787bb9853b6433656f2",
    Cookie: "__cfduid=d5aac16f6e533fb89014fba0d6560d1651594317923",
  },
};

const makeRequest = async () => {
  let data;
  try {
    const config = {
      headers: {
        "X-ListenAPI-Key": "ebda0a8f7b964787bb9853b6433656f2",
        Cookie: "__cfduid=d5aac16f6e533fb89014fba0d6560d1651594317923",
      },
    };
    const response = await axios.get(
      "https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=160&page=1&region=us&safe_mode=0",
      config
    );
    if (response.status === 200) {
      // response - object, eg { status: 200, message: 'OK' }
      data = JSON.stringify(response.data);
      console.log(data);
    }
    return "cdsc";
  } catch (err) {
    console.error(err);
    return "error";
  }
};

console.log(makeRequest());
