import constant from "@/configs/constant";
import { useDark, useToggle } from "@vueuse/core";

export const isDark = useDark({
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: constant.themeStorageKey,
});
export const toggleDark = useToggle(isDark);
