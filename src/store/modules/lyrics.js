const state = {
  trackPosition: 0,
  snippets: [],
};

const getters = {
  getTrackPosition: (state) => state.trackPosition,
  snippets: (state) => state.snippets,
};

const actions = {
  updateTrackPosition({ commit }, newPosition) {
    commit("updateTrackPosition", newPosition);
  },
  updateSnippet(state, data) {
    state.snippets[data.index].position = data.position;
    state.snippets[data.index].width = data.width;
  },
  addSnippet({ commit }, snippet) {
    commit("addSnippet", snippet);
  },
};

const mutations = {
  updateTrackPosition(state, newPosition) {
    state.trackPosition = newPosition;
  },
  updateSnippet(state, data) {
    state.snippets[data.index].position = data.position;
    state.snippets[data.index].width = data.width;
  },
  addSnippet(state, snippet) {
    snippet.position = state.trackPosition;
    state.snippets.unshift(snippet);
    renderAtDefinedPosition(snippet.id);
  },
  deleteSnippet(state, index) {
    state.snippets.filter(index, 1);
  },
};

function renderAtDefinedPosition(id) {
  const snippetsCopy = [...state.snippets];
  const newSnippetBlock = document.querySelector(".snippetBlock");
  console.log("First snipet is ");
  console.log(newSnippetBlock);
  // const targetSnippet = snippetsCopy.filter((snippet) => (snippet.id = id));
  // console.log("Snippet" + targetSnippet);
}

export default {
  state,
  getters,
  actions,
  mutations,
};
