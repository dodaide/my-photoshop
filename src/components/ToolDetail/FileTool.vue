<template>
  <div class="tool-container">
    <v-btn color="primary" @click="openFileInput" variant="flat">Upload</v-btn>
    <input
      ref="fileInput"
      accept="image/*"
      type="file"
      style="display: none"
      @change="handleFileChange"
    />
    <v-btn color="success" @click="downloadImage" variant="flat">Save</v-btn>
    <v-dialog width="360">
  <template v-slot:activator="{ props }">
    <v-btn v-bind="props" color="warning" variant="flat">Close</v-btn>
  </template>

  <template v-slot:default="{ isActive }">
    <v-card title="Warning">
      <v-card-text>
        Leaving now will lose your changes. Do you want to leave?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Disagree"
          variant="text"
          color="primary"
          @click="isActive.value = false"
        ></v-btn>
        <v-btn
          text="Agree"
          variant="flat"
          color="primary"
          @click="closeImage();isActive.value = false"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </template>
</v-dialog>
  </div>

  
</template>

<script>
import { useAppStore } from '@/store/app';

export default {
  data() {
    return {
    };
  },
  methods: {
    openFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        useAppStore().selectedImage = URL.createObjectURL(file);
      }
    },
    downloadImage() {
      const selectedImage = useAppStore().selectedImage;
      const link = document.createElement("a");
      link.href = selectedImage;
      const originalFileName = selectedImage.split("/").pop();
      link.download = `MyPhotoshop_${originalFileName}`;
      link.click();
    },
    closeImage() {
      useAppStore().selectedImage = null;
      const fileInput = this.$refs.fileInput;
      fileInput.value = null;
    },
  },
};
</script>
