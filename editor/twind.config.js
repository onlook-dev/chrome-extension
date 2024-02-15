import { defineConfig } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";
import config from "./tailwind.config.js";

const twPreset = presetTailwind();

// Add specific apply from app.pcss and tailwind.config.js since that's not working
twPreset.preflight["*"] = {
  borderColor: "hsl(240 3.7% 15.9% / 1)",
};

export default defineConfig({
  presets: [twPreset],
  darkMode: "class",
  ...config
});
