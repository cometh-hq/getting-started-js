export function removeDomElement(id: string) {
  const existingWrapper: HTMLElement | null = document.getElementById(id);
  if (existingWrapper) {
    existingWrapper.remove();
  }
}
