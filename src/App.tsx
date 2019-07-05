import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo-hooks";
import { InMemoryCache } from 'apollo-cache-inmemory';
import './App.css';
import Home from './components/Home'
import TopNavigation from "./navigation/TopNavigation"
import CreateTests from "./components/createTests/CreateTests"
import setCallTestInputsMutation from "./graphql/reducers/setCallTestInputsMutation"
import setStageMutation from "./graphql/reducers/setStageMutation"


const cache = new InMemoryCache();
const initData = {
  testName: null,
  selectedTestType: null,
  stage: 'SelectTestType',
  AParty:{
      __typename: 'Party',
      selectedDN: null,
      selectedSbc: null,
      selectedProduct: null,
      selectedRegion: null,
      selectedCluster: null,
  },
  BParty:{
      __typename: 'Party',
      selectedDN: null,
      selectedSbc: null,
      selectedProduct: null,
      selectedRegion: null,
      selectedCluster: null,
  },
};



const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache,
  resolvers:{
    Mutation: {
      setCallTestInputs: setCallTestInputsMutation,
      setStage: setStageMutation,
    }
  }
});

cache.writeData({ data: initData });

client.onResetStore(async () => cache.writeData({ data: initData }));

function App() {

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <TopNavigation>
          <Switch>
            <Route 
              exact 
              path="/"
              component={Home}
            />
            <Route
              path="/createTests"
              component={CreateTests}
            />
            <Route
              render={()=> <h1>Not Found</h1>}
            />
          </Switch>
        </TopNavigation>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
