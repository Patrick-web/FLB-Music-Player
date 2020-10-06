<template>
  <div class="menu-lyrics">
    <div class="menuItem">
      <img src="@/assets/file.svg" alt="" />
      <h4 style="width: 140px;" class="tooltip">Add Lyrics File</h4>
    </div>
    <div class="menuItem">
      <img src="@/assets/add.svg" alt="" />
      <h4 class="tooltip">Create Snippet</h4>
    </div>
    <div class="menuItem">
      <img src="@/assets/file-audio.svg" alt="" />
      <h4 style="width: 150px;" class="tooltip">Select Audio File</h4>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.menu-lyrics {
  position: absolute;
  left: 10px;
  top: 50%;
  height: 40%;
  width: 50px;
  transform: translateY(-50%);
  background: var(--light_magenta);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.menuItem {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  position: relative;
  img {
    width: 90%;
  }
}
.tooltip {
  position: absolute;
  top: 50%;
  right: -10%;
  transform: scale(0) translate(100%, -50%);
  width: 140px;
  background: rgb(131, 30, 131);
  padding: 5px;
  padding-left: 10px;
  border-radius: 20px;
  font-size: 1.2em;
}
.menuItem:hover {
  cursor: pointer;
  background: rgba(0, 0, 0, 0.459);
  .tooltip {
    transform: scale(1) translate(100%, -50%);
  }
}
</style>
