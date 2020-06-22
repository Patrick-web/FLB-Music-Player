<template>
  <div class="notificationDiv">
    <div class="not-title">Error</div>
    <div class="not-body">Error in saving Mix</div>
    <div @click="dismiss" class="dismiss">OK</div>
  </div>
</template>

<script>
export default {
  methods: {
    dismiss() {
      document.querySelector(".innerBar").height = "0%";
      document.body.classList.remove("notifyUser");
      if (document.body.classList.contains("showInformer")) {
        document.body.classList.remove("showInformer");
      }
      if (document.body.classList.contains("hideInformerBody")) {
        document.body.classList.remove("hideInformerBody");
      }
    },
  },
};
</script>

<style lang="scss">
.success-notification {
  .notificationDiv {
    background: #057550;
    .not-title {
      background: #00b578;
    }
    .dismiss {
      background: #00b578;
    }
  }
}
.error-notification {
  .notificationDiv {
    background: #790026;
    .not-title {
      background: #ff0051;
    }
    .dismiss {
      background: #ff0051;
    }
  }
}
.notifyUser {
  .notificationDiv {
    top: 50%;
  }
}
.notificationDiv {
  width: 300px;
  border-radius: 15px 15px 20px 20px;
  overflow: hidden;
  background: #057550;
  color: white;
  position: fixed;
  top: 150%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 15;
  transition: 0.1s ease-in;
  .not-title {
    width: 100%;
    background: #00b578;
    font-weight: 800;
    font-size: 1.4em;
    padding-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }
  .not-body {
    font-weight: 300;
    font-size: 1.3em;
  }
  .dismiss {
    background: #00b578;
    border-radius: 40px;
    font-weight: 500;
    width: 90%;
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
    padding-top: 2px;
    padding-bottom: 2px;
    font-size: 1.4em;
    transition: 0.2s ease;
  }
  .dismiss:hover {
    cursor: pointer;
    border-radius: 6px;
  }
}
</style>
