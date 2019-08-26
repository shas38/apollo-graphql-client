import React, {useEffect} from 'react';
import { useMutation, useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import Card from '@material-ui/core/Card';
import ResultTable from './ResultTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);


const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default (props: any) => {
  const classes = useStyles();
  // useEffect(()=>{
  //   console.log(props.testResultId)
  // })

  const { loading, error, data, refetch } = useQuery(gql`
      query Testlogs($testId: [ID]){
          testlogs(testId: $testId){
              testName
              testType
              test
              id
              startTime
              endTtime
              results
          }
      }
  `, { 
      variables: {
        testId: props.testResultId
      },
  });

  // console.log({testlogs: data.testlogs})
  // console.log({testId: props.testResultId})
  return (
      <Dialog fullScreen open={props.openResult} onClose={props.closeResult} TransitionComponent={Transition}>
        <AppBar className={classes.appBar} style={{position: 'sticky', top: '0', marginBottom: '1rem'}}>
          <Toolbar >
            <IconButton edge="start" color="inherit" onClick={props.closeResult} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Test Result
            </Typography>
          </Toolbar>
        </AppBar>
        
        {/* <Card style={{width: '95%', margin: "4rem auto 0", top: '20%', padding: '1.5rem'}}> */}
          {loading&&<h2>Loading...</h2>}
          {error&&<p>{`Error! ${error.message}`}</p>}
          {data.testlogs && 
          <ResultTable 
            testlogs={data.testlogs}
          />}
        {/* </Card> */}
      </Dialog>
  );
}