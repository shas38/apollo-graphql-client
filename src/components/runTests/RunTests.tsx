import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import io from 'socket.io-client';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import Test from './Test';
import runningTestsQuery from '../../graphql/query/runningTests';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

export default (props: any) =>{
  
  const classes = useStyles();
  const { loading, error, data } = useQuery(gql`
    query {
      tests{
        testName
        testDescription
        test
      }
    }
  `);

  const runningTestsResults = useQuery(runningTestsQuery);
  console.log(runningTestsResults)

  const removeRunningTest = useMutation(gql`
    mutation RemoveRunningTest($testId: String!) {
        removeRunningTest(testId: $testId) @client
      }
  `);
  // const [socket, setSocket] = useState();
  useEffect(()=>{
    const initSocket = () => {
        const socket = io(`${process.env.REACT_APP_DOMAIN}`);
        socket.on('connect', ()=>{
            console.log('socket connected');
        })
        // setSocket(socket);

        socket.on('broadcast', async (data: any)=>{  
          const result = await runningTestsResults.refetch();
          console.log({result})
          if(data.stage === 'Finished' && data.id in result.data.runningTests){
              console.log('broadcast', {data});
              removeRunningTest({ variables: {testId: data.id} })
          }
        })
    }
    initSocket();
  }, []);

  return (
    <Card style={{width: '80%', margin: "5rem auto 0", textAlign: 'center', top: '20%'}}>
      {loading&&<h2>Loading...</h2>}
      {error&&<p>{`Error! ${error.message}`}</p>}
      <div style={{display: loading?'none':'block'}}>
        <h1> Run Tests </h1>
        <List component="nav" className={classes.root} aria-label="Tests">
          {data.tests && data.tests.map((test: any)=>(
            <ListItem key={test.testName} divider>
              <Test
                testDescription={test.testDescription}
                testName={test.testName}
                test={test}
                // socket={socket}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </Card>
  );
}