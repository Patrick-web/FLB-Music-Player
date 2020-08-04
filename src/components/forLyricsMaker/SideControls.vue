<template>
  <div class="lyricsSideControls">
    <div class="switchBg">
      <TabSwitch />
    </div>
    <div class="views">
      <div class="view loaded_view">
        <SnippetCard
          v-for="snippet in snippets"
          :key="snippet.id"
          :snippet="snippet"
        />
      </div>
      <div class="view created_view">
        <SnippetCard />
      </div>
    </div>
  </div>
</template>

<script>
import SnippetCard from "./SnippetCard";
import TabSwitch from "./TabSwitch";
export default {
  components: {
    SnippetCard,
    TabSwitch,
  },
  data() {
    return {
      snippets: [
        {
          id: 1,
          text:
            "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui  necessitatibus natus quae numquam cumque minus?",
        },
        {
          id: 2,
          text:
            "Lorem, something 2 dolor sit amet consectetur adipisicing elit. Qui  necessitatibus natus quae numquam cumque minus?",
        },
        {
          id: 3,
          text:
            "Lorem, another thing 3 sit amet consectetur adipisicing elit. Qui  necessitatibus natus quae numquam cumque minus?",
        },
        {
          id: 4,
          text:
            "Lorem, the last one 4 consectetur adipisicing elit. Qui  necessitatibus natus quae numquam cumque minus?",
        },
      ],
    };
  },
};
</script>

<style lang="scss">
.lyricsSideControls {
  height: 100%;
  width: 300px;
  position: absolute;
  right: 0%;
  background: var(--dark_magenta);
  overflow: hidden;
}
.switchBg {
  background: var(--dark_magenta);
  padding-bottom: 5px;
  padding-top: 5px;
  box-shadow: 0px 10px 8px rgba(0, 0, 0, 0.199);
  position: relative;
  z-index: 3;
}
.active_created {
  .views {
    transform: translateX(-50%);
  }
}
.views {
  overflow: hidden;
  display: flex;
  width: 200%;
  transform: translateX(0);
  transition: 0.3s ease;
}
.view {
  width: 100%;
  overflow-y: scroll;
  height: 90vh;
}
.loaded_view {
}
</style>
