import { useWindowSize } from "./useWindowSize";

export function useIsMobile() {
  const { width } = useWindowSize();

  return width < 768;
}
