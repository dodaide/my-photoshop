<template>
  <div class="tool-container">
    <v-btn
      color="primary"
      variant="flat"
      append-icon="mdi-restore"
      @click="resetValues"
      >Reset</v-btn
    >
    <v-divider></v-divider>
    <v-row no-gutters>
      <v-col cols="12" sm="12">
        <div class="text-caption">Brightness</div>
        <v-slider
          color="primary"
          :max="100"
          :min="-100"
          v-model.lazy="brightness"
          thumb-label
        ></v-slider>
      </v-col>
      <v-col cols="12" sm="12">
        <div class="text-caption">Contrast</div>
        <v-slider
          color="primary"
          :max="2"
          :min="0.1"
          v-model.lazy="contrast"
          thumb-label
        ></v-slider>
      </v-col>
      <v-col cols="12" sm="12">
        <div class="text-caption">Blur</div>
        <v-slider
          color="primary"
          :max="15"
          :min="1"
          v-model.lazy="blur"
          thumb-label
        ></v-slider>
      </v-col>
      <v-col cols="12" sm="12">
        <div class="text-caption">Sharpen</div>
        <v-slider
          color="primary"
          :max="10"
          :min="-10"
          v-model.lazy="sharp"
          thumb-label
        ></v-slider>
      </v-col>
      <v-col cols="12" sm="12">
        <div class="text-caption">Temperature</div>
        <v-slider
          color="primary"
          :max="100"
          :min="-100"
          v-model.lazy="temperature"
          thumb-label
        ></v-slider>
      </v-col>
      <v-col cols="12" sm="12">
        <div class="text-caption">Gamma</div>
        <v-slider
          color="primary"
          :max="2"
          :min="0.1"
          v-model.lazy="gamma"
          thumb-label
        ></v-slider>
      </v-col>
    </v-row>
    <canvas id="canvasInput" style="display: none" ref="canvasInput"></canvas>
  </div>
</template>

<script>
import { useAppStore } from "@/store/app";
export default {
  data() {
    return {
      brightness: 0,
      contrast: 1,
      blur: 1,
      sharp: 0,
      temperature: 0,
      gamma: 1,
    };
  },
  mounted() {
    const canvasInput = this.$refs.canvasInput;
    const ctx = canvasInput.getContext("2d", { willReadFrequently: true });
    const img = new Image();

    img.src = useAppStore().selectedImage;

    img.onload = () => {
      const width = img.width;
      const height = img.height;
      canvasInput.width = width;
      canvasInput.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      this.adjustImage();
    };
  },
  methods: {
    resetValues() {
      this.brightness = 0;
      this.contrast = 1;
      this.blur = 1;
      this.sharp = 0;
      this.temperature = 0;
      this.gamma = 1;
      this.adjustImage();
    },

    adjustContrastColor(image, alpha) {
      const result = new this.$cv.Mat();
      const channels = new this.$cv.MatVector();
      const adjustedChannels = new this.$cv.MatVector();

      this.$cv.split(image, channels);

      for (let i = 0; i < channels.size(); i++) {
        const channel = channels.get(i);
        const adjustedChannel = new this.$cv.Mat();
        channel.convertTo(adjustedChannel, -1, alpha, 0);
        adjustedChannels.push_back(adjustedChannel);
      }

      this.$cv.merge(adjustedChannels, result);

      return result;
    },

    adjustBrightnessColor(image, beta) {
      const result = new this.$cv.Mat();
      const channels = new this.$cv.MatVector();
      const adjustedChannels = new this.$cv.MatVector();

      this.$cv.split(image, channels);

      for (let i = 0; i < channels.size(); i++) {
        const channel = channels.get(i);
        const adjustedChannel = new this.$cv.Mat();
        channel.convertTo(adjustedChannel, -1, 1, beta);
        adjustedChannels.push_back(adjustedChannel);
      }

      this.$cv.merge(adjustedChannels, result);

      return result;
    },

    blurImage() {
      const filterSize = this.blur;
      const src = this.$cv.imread("canvasOutput");
      const dst = new this.$cv.Mat();
      const ksize = new this.$cv.Size(filterSize, filterSize);
      this.$cv.GaussianBlur(src, dst, ksize, 0, 0, this.$cv.BORDER_DEFAULT);
      this.$cv.imshow("canvasOutput", dst);
      src.delete();
      dst.delete();
    },

    adjustGamma(src, gamma) {
      const result = new this.$cv.Mat();
      src.convertTo(result, this.$cv.CV_32F);
      result.convertTo(result, -1, 1 / 255);
      this.$cv.pow(result, gamma, result);
      result.convertTo(result, -1, 255);
      result.convertTo(result, this.$cv.CV_8U);
      return result;
    },

    adjustTemperature(src, temperature) {
      const result = src.clone();
      for (let y = 0; y < src.rows; y++) {
        for (let x = 0; x < src.cols; x++) {
          const pixel = result.ptr(y, x);
          pixel[0] = Math.min(255, Math.max(0, pixel[0] + temperature));
          pixel[2] = Math.min(255, Math.max(0, pixel[2] - temperature));
        }
      }
      return result;
    },

    adjustSharpness(src, sharpness) {
      const result = src.clone();
      const kdata = [-1, -1, -1, -1, 8 + sharpness, -1, -1, -1, -1];
      const M = this.$cv.matFromArray(3, 3, this.$cv.CV_32F, kdata);
      this.$cv.filter2D(src, result, this.$cv.CV_8U, M);
      return result;
    },

    unsharpMask(src, sigma, strength) {
      const blurred = new this.$cv.Mat();
      this.$cv.GaussianBlur(
        src,
        blurred,
        new this.$cv.Size(),
        sigma,
        sigma,
        this.$cv.BORDER_DEFAULT
      );

      const result = new this.$cv.Mat();
      this.$cv.addWeighted(src, 1.0 + strength, blurred, -strength, 0, result);

      blurred.delete();
      return result;
    },

    adjustImage() {
      // Lấy giá trị từ các slider
      const alpha = parseFloat(this.contrast);
      const beta = parseFloat(this.brightness);
      const gamaScale = parseFloat(this.gamma);
      const temperatureRange = parseFloat(this.temperature);
      const sharpnessRange = parseFloat(this.sharp);

      // Xử lý ảnh với các giá trị được chọn
      const src = this.$cv.imread("canvasInput");
      const adjusted = this.adjustContrastColor(src, alpha);
      const adjustedBrightness = this.adjustBrightnessColor(adjusted, beta);

      const adjustedGamma = this.adjustGamma(adjustedBrightness, gamaScale);
      const adjustedTemperature = this.adjustTemperature(
        adjustedGamma,
        temperatureRange
      );
      const finalResult = this.unsharpMask(
        adjustedTemperature,
        3,
        sharpnessRange
      );

      this.$cv.imshow("canvasOutput", finalResult);
      src.delete();
      adjusted.delete();
      adjustedBrightness.delete();
      adjustedGamma.delete();
      adjustedTemperature.delete();
      finalResult.delete();
    },
  },
  watch: {
    brightness() {
      this.adjustImage();
    },
    contrast() {
      this.adjustImage();
    },
    blur() {
      this.blurImage();
    },
    sharp() {
      this.adjustImage();
    },
    temperature() {
      this.adjustImage();
    },
    gamma() {
      this.adjustImage();
    },
  },
};
</script>
