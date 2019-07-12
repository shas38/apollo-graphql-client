import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ApolloClient from "apollo-boost";
import gql from 'graphql-tag';
import { ApolloProvider } from "react-apollo-hooks";
import { InMemoryCache } from 'apollo-cache-inmemory';
import './App.css';
import RunTests from './components/runTests/RunTests'
import Navigation from "./navigation/Navigation"
import CreateTests from "./components/createTests/CreateTests"
import CreateTestSets from "./components/createTestSets/CreateTestSets"
import ModifyTests from "./components/modifyTests/ModifyTests"
import About from "./components/About"
import Contact from "./components/Contact"
import Login from "./components/Login"
import SignUp from "./components/SignUp"
import setCallTestInputsMutation from "./graphql/reducers/setCallTestInputsMutation"
import setStageMutation from "./graphql/reducers/setStageMutation"
import addRunningTestMutation from "./graphql/reducers/addRunningTest"
import removeRunningTestMutation from "./graphql/reducers/removeRunningTest"

const cache = new InMemoryCache();
const initData = {
  runningTests: {},
  testName: null,
  selectedTestType: null,
  testDescription: null,
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

const typeDefs = gql`
  type SelectedParty{
    cluster: String
    DN: String
    product: String
    region: String
    sbc: String
  }
  scalar JSON
  type RunningTests{
    runningTests: JSON
  }

  type query {
    runningTests: RunningTests
  }
  
`;

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache,
  typeDefs,
  resolvers:{
    Mutation: {
      setCallTestInputs: setCallTestInputsMutation,
      setStage: setStageMutation,
      removeRunningTest: removeRunningTestMutation,
      addRunningTest: addRunningTestMutation,
    }
  }
});

cache.writeData({ data: initData });

client.onResetStore(async () => cache.writeData({ data: initData }));

function App() {

  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Navigation>
          <Switch>
            <Route 
              exact 
              path="/"
              component={RunTests}
            />
            <Route
              path="/createTests"
              component={CreateTests}
            />
            <Route
              path="/createTestSets"
              component={CreateTestSets}
            />
            <Route
              path="/modifyTests"
              component={ModifyTests}
            />
            <Route
              path="/about"
              component={About}
            />
            <Route
              path="/contact"
              component={Contact}
            />
            <Route
              path="/login"
              component={Login}
            />
            <Route
              path="/signUp"
              component={SignUp}
            />
            <Route
              render={()=> <h1>Not Found</h1>}
            />
          </Switch>
        </Navigation>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
