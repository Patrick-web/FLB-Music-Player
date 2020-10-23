import axios from "axios";
import { stat } from "fs";
const state = {
  cache: {},
  bestPodcasts: [],
  curated: [],
  currentGenre: [],
  currentPodcast: {},
  currentlyPlayingPodcast: {},
  currentlyPlayingEpisode: {
    thumbnail: "sample.jpg",
    title: "sample",
    description: "samlple",
    podcast: {
      isSubscribed: false,
      name: "sample",
    },
  },
  currentPodcastName: "",
  searchResults: {},
  renderedPodcasts: [],
  renderedBeforeSearch: [],
  subscribed: [],
  newlySubscribedWebsiteUrl: null,
  genres: [
    {
      id: 168,
      name: "Fiction",
      parent_id: 67,
    },
    {
      id: 111,
      name: "Education",
      parent_id: 67,
    },
    {
      id: 133,
      name: "Comedy",
      parent_id: 67,
    },
    {
      id: 93,
      name: "Business",
      parent_id: 67,
    },
    {
      id: 100,
      name: "Arts",
      parent_id: 67,
    },
    {
      id: 143,
      name: "Programming",
      parent_id: 127,
    },
    {
      id: 138,
      name: "Movie",
      parent_id: 68,
    },
    {
      id: 109,
      name: "Medicine",
      parent_id: 107,
    },
    {
      id: 69,
      name: "Religion",
      parent_id: 67,
    },
    {
      id: 135,
      name: "Crime",
      parent_id: 67,
    },
    {
      id: 106,
      name: "Fashion",
      parent_id: 100,
    },
    {
      id: 88,
      name: "Health",
      parent_id: 67,
    },
    {
      id: 105,
      name: "Design",
      parent_id: 100,
    },
    {
      id: 107,
      name: "Science",
      parent_id: 67,
    },
    {
      id: 68,
      name: "TV & Film",
      parent_id: 67,
    },
    {
      id: 173,
      name: "Marketing",
      parent_id: 93,
    },
    {
      id: 213,
      name: "Daily News",
      parent_id: 99,
    },
    {
      id: 131,
      name: "Tech News",
      parent_id: 99,
    },
    {
      id: 104,
      name: "Books",
      parent_id: 100,
    },
    {
      id: 244,
      name: "Documentary",
      parent_id: 122,
    },
    {
      id: 200,
      name: "Animation",
      parent_id: 82,
    },
    {
      id: 204,
      name: "Games",
      parent_id: 82,
    },
    {
      id: 134,
      name: "Music",
      parent_id: 67,
    },
    {
      id: 127,
      name: "Technology",
      parent_id: 67,
    },
    {
      id: 216,
      name: "Politics",
      parent_id: 99,
    },
    {
      id: 219,
      name: "Religion",
      parent_id: 69,
    },
    {
      id: 245,
      name: "Relationships",
      parent_id: 122,
    },
    {
      id: 77,
      name: "Sports",
      parent_id: 67,
    },
    {
      id: 184,
      name: "Drama",
      parent_id: 168,
    },
    {
      id: 145,
      name: "Parenting",
      parent_id: 132,
    },
  ],
};

const getters = {
  AllGenres: (state) => state.genres,
  bestPodcasts: (state) => state.bestPodcasts,
  dataToRender: (state) => state.renderedPodcasts,
  currentPodcast: (state) => state.currentPodcast,
  currentlyPlayingEpisode: (state) => state.currentlyPlayingEpisode,
  subscribed: (state) => state.subscribed,
  newlySubscribedWebsiteUrl: (state) => state.newlySubscribedWebsiteUrl,
};

