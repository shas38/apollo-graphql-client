import React, { } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import ListItem from '@material-ui/core/ListItem';
import Test from './Test';

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

  return (

      <Card style={{width: '80%', margin: "5rem auto 0", textAlign: 'center', top: '20%'}}>
        {loading&&<h2>Loading...</h2>}
        {error&&<p>{`Error! ${error.message}`}</p>}
        <div style={{display: loading?'none':'block'}}>
          <h1> Modify Tests </h1>
          <List component="nav" className={classes.root} aria-label="Tests">
            {data.tests && data.tests.map((test: any)=>(
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
        </div>
      </Card>
    

  );
}
