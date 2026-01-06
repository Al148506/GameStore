export function clearCartStorage() {
  Object.keys(localStorage)
    .filter((key) => key.startsWith("shopping-cart-"))
    .forEach((key) => localStorage.removeItem(key));
}
