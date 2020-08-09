<template>
  <div class="playingPane">
    <div class="grid2">
      <p>Playing</p>
      <div class="podDownBt">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          style="isolation:isolate"
          viewBox="21.735 855 80 80"
          width="80pt"
          height="80pt"
          id="downloadBt"
        >
          <path
            d=" M 55.485 855 L 67.985 855 C 70.064 855 71.735 856.672 71.735 858.75 L 71.735 885 L 85.439 885 C 88.22 885 89.61 888.359 87.642 890.328 L 63.876 914.109 C 62.704 915.281 60.782 915.281 59.61 914.109 L 35.814 890.328 C 33.845 888.359 35.235 885 38.017 885 L 51.735 885 L 51.735 858.75 C 51.735 856.672 53.407 855 55.485 855 Z  M 101.735 913.75 L 101.735 931.25 C 101.735 933.328 100.064 935 97.985 935 L 25.485 935 C 23.407 935 21.735 933.328 21.735 931.25 L 21.735 913.75 C 21.735 911.672 23.407 910 25.485 910 L 48.407 910 L 56.064 917.656 C 59.204 920.797 64.267 920.797 67.407 917.656 L 75.064 910 L 97.985 910 C 100.064 910 101.735 911.672 101.735 913.75 Z  M 82.36 927.5 C 82.36 925.781 80.954 924.375 79.235 924.375 C 77.517 924.375 76.11 925.781 76.11 927.5 C 76.11 929.219 77.517 930.625 79.235 930.625 C 80.954 930.625 82.36 929.219 82.36 927.5 Z  M 92.36 927.5 C 92.36 925.781 90.954 924.375 89.235 924.375 C 87.517 924.375 86.11 925.781 86.11 927.5 C 86.11 929.219 87.517 930.625 89.235 930.625 C 90.954 930.625 92.36 929.219 92.36 927.5 Z "
            fill="rgb(255,0,255)"
          />
        </svg>
      </div>
    </div>
    <div class="content">
      <div class="logoArea"></div>
      <h4 id="playing-episode">Episode Lorem ipsum dolor sit amet. Name</h4>
      <h6 id="playing-podName">Podcast Name</h6>
      <br />
      <h3>Show Notes</h3>
      <p class="showNotes">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Rem aperiam
        odit atque iste. Repellat obcaecati illum eaque iste aspernatur esse
        tempora. Distinctio, incidunt maiores voluptates nihil sint molestias
        deserunt optio obcaecati animi non suscipit repellat saepe consectetur
        amet consequatur veniam modi. Itaque similique aperiam, temporibus saepe
        voluptatibus exercitationem in facilis. Lorem ipsum dolor sit amet,
        consectetur adipisicing elit. Eius quia nemo reprehenderit iste, dolorum
        velit eveniet at soluta asperiores molestiae adipisci iure possimus
        quod, quas illo, tempora sunt nam omnis? Lorem ipsum dolor sit amet
        consectetur adipisicing elit. Earum porro debitis perspiciatis quis quia
        harum. Nulla quaerat magnam necessitatibus? Aperiam accusamus quidem
        quisquam! Amet eveniet laboriosam accusamus architecto fugiat nostrum?
      </p>
    </div>
    <button id="subBt">Subscribed</button>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.playingPane {
  position: relative;
  height: 100vh;
  // min-width: 500px;
  #playing-episode {
    font-size: 1.2rem;
    font-weight: 700;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  #playing-podName {
    font-size: 1rem;
    font-weight: 400;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  #subBt {
    color: white;
    background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.3);
    border: none;
    padding: 5px;
    font-weight: 600;
    font-size: 1.25rem;
    width: 80%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 5px;
    transition: 0.2s ease;
    border-radius: 10px;
  }
  #subBt:hover {
    cursor: pointer;
    background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.4);
    border-radius: 10px;
  }
}
.grid2 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  max-width: 100%;
  padding-right: 10px;
  padding-left: 10px;
  p {
    color: rgb(var(--base-one), var(--base-two), var(--base-three));
    font-size: 1.3em;
    font-weight: 700;
  }
  .podDownBt {
    background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.15);
    border-radius: 20%;
    padding: 8px;
    #downloadBt {
      width: 20px;
      height: 20px;
    }
  }
  .podDownBt:hover {
    cursor: pointer;
    background: rgba(var(--base-one), var(--base-two), var(--base-three), 0.25);
  }
}
.content {
  padding: 10px;
  .logoArea {
    width: 80%;
    height: 200px;
    background: white;
    color: white;
    margin: auto;
    margin-bottom: 20px;
  }
  .showNotes {
    font-weight: 300;
    max-height: 300px;
    overflow-y: scroll;
    padding-right: 5px;
  }
}
</style>
