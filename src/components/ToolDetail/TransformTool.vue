<template>
  <div class="tool-container">
    <v-btn
      color="primary"
      variant="flat"
      append-icon="mdi-restore"
      @click="resetImage"
      >Reset</v-btn
    >
    <v-divider></v-divider>
    <div>
      <div class="text-h6">Crop size</div>
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-text-field
            color="primary"
            label="Top"
            type="number"
            v-model.lazy="top"
            variant="underlined"
            suffix="px"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            color="primary"
            label="Left"
            v-model.lazy="left"
            type="number"
            variant="underlined"
            suffix="px"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            color="primary"
            label="Width"
            type="number"
            v-model.lazy="width"
            variant="underlined"
            suffix="px"
            hide-details="auto"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            color="primary"
            label="Height"
            v-model.lazy="height"
            type="number"
            variant="underlined"
            suffix="px"
            hide-details="auto"
          ></v-text-field>
        </v-col>
      </v-row>
    </div>
    <div>
      <div class="text-h6">Resolution</div>
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-btn
            block
            color="primary"
            @click="changeAspectRatio(NaN)"
            variant="tonal"
          >
            Custom
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn
            block
            color="primary"
            @click="changeAspectRatio(1 / 1)"
            variant="tonal"
          >
            1:1
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn
            block
            color="primary"
            @click="changeAspectRatio(4 / 3)"
            variant="tonal"
          >
            4:3
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn
            block
            color="primary"
            @click="changeAspectRatio(16 / 9)"
            variant="tonal"
          >
            16:9
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn
            block
            color="primary"
            @click="changeAspectRatio(3 / 4)"
            variant="tonal"
          >
            3:4
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn
            block
            color="primary"
            @click="changeAspectRatio(9 / 16)"
            variant="tonal"
          >
            9:16
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <v-divider></v-divider>
    <div>
      <div class="text-h6">Rotate</div>
      <v-text-field
        color="primary"
        model-value="0"
        variant="filled"
        suffix="deg"
        hide-details="auto"
        type="number"
        v-model.lazy="rotateValue"
      ></v-text-field>
    </div>
    <v-divider></v-divider>
    <div>
      <div class="text-h6">Flip</div>
      <v-row dense>
        <v-col cols="12" sm="6">
          <v-btn
            block
            color="primary"
            variant="tonal"
            append-icon="mdi-flip-horizontal"
            @click="flipHorizontal"
          >
          </v-btn>
        </v-col>
        <v-col cols="12" sm="6">
          <v-btn
            block
            color="primary"
            variant="tonal"
            append-icon="mdi-flip-vertical"
            @click="flipVertical"
          >
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rotateValue: 0,
      width: 0,
      height: 0,
      top: 0,
      left: 0,
    };
  },
  methods: {
    changeAspectRatio(ratio) {
      this.$emitter.emit("setAspectRatio", ratio);
    },
    flipHorizontal() {
      this.$emitter.emit("flipHorizontal");
    },
    flipVertical() {
      this.$emitter.emit("flipVertical");
    },
    resetImage() {
      this.$emitter.emit("reset");
    },
  },
  watch: {
    rotateValue(newValue, oldValue) {
      this.$emitter.emit("rotate", newValue - oldValue);
    },
    height(newValue) {
      this.$emitter.emit(
        "setCropBoxData",
        this.top,
        this.left,
        this.width,
        newValue
      );
    },
    width(newValue) {
      this.$emitter.emit(
        "setCropBoxData",
        this.top,
        this.left,
        newValue,
        this.height
      );
    },
    top(newValue) {
      this.$emitter.emit(
        "setCropBoxData",
        newValue,
        this.left,
        this.width,
        this.height
      );
    },
    left(newValue) {
      this.$emitter.emit(
        "setCropBoxData",
        this.top,
        newValue,
        this.width,
        this.height
      );
    },
  },
};
</script>
