<template>
  <vue-particles
    :particleOpacity="0.5"
    :particleSize="3"
    :particlesNumber="30"
    color="#FF0050"
    class="particle-js"
    :lineLinked="true"
    linesColor="#dedede"
    :linesWidth="1"
    :lineOpacity="0.2"
    :linesDistance="200"
    :moveSpeed="5"
    :hoverEffect="false"
    :clickEffect="false"
  ></vue-particles>
</template>

<script>
export default {};
</script>

<style>
.bg {
  color: rgb(255, 0, 255);
}
</style>
