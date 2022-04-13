<template>
  <div id="app">
    <div>
      <div class="nav">Microsoft Graph API</div>
      <ul class="api-list">
        <li class="api-item">
          <div class="title">ONEDRIVE</div>
          <input type="file" ref="file" />
          <button @click="uploadLarge">上传</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { client, OneDrive } from "./libs/msla";

export default {
  name: "OneDrive",
  methods: {
    async upload() {
      let onedrive = new OneDrive(client);
      let input = this.$refs.file;
      let root = await onedrive.getMyDriveRootInfo();
      if (input.files != undefined) {
        let file = input.files[0];
        await onedrive.putMyDriveSmallFile(root.id, file);
      }
    },
    async uploadLarge() {
      let onedrive = new OneDrive(client)
      let input = this.$refs.file;
      let root = await onedrive.getMyDriveRootInfo();
      if (input.files != undefined) {
        let file = input.files[0];
        await onedrive.putMyDriveLargeFile(root.id, file, "rename");
      }
    },
  },
};
</script>



<style>
body {
    margin: 0;
    padding: 0;
}
ul,
li {
    list-style: none;
    margin: 0;
    padding: 0;
}
</style>

<style lang="scss" scoped>
.nav {
    height: 50px;
    width: 100%;
    display: flex;
    padding-left: 20px;
    justify-content: flex-start;
    align-items: center;
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    background: #303952;
}
.api-list {
    .api-item {
        .title {
            background: #596275;
            padding: 10px;
            padding-left: 20px;
            color: white;
        }
    }
}
</style>
