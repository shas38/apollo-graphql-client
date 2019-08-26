import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import io from 'socket.io-client';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import Test from './Test';
// import runningTestsQuery from '../../graphql/query/runningTests';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }),
);
const socket = io(`${process.env.REACT_APP_DOMAIN}`);
export default (props: any) =>{
  
  const classes = useStyles();

  const [finishedTest, setFinishedTest] = useState<Object>({
    passed: null,
    id: null,
  });

  // const [testLogs, setTestLogs] = useState<any>({});
  const [testLogs, setTestLogs] = useState<any>();

  // const [socket, setSocket] = useState();
  const [testCorrelation, setTestCorrelation] = useState<any>({});
  const [seq, setSeq] = useState();

  const { loading, error, data } = useQuery(gql`
    query {
      tests{
        testName
        testDescription
        testType
        test
      }
    }
  `);

  let runningTestsResults = useQuery(gql`
      query runningTests{
          runningTests @client
      }
  `);

  // let runTestStageResults = useQuery(gql`
  //   query runningTests{
  //     runTestStage @client
  //     testResultId @client
  //   }
  // `);

  // console.log({runTestStageResults})

  const removeRunningTest = useMutation(gql`
    mutation RemoveRunningTest($testId: String!) {
        removeRunningTest(testId: $testId) @client
      }
  `);

  useEffect(()=>{

    socket.on('connect', ()=>{
        console.log('socket connected');
    })

    socket.on('broadcast', async (data: any)=>{  
      socket.emit('subscribe', data.id);

      if(data.stage === "Finished"){
        const result = await runningTestsResults.refetch();
        console.log('broadcast', {result, data})
        if(result.data.runningTests.includes(data.id)){
          removeRunningTest({ variables: {testId: data.id} })
          if(data.code === 0){
            setFinishedTest({
              passed: true,
              id: data.id,
            })
          }
          else{
            setFinishedTest({
              passed: false,
              id: data.id,
            })
          }
        }
      }
    })

    socket.on('console', async(data: any)=>{
      const result = await runningTestsResults.refetch();

      if(result.data.runningTests.includes(data.testId)){
        setTestLogs(data)
      }
    })
    return () => {
      socket.disconnect();
    }
  }, []);

  const setTestCorrelationState = (testName: string, testId: string) => {
    console.log(testCorrelation)
    setTestCorrelation({...testCorrelation, [testId as string]: testName});

  }
  return (
    <Card style={{width: '80%', margin: "5rem auto 0", textAlign: 'center', top: '20%'}}>
      {/* {runTestStageResults.data.runTestStage === 'RESULT' && <Result testResultId={runTestStageResults.data.testResultId}/>} */}
      {loading&&<h2>Loading...</h2>}
      {error&&<p>{`Error! ${error.message}`}</p>}
      <div style={{display: loading?'none':'block'}}>
        <h1> Run Tests </h1>
        <List component="nav" className={classes.root} aria-label="Tests">
          {data.tests && data.tests.map((test: any)=>(
            <ListItem key={test.testName} divider>
              <Test
                test={test}
                finishedTest={finishedTest}
                setTestCorrelationState = {setTestCorrelationState}
                testLogs={testLogs}
              />
            </ListItem>
          ))}
        </List>
      </div>
    </Card>
  );
}