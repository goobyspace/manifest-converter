import React from 'react';
import { ContextType } from '../types';

const StateContext = React.createContext<ContextType | null>(null);

export function useStateContext() {
  return React.useContext(StateContext);
}

export default StateContext;