// import React from 'react';
// import UsersComponent from "./Modules/Users"
// import './App.css';
// import CombinedStore from "./Stores/combines.store"
// function App() {
//   return (
//     // <UsersComponent {...new CombinedStore()}/>
//   );
// }

// export default App;

import React, { Suspense, lazy, Component } from "react";
import CombinedStore from "./Stores/combines.store"
import "./App.css";

const Routes = lazy(() => import("./routes"));

class App extends Component {
  constructor(props) {
    super(props);
    this.props = props;
  }
  render() {
    return (
      <div className="App">
        <Suspense fallback={<div>...Loading</div>}>
          <Routes {...new CombinedStore()} />
        </Suspense>
      </div>
    );
  }
}

export default App;
