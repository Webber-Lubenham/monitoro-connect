
import { RouterProviderProps } from 'react-router-dom';

export const routerConfig: Partial<RouterProviderProps> = {
  future: {
    v7_startTransition: true,
    // Remove the invalid property v7_relativeSplatPath
  }
  // Removed basename property as it's not valid on RouterProviderProps
};

export const getRouterConfig = () => routerConfig;
