export const getEvent = (states, state) => {
  return typeof state.value === 'string'
    ? states[state.value]
    : states[Object.keys(state.value)[0]].states[Object.values(state.value)[0]];
};
