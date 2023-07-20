import React from 'react';

import Counter from './Counter';

const stores = React.createContext({
  counter: new Counter(),
});

export default stores;