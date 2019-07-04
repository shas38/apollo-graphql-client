import React, { useState } from 'react';
import { Query } from "react-apollo";
// import {TestlogsQuery} from '../graphql/query';

const Home = (props: any) =>(
  <h1>Home</h1>
  // <Query query={TestlogsQuery} variables={{ testId:  "9r01cdowz2"}}>
  //   {({ loading, error, data }: any) => {
  //     if (loading) return null;
  //     if (error) return `Error! ${error}`;
  //     console.log(data)
  //     return(
  //       data.testlogs.length > 0 &&
  //       <div>
  //           <h1>{data.testlogs[0].id}</h1>
  //           <p>{data.testlogs[0].AParty.sbc.fqdn}</p>
  //           <button >Second Last</button>
  //       </div>
  //     );
  //   }}
  // </Query>
);




export default Home;