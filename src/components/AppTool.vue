<template>
  <v-card>
    <v-navigation-drawer color="primary" rail permanent>
      <v-tabs v-model="tab" direction="vertical" bg-color="primary">
        <v-tab value="file">
          <v-icon>mdi-file</v-icon>
          <v-tooltip activator="parent">File</v-tooltip>
        </v-tab>
        <v-tab value="transform">
          <v-icon>mdi-transfer</v-icon>
          <v-tooltip activator="parent">Transform</v-tooltip>
        </v-tab>
        <v-tab value="basic">
          <v-icon>mdi-tune</v-icon>
          <v-tooltip activator="parent">Basic</v-tooltip>
        </v-tab>
        <v-tab value="color">
          <v-icon>mdi-palette</v-icon>
          <v-tooltip activator="parent">Color</v-tooltip>
        </v-tab>
        <v-tab value="filter">
          <v-icon>mdi-filter</v-icon>
          <v-tooltip activator="parent">Filter</v-tooltip>
        </v-tab>
      </v-tabs>
    </v-navigation-drawer>
  </v-card>

  <v-card>
    <v-layout full-height>
      <v-navigation-drawer permanent class="toolbar">
        <v-window v-model="tab">
          <v-window-item value="file">
            <file-tool v-if="tab === 'file'"/>
          </v-window-item>
          <v-window-item value="transform">
            <transform-tool v-if="tab === 'transform'" />
          </v-window-item>
          <v-window-item value="basic">
            <adjust-tool v-if="tab === 'basic'"/>
          </v-window-item>
          <v-window-item value="color">
            <color-tool v-if="tab === 'color'"/>
          </v-window-item>
          <v-window-item value="filter">
            <filter-tool v-if="tab === 'filter'"/>
          </v-window-item>
        </v-window>
      </v-navigation-drawer>

      <v-main class="toolbar"></v-main>
    </v-layout>
  </v-card>
</template>

<script>
import FilterTool from "./ToolDetail/FilterTool.vue";
import ColorTool from "./ToolDetail/ColorTool.vue";
import AdjustTool from "./ToolDetail/AdjustTool.vue";
import FileTool from "./ToolDetail/FileTool.vue";
import TransformTool from "./ToolDetail/TransformTool.vue";
import { useAppStore } from "@/store/app";

export default {
  data: () => ({
    tab: null,
  }),
  created(){
    this.$emitter.on('cancel', () => {
      this.tab = 'file';
    })
  },
  components: {
    FileTool,
    FilterTool,
    ColorTool,
    AdjustTool,
    TransformTool,
  },
  watch: {
    tab(newValue) {
      useAppStore().transformMode = newValue;
    },
  },
};
</script>
