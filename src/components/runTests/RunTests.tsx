import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import io from 'socket.io-client';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import TablePagination from "@material-ui/core/TablePagination";
import CircularProgress from '@material-ui/core/CircularProgress';


import Test from './Test';
import {filterTests} from '../../helper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
    progress: {
      margin: theme.spacing(2),
    },
    button: {
      margin: theme.spacing(1),
    },
  }),
);





export default (props: any) =>{
  
  const classes: any = useStyles();

  const [finishedTest, setFinishedTest] = useState<Object>({
    passed: null,
    id: null,
    message: null,
  });

  const [testLogs, setTestLogs] = useState<any>();
  const [testCorrelation, setTestCorrelation] = useState<any>({});
  const [filteredTests, setFilteredTests] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  
  

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

  let searchResults = useQuery(gql`
    query search{
      search @client(always: true)
    }
  `);

  const removeRunningTest = useMutation(gql`
    mutation RemoveRunningTest($testId: String!) {
        removeRunningTest(testId: $testId) @client
      }
  `);
  
  useEffect(()=>{

    if(!loading){
      const filteredTests = filterTests(data.tests, searchResults.data.search);
      setFilteredTests(filteredTests);
      setPage(0);
    }

  },[searchResults, data])

 
  useEffect(()=>{

    const socket = io(`${process.env.REACT_APP_DOMAIN}`);
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
            // setSnackbarContent({message: data.message, variant: 'info', Icon: variantIcon["info"]});
            // setOpenSnackbar(true);
            setFinishedTest({
              passed: true,
              id: data.id,
              message: data.message,
            })
          }
          else{
            // setSnackbarContent({message: data.message, variant: 'error', Icon: variantIcon["error"]});
            // setOpenSnackbar(true);
            setFinishedTest({
              passed: false,
              id: data.id,
              message: data.message,
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

  const indexOfLastTest = (1 + page) * rowsPerPage;
  const indexOfFirstTest = indexOfLastTest - rowsPerPage;
  const currentTests = filteredTests && filteredTests.slice(indexOfFirstTest, indexOfLastTest);

  return (
    <Card style={{width: '80%', margin: "5rem auto 0", textAlign: 'center', top: '20%'}}>
      {loading&&<CircularProgress className={classes.progress} />}
      {error&&<p>{`Error! ${error.message}`}</p>}
      {!loading&&<div style={{display: 'block'}}>

        <h1> Run Tests </h1>
        <List component="nav" className={classes.root} aria-label="Tests">
          {currentTests && currentTests.map((test: any)=>(
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
        <TablePagination
          style={{margin: '0 auto'}}
          component="nav"
          page={page}
          rowsPerPage={rowsPerPage}
          count={filteredTests ? filteredTests.length : 100}
          onChangePage={(event: any, page: number) => {setPage(page)}}
          rowsPerPageOptions={[5, 10]}
          onChangeRowsPerPage={(event: any) => {setRowsPerPage(event.target.value)}}
        />
      </div>}
    </Card>
  );
}