<template>
  <div>
    <div class="d-flex headbar">
      <div>
        <v-tooltip text="Undo" location="bottom">
          <template v-slot:activator="{ props }">
            <v-icon
              color="grey-darken-2"
              v-bind="props"
              icon="mdi-undo"
            ></v-icon>
          </template>
        </v-tooltip>
        <v-tooltip text="Redo" location="bottom">
          <template v-slot:activator="{ props }">
            <v-icon
              color="grey-darken-2"
              v-bind="props"
              icon="mdi-redo"
            ></v-icon>
          </template>
        </v-tooltip>
      </div>
      <div v-if="editmode !== 'file'">
        <v-tooltip text="Cancel" location="bottom">
          <template v-slot:activator="{ props }">
            <v-icon
              color="grey-darken-2"
              v-bind="props"
              icon="mdi-cancel"
              @click="cancel"
            ></v-icon>
          </template>
        </v-tooltip>
        <v-tooltip text="Agree" location="bottom">
          <template v-slot:activator="{ props }">
            <v-icon
              color="grey-darken-2"
              v-bind="props"
              icon="mdi-check-circle-outline"
              @click="applyChange"
            ></v-icon>
          </template>
        </v-tooltip>
      </div>
      <div>
        <v-tooltip text="Zoom in" location="bottom">
          <template v-slot:activator="{ props }">
            <v-icon
              color="grey-darken-2"
              v-bind="props"
              icon="mdi-magnify-plus"
            ></v-icon>
          </template>
        </v-tooltip>
        <v-tooltip text="Zoom out" location="bottom">
          <template v-slot:activator="{ props }">
            <v-icon
              color="grey-darken-2"
              v-bind="props"
              icon="mdi-magnify-minus"
            ></v-icon>
          </template>
        </v-tooltip>
      </div>
    </div>
    <v-divider></v-divider>
    <div class="image-container">
      <template v-if="selectedImage">
        <canvas
          v-if="editmode === 'basic'"
          class="image-view"
          ref="canvasOutput"
          id="canvasOutput"
        ></canvas>
        <vue-cropper
          v-else-if="editmode === 'transform'"
          ref="cropper"
          :src="selectedImage"
          alt="Source Image"
          class="image-view"
          :autoCropArea="1"
          :background="false"
          :viewMode="1"
        />
        <canvas
          v-else-if="editmode === 'filter'"
          class="image-view"
          ref="canvasFilterOut"
          id="canvasFilterOut"
        ></canvas>
        <v-img v-else :src="selectedImage"></v-img>
      </template>
    </div>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";

export default {
  data() {
    return {};
  },
  created() {
    this.$emitter.on("rotate", (deg) => {
      this.$refs.cropper.rotate(deg);
    });
    this.$emitter.on("flipHorizontal", () => {
      this.$refs.cropper.scaleX(-this.$refs.cropper.getData().scaleX);
    });
    this.$emitter.on("flipVertical", () => {
      this.$refs.cropper.scaleY(-this.$refs.cropper.getData().scaleY);
    });
    this.$emitter.on("setAspectRatio", (aspectRatio) => {
      this.$refs.cropper.setAspectRatio(aspectRatio);
    });
    this.$emitter.on("reset", () => {
      this.$refs.cropper.reset();
    });
    this.$emitter.on("changeFilter", (filter) => {
      const canvasFilterOut = this.$refs.canvasFilterOut;
      const contextMain = canvasFilterOut.getContext("2d");

      const canvas = document.getElementById("canvasFilter");
      const context = canvas.getContext("2d");
      const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
      canvasFilterOut.width = canvas.width;
      canvasFilterOut.height = canvas.height;

      if (!filter) {
        contextMain.putImageData(imgData, 0, 0);
      } else {
        const newImgData = pixelsJS.filterImgData(imgData, filter);
        contextMain.putImageData(newImgData, 0, 0);
      }
    });
    this.$emitter.on("setCropBoxData", (top, left, width, height) => {
      const temp = {
        x: parseInt(left),
        y: parseInt(top),
        width: parseInt(width),
        height: parseInt(height),
      };
      this.$refs.cropper.setData(temp);
    });
  },
  methods: {
    cancel() {
      this.$emitter.emit("cancel");
    },
    applyChange() {
      if (this.editmode == "transform") {
        useAppStore().selectedImage = this.$refs.cropper
          .getCroppedCanvas()
          .toDataURL();
      } else if (this.editmode == "basic") {
        useAppStore().selectedImage =
          this.$refs.canvasOutput.toDataURL("image/png");
      } else if (this.editmode == "filter") {
        useAppStore().selectedImage =
          this.$refs.canvasFilterOut.toDataURL("image/png");
      }
      this.$toast.success("Apply Change Successfully!");
    },
  },
  computed: {
    selectedImage() {
      return useAppStore().selectedImage;
    },
    editmode() {
      return useAppStore().transformMode;
    },
  },
  components: {
    VueCropper,
  },
};
</script>
