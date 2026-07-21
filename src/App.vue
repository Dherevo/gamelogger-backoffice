<template>
  <AppGlobalWidgets ref="globalWidgets"/>
  <router-view />
</template>

<script lang="ts">
import { AppGlobalWidgets } from "lib";
import { usePrimeVue } from "primevue/config";
import locales from './assets/translations/locales';
import { defineComponent } from 'vue';

export default defineComponent({
  components: { AppGlobalWidgets },
  created() {
    const primevue = usePrimeVue();
    if (locales.prime) {
      Object.keys(locales.prime).forEach((k: string) => {
        (primevue.config.locale as any)[k] = (locales.prime as any)[k];
      });
    }
  },
});
</script>