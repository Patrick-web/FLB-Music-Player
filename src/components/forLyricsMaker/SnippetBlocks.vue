<template>
  <div class="snippetBlocks">
    <div
      @click="selectBlock($event)"
      v-for="snippet in snippets"
      :key="snippet.id"
      class="snippetBlock"
    >
      <div v-on:drag="moveBlock($event)" class="invisible">
        <!-- <p>{{ snippet.text }}</p> -->
        <!-- <div v-on:drag.stop="resize($event)" class="dragger left_dragger"></div> -->
        <div v-on:drag.stop="resize($event)" class="dragger right_dragger"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import interact from "interactjs";
export default {
  data() {
    return {
      blockPosition: false
    };
  },
  computed: mapGetters(["snippets"]),
  methods: {
    initInteract(selector) {
      interact(selector)
        .resizable({
          edges: {
            top: false, // Use pointer coords to check for resize.
            left: ".resize-left", // Disable resizing from left edge.
            bottom: false, // Resize if pointer target matches selector
            right: ".resize-right" // Resize if pointer target is the given Element
          }
        })
        .draggable({
          // enable inertial throwing
          inertia: false,
          // keep the element within the area of it's parent
          restrict: {
            restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
          },
          // enable autoScroll
          autoScroll: true,

          // call this function on every dragmove event
          onmove: this.dragMoveListener,
          // call this function on every dragend event
          onend: this.onDragEnd
        });
    },
    selectBlock(e) {},
    resize(e) {
      const dragger = e.target;
      const clientX = e.clientX;
      const snippetBlock = dragger.parentElement.parentElement;
      const startX = snippetBlock.getBoundingClientRect().x;
      if (dragger.classList.contains("right_dragger")) {
        this.resizeRight(startX, snippetBlock, clientX);
      }
    },
    resizeRight(startX, snippetBlock, clientX) {
      const width = clientX - startX;
      if (width > -1 && width > 5) {
        snippetBlock.style.width = width + "px";
      }
    },
    moveBlock(e) {
      var img = new Image();
      e.dataTransfer.setDragImage(img, 0, 0);
      const block = e.currentTarget.parentElement;
      if (!this.blockPosition) {
        this.blockPosition = block.getBoundingClientRect().x;
      }
      const xPos = e.clientX - this.blockPosition;
      if (xPos > -1) {
        block.style.left = xPos + "px";
      }
    }
  },
  created() {}
};
</script>

<style lang="scss">
.snippetBlocks {
  height: 60px;
  max-width: 900px;
  background: purple;
  position: relative;
  overflow-x: scroll;

  .snippetBlock {
    background: var(--dim_magenta);
    width: 25px;
    height: 100%;
    cursor: pointer;
    // transform: scaleX(50);
    position: absolute;
    touch-action: none;
    user-select: none;
    .invisible {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      position: relative;
    }
    p {
      width: 105px;
      padding: 5px;
      border-radius: 10px;
      background: var(--dark_magenta);
      // height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 300;
      color: white;
      user-select: none;
      pointer-events: none;
      position: absolute;
      opacity: 0;
      top: 100%;
      left: 50%;
      transform: translate(-50%, -120%);
      font-size: 0.8em;
      pointer-events: none;
      transition: 0.2s ease;
    }
  }
}
.snippetBlock:hover {
  p {
    top: 0%;
    opacity: 1;
  }
}
.dragger {
  height: 100%;
  width: 5px;
  // background: yellow;
  position: absolute;
  opacity: 0.5;
  z-index: 3;
}
.dragger:hover {
  cursor: col-resize;
}
.left_dragger {
  left: 0%;
  transform: translateX(-50%);
}
.right_dragger {
  right: 0%;
  transform: translateX(50%);
}
</style>
