declare global {
  interface Window {
    Chart: {
      destroy: () => void;
      create: (config: { // TODO
        labels: string[]
      }) => void;
    }; 
  }
}
export { };