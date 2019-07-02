import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import './App.css';
import Home from './pages/Home'
import Writers from './pages/Writers'
import TopNavigation from "./navigation/TopNavigation"




const client = new ApolloClient({
  uri: "http://localhost:5000/graphql"
});

// client
//   .query(testlogsQuery("9r01cdowz2"))
//   .then(result => console.log(result));


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
              path="/writers"
              component={Writers}
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