const actions = {
  render(data) {
    state.renderedPodcasts.length = 0;
    state.renderedPodcasts = data;
  },
  flickerRender() {
    state.currentlyPlayingEpisode = {
      thumbnail: "sample.jpg",
      title: "sample",
      description: "samlple",
      podcast: {
        isSubscribed: false,
        name: "sample",
      },
    };
    console.log("flickered");
  },
  renderDataBeforeSearch() {
    console.log(state.renderedBeforeSearch);
    state.renderedPodcasts = state.renderedBeforeSearch;
  },
  showCurrentlyPlayingPodcast({ commit }) {
    state.currentPodcast = state.currentlyPlayingPodcast;
    document.body.classList.add("showPodcastData");
  },
  updatePlayingEpisode({ commit }, episode) {
    state.currentlyPlayingEpisode = episode;
    state.currentlyPlayingPodcast = state.currentPodcast;
  },
  subscribeToPodcast({ commit }, podcast) {
    podcast["isSubscribed"] = true;
    state.subscribed.push(podcast);
    state.newlySubscribedWebsiteUrl = podcast.website;
    actions.persistSubscriptionsToStorage();
  },
  unSubscribeToPodcast({ commit }, id) {
    console.log(id);
    state.subscribed = state.subscribed.filter(
      (podcast) => podcast.podId != id
    );
    actions.persistSubscriptionsToStorage();
  },
  unSubscribeFromPlayingPod() {
    state.currentlyPlayingEpisode.podcast.isSubscribed = false;
  },
  updateRender({ commit }, { genreIndex, podcastIndex, action, id }) {
    console.log(id);
    if (action === "sub") {
      state.renderedPodcasts[genreIndex].podcasts[podcastIndex][
        "isSubscribed"
      ] = true;
    } else if (action === "unSubscribeFromSubsTab") {
      console.log("unSubscribeFromSubsTab");
      state.renderedPodcasts.forEach((podcast) => {
        if (podcast.podId == id) {
          podcast.isSubscribed = false;
        }
      });
    } else {
      state.renderedPodcasts[genreIndex].podcasts[podcastIndex][
        "isSubscribed"
      ] = false;
    }
  },
  updateSubscriptionAfterFetch() {
    state.renderedPodcasts.forEach((genre) => {
      genre.podcasts.forEach((renderedPod) => {
        state.subscribed.forEach((sub) => {
          if (sub.podId == renderedPod.id) {
            renderedPod["isSubscribed"] = true;
            // console.log(renderedPod.title);
          }
        });
      });
    });
  },
  persistSubscriptionsToStorage() {
    localStorage.setItem(
      "subscribedPodcasts",
      JSON.stringify(state.subscribed)
    );
  },
  loadedSubscribedFromStorage() {
    const subscribed = JSON.parse(localStorage.getItem("subscribedPodcasts"));
    if (subscribed) state.subscribed = subscribed;
  },
  updateSubscriptionStatus(podcasts) {
    podcasts.forEach((podcast) => {
      state.subscribed.forEach((sub) => {
        if (sub.podId === podcast.id) {
          console.log("subscribed");
          console.log(podcast.title);
          podcast["isSubscribed"] = true;
        } else {
          console.log("not subscribed");
          // console.log(podcast.title);
          podcast["isSubscribed"] = false;
        }
        console.log("-----Check Done-----");
      });
    });
    return podcasts;
  },
  searchPodcast({ commit }, query) {
    document.body.classList.add("fetchingInProgress");
    if (!document.body.classList.contains("searchingState")) {
      state.renderedBeforeSearch = [...state.renderedPodcasts];
    }
    console.log("searching for");
    document.body.classList.add("searchingState");
    var config = {
      method: "get",
      url: `https://listen-api.listennotes.com/api/v2/typeahead?q=${query}&show_podcasts=1&show_genres=0&safe_mode=0`,
      headers: {
        "X-ListenAPI-Key": "ebda0a8f7b964787bb9853b6433656f2",
      },
    };

    axios(config)
      .then(function(response) {
        document.body.classList.remove("fetchingInProgress");

        console.log(response.data.podcasts);
        const results = {
          id: Date.now(),
          genre: "Search Results",
          podcasts: response.data.podcasts,
        };
        console.log(results.podcasts);
        results.podcasts.forEach((podcast) => {
          podcast["title"] = podcast.title_original;
        });
        console.log(results);
        const resultArray = [results];
        actions.render(resultArray);
        actions.updateSubscriptionAfterFetch();
      })
      .catch(function(error) {
        document.body.classList.remove("fetchingInProgress");

        console.log(error);
      });
  },
  fetchBestPods() {
    actions.render(state.bestPodcasts);
    const cachedPods = JSON.parse(localStorage.getItem("top"));
    if (!cachedPods) {
      document.body.classList.add("fetchingInProgress");
      const selectedCategories = [
        state.genres[0],
        state.genres[2],
        state.genres[9],
        state.genres[16],
        state.genres[17],
      ];

      selectedCategories.forEach((genre) => {
        const config = {
          method: "get",
          url: `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${genre.id}&page=1&region=us&safe_mode=0`,
          headers: {
            "X-ListenAPI-Key": "ebda0a8f7b964787bb9853b6433656f2",
          },
        };
        axios(config)
          .then(function(response) {
            document.body.classList.remove("fetchingInProgress");

            const data = {
              id: response.data.id,
              genre: response.data.name,
              podcasts: response.data.podcasts,
            };
            state.cache[data.genre] = null;
            state.cache[`${data.genre}`] = data;
            const trimmedDownGenre = {
              id: data.id,
              genre: data.genre,
              podcasts: data.podcasts.splice(0, 3),
            };
            state.bestPodcasts.push(trimmedDownGenre);
            actions.updateSubscriptionAfterFetch();
            if (state.bestPodcasts.length > 4) {
              Cacher.cache(state.bestPodcasts, "top");
            }
          })
          .catch(function(error) {
            document.body.classList.remove("fetchingInProgress");

            console.log(error);
          });
      });
    } else {
      console.log("best from cache");
      cachedPods.forEach((pod) => state.bestPodcasts.push(pod));
      actions.updateSubscriptionAfterFetch();
    }
  },
  fetchCuratedPods() {
    actions.render(state.curated);
    const cachedPods = JSON.parse(localStorage.getItem("curated"));
    if (!cachedPods) {
      document.body.classList.add("fetchingInProgress");
      var config = {
        method: "get",
        url:
          "https://listen-api.listennotes.com/api/v2/curated_podcasts?page=1",
        headers: {
          "X-ListenAPI-Key": "ebda0a8f7b964787bb9853b6433656f2",
        },
      };

      axios(config)
        .then(function(response) {
          document.body.classList.remove("fetchingInProgress");

          console.log(response);
          response.data.curated_lists.forEach((list) => {
            const data = {
              id: list.id,
              genre: list.title,
              podcasts: list.podcasts,
            };
            state.curated.push(data);
            actions.updateSubscriptionAfterFetch();
            Cacher.cache(state.curated, "curated");
          });
        })
        .catch(function(error) {
          document.body.classList.remove("fetchingInProgress");

          console.log(error);
        });
    } else {
      console.log("Curated from cache");
      cachedPods.forEach((pod) => state.curated.push(pod));
      actions.updateSubscriptionAfterFetch();
    }
  },
  fetchByGenre({ commit }, page) {
    console.log(`${window.currentGenreID}`);
    const cachedPods = JSON.parse(localStorage.getItem(window.currentGenreID));
    if (!cachedPods) {
      document.body.classList.add("fetchingInProgress");

      if (page == 1) {
        actions.render(state.currentGenre);
      }
      var config = {
        method: "get",
        url: `https://listen-api.listennotes.com/api/v2/best_podcasts?genre_id=${window.currentGenreID}&page=${page}&region=us&safe_mode=0`,
        headers: {
          "X-ListenAPI-Key": "ebda0a8f7b964787bb9853b6433656f2",
        },
      };

      axios(config)
        .then(function(response) {
          document.body.classList.remove("fetchingInProgress");
          const data = {
            id: response.data.id,
            genre: response.data.name,
            podcasts: response.data.podcasts,
          };
          console.log(data);
          if (page == 1) {
            state.currentGenre.push(data);
            // state.cache[data.genre] = null;
            // state.cache[`${data.genre}`] = data;
          } else {
            // data.podcasts.forEach((newPod) => {
            //   console.log(state.cache[`${data.genre}`].podcasts.push(newPod));
            // });
          }
          actions.updateSubscriptionAfterFetch();
          Cacher.cache(state.currentGenre, window.currentGenreID);
        })
        .catch(function(error) {
          document.body.classList.remove("fetchingInProgress");
          console.log(error);
        });
    } else {
      actions.render(state.currentGenre);
      cachedPods.forEach((pod) => state.currentGenre.push(pod));
      actions.updateSubscriptionAfterFetch();
    }
  },
  fetchPodcastData({ commit }, podcastID, nextEpPubDate) {
    console.log(podcastID);
    document.body.classList.add("fetchingInProgress");
    document.body.classList.add("showPodcastData");

    var config = {
      method: "get",
      url: `https://listen-api.listennotes.com/api/v2/podcasts/${podcastID}?${nextEpPubDate}&sort=recent_first`,
      headers: {
        "X-ListenAPI-Key": "ebda0a8f7b964787bb9853b6433656f2",
      },
    };

    axios(config)
      .then(function(response) {
        document.body.classList.remove("fetchingInProgress");

        console.log(response);
        const podcast = {
          podId: response.data.id,
          name: response.data.title,
          title: response.data.title,
          publisher: response.data.publisher,
          description: response.data.description,
          website:
            response.data.website == null
              ? ""
              : response.data.website.match(/.*\?/)[0],
          thumbnail: response.data.thumbnail,
          episodes: response.data.episodes,
          nextEpisodePubDate: response.data.next_episode_pub_date,
        };
        var isSubscribed = false;
        state.subscribed.forEach((sub) => {
          if (sub.podId == podcast.podId) {
            isSubscribed = true;
          }
        });
        podcast.episodes.forEach((episode) => {
          episode.formattedDuration = timeFormatter(episode.audio_length_sec);
          episode.podcast = {
            name: podcast.title,
            podId: podcast.podId,
            thumbnail: podcast.thumbnail,
            nextEpisodePubDate: podcast.nextEpisodePubDate,
            isSubscribed: isSubscribed,
          };
        });
        state.currentPodcast = podcast;
      })
      .catch(function(error) {
        document.body.classList.remove("fetchingInProgress");
        document
          .querySelector(".loadedPodcast")
          .classList.remove("loadedPodcast");
        console.log(error);
      });
  },
};

function timeFormatter(duration) {
  // Hours, minutes and seconds
  var hrs = ~~(duration / 3600);
  var mins = ~~((duration % 3600) / 60);
  var secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";

  if (hrs > 0) {
    ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}
async function startRssSearch() {
  const webview = document.querySelector("webview");
  webview.addEventListener("dom-ready", () => {
    let currentURL = webview.getURL();
    let titlePage = webview.getTitle();
    console.log("currentURL is : " + currentURL);
    console.log("titlePage is : " + titlePage);

    webview
      .executeJavaScript(
        `function gethtml () {
    return new Promise((resolve, reject) => { resolve(document.documentElement.innerHTML); });
    }
    gethtml();`
      )
      .then((html) => {
        extractLinks(html);
      });
  });
}

function extractLinks(html) {
  const $ = cheerio.load(html);
  $("a").each((i, element) => {
    const link = $(element).attr("href");
    if (link.includes("rss") || link.includes("feed")) {
      console.log(link);
    }
  });
}
const Cacher = {
  cache: (data, type) => {
    localStorage.setItem(type, JSON.stringify(data));
  },
  fetchFromCache: () => {},
  indexCache: () => {},
};

const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations,
};
