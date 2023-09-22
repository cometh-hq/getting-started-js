export function createDomRootElement(id: string): HTMLElement {
  const existingWrapper: HTMLElement | null = document.getElementById(id);
  if (existingWrapper) {
    existingWrapper.remove();
  }

  const wrapper: HTMLElement = document.createElement("section");
  wrapper.setAttribute("id", id);
  document.body.appendChild(wrapper);
  return wrapper;
}
