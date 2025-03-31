
import { RouterProviderProps } from 'react-router-dom';

export const routerConfig: Partial<RouterProviderProps> = {
  future: {
    v7_startTransition: true,
    // Remove the invalid property v7_relativeSplatPath
  },
  basename: '/'
};

export const getRouterConfig = () => routerConfig;
