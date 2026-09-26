declare global {
  interface Window {
    Chart: {
      new(ctx: HTMLCanvasElement, config: {
        type: string;
        data: {
          datasets: Array<{
            label?: string;
            data: {
              x: number,
              y: number
            }[];
          }>;
          labels?: string[];
        };
        options?: {
          
          responsive?: boolean;
          maintainAspectRatio?: boolean;
          scales?: {
            x: {
              type: string
            }
          }
        }
      }): {
        destroy(): void;
      }
    }
  };
}

export { };