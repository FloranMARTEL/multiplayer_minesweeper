export {}

declare global {
  interface Array<T> {
    remouve(element: T): void;
  }
}

Array.prototype.remouve = function<T>(this: T[], element: T): void {
  const index = this.indexOf(element);
  if (index !== -1) {
    this.splice(index, 1);
  }
};