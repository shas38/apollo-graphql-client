import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo-hooks";
import { InMemoryCache } from 'apollo-cache-inmemory';
import './App.css';
import Home from './components/Home'
import TopNavigation from "./navigation/TopNavigation"
import CreateTests from "./components/createTests/CreateTests"
import setSelectedTestTypeMutation from "./graphql/reducers/setSelectedTestTypeMutation"


const cache = new InMemoryCache();
const initData = {
  selectedTestType: '',
};



const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache,
  resolvers:{
    Mutation: {
      setSelectedTestType: setSelectedTestTypeMutation,
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
