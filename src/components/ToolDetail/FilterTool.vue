<template>
  <div class="tool-container">
    <v-btn color="primary" variant="flat" append-icon="mdi-restore" @click="resetWindow"
      >Reset</v-btn
    >
    <v-divider></v-divider>
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-card hover class="mx-auto" @click="changeFilter('bluescale')">
          <v-img
            src="../../assets/bluescale.png"
            height="100px"
            cover
          ></v-img>
          <v-card-text class="text-center"> Bluescale </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card hover class="mx-auto" @click="changeFilter('coral')">
          <v-img
            src="../../assets/coral.png"
            height="100px"
            cover
          ></v-img>
          <v-card-text class="text-center"> Coral </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card hover class="mx-auto" @click="changeFilter('crimson')">
          <v-img
            src="../../assets/crimson.png"
            height="100px"
            cover
          ></v-img>
          <v-card-text class="text-center"> Crimson </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card hover class="mx-auto" @click="changeFilter('darkify')">
          <v-img
            src="../../assets/darkify.png"
            height="100px"
            cover
          ></v-img>
          <v-card-text class="text-center"> Darkify </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card hover class="mx-auto" @click="changeFilter('eclectic')">
          <v-img
            src="../../assets/eclectic.png"
            height="100px"
            cover
          ></v-img>
          <v-card-text class="text-center"> Eclectic </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card hover class="mx-auto" @click="changeFilter('extra_offset_red')">
          <v-img
            src="../../assets/extra_offset_red.png"
            height="100px"
            cover
          ></v-img>
          <v-card-text class="text-center"> Extra offset red </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card hover class="mx-auto" @click="changeFilter('ocean')">
          <v-img
            src="../../assets/ocean.png"
            height="100px"
            cover
          ></v-img>
          <v-card-text class="text-center"> Ocean </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card hover class="mx-auto" @click="changeFilter('pixel_blue')">
          <v-img
            src="../../assets/pixel_blue.png"
            height="100px"
            cover
          ></v-img>
          <v-card-text class="text-center"> Pixel_blue </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card hover class="mx-auto" @click="changeFilter('retroviolet')">
          <v-img
            src="../../assets/retroviolet.png"
            height="100px"
            cover
          ></v-img>
          <v-card-text class="text-center"> Retroviolet </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card hover class="mx-auto" @click="changeFilter('serenity')">
          <v-img
            src="../../assets/serenity.png"
            height="100px"
            cover
          ></v-img>
          <v-card-text class="text-center"> Serenity </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card hover class="mx-auto" @click="changeFilter('specks_redscale')">
          <v-img
            src="../../assets/specks_redscale.png"
            height="100px"
            cover
          ></v-img>
          <v-card-text class="text-center"> Specks redscale </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6">
        <v-card hover class="mx-auto" @click="changeFilter('wood')">
          <v-img
            src="../../assets/wood.png"
            height="100px"
            cover
          ></v-img>
          <v-card-text class="text-center"> Wood </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <canvas id="canvasFilter" style="display: none;" ref="canvasFilter"></canvas>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
export default {
  methods: {
    changeFilter(filter) {
      this.$emitter.emit("changeFilter", filter);
    },
    resetWindow() {
      const canvasFilter = this.$refs.canvasFilter;
      const context = canvasFilter.getContext("2d", {
        willReadFrequently: true,
      });
      const img = new Image();

      img.src = useAppStore().selectedImage;

      img.onload = () => {
        const width = img.width;
        const height = img.height;
        canvasFilter.width = width;
        canvasFilter.height = height;
        context.drawImage(img, 0, 0, width, height);
        this.$emitter.emit("changeFilter");
      };
    },
  },
  mounted() {
    this.resetWindow();
  },
};
</script>
