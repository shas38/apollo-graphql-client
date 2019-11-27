import React, { useState, useEffect, Fragment } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
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
  }),
);
export default (props: any) =>{

  const classes = useStyles();
  const [filteredTests, setFilteredTests] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { loading, error, data, refetch } = useQuery(gql`
    query {
      tests{
        testName
        testDescription
        testType
        test
      }
    }
  `);

  // let searchResults = useQuery(gql`
  //   query search{
  //     search @client(always: true)
  //   }
  // `);

  useEffect(()=>{
    console.log('SelectTestToModify')
    return ()=>{console.log('Unmount SelectTestToModify')}
  }, [])

  useEffect(()=>{

    if(!loading){
      const filteredTests = filterTests(data.tests, props.search);
      setFilteredTests(filteredTests);
      setPage(0);
    }
    console.log({search: props.search})
  },[props.search, data])

  const indexOfLastTest = (1 + page) * rowsPerPage;
  const indexOfFirstTest = indexOfLastTest - rowsPerPage;
  const currentTests = filteredTests && filteredTests.slice(indexOfFirstTest, indexOfLastTest);

  return (

      <Fragment>
        {loading&&<CircularProgress className={classes.progress} />}
        {error&&<p>{`Error! ${error.message}`}</p>}
        {currentTests && !loading && <div>
          <h1> Modify Tests </h1>
          <List component="nav" className={classes.root} aria-label="Tests">
            {currentTests.map((test: any)=>(
              <ListItem key={test.testName} divider>
                <Test
                  testDescription={test.testDescription}
                  testName={test.testName}
                  test={test}
                  refetch={refetch}
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
      </Fragment>
  );
}
