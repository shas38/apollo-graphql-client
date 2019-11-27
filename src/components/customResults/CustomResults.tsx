import React, {useEffect, useState} from 'react';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import queryString from 'query-string';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import CircularProgress from '@material-ui/core/CircularProgress';
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
    progress: {
      margin: theme.spacing(2),
    },
  }),
);


const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default (props: any) => {
  const classes = useStyles();

  const [state, setState] = useState<any>({
    crq: null,
    id: null,
  })

  const { loading, error, data } = useQuery(gql`
      query Testlogs($testSetID: String){
          testlogs(testSetID: $testSetID){
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
        testSetID: state.id
      },
  });
  useEffect(()=>{
    const arg = queryString.parse(props.location.search)
    const crq = arg.crq;
    const id = arg.id;  
    setState({
      crq,
      id
    })
    console.log(queryString.parse(props.location.search))
  },[])
  useEffect(()=>{
    console.log(data)
  },[data])
  const close = ()=>{
    // console.log("close")
  }
  // return <h1>result</h1>
  return (
      <Dialog fullScreen open={true} onClose={close} TransitionComponent={Transition}>
        <AppBar className={classes.appBar} style={{position: 'sticky', top: '0', marginBottom: '1rem'}}>
          <Toolbar >
            <IconButton edge="start" color="inherit" onClick={close} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {state.crq && state.id?`Test Result for CRQ ${state.crq} (${state.id})`: `Missing CRQ and ID`}
            </Typography>
          </Toolbar>
        </AppBar>
        
        {loading&&<CircularProgress className={classes.progress} />}
        {error&&<p>{`Error! ${error.message}`}</p>}
        {data.testlogs && state.crq && state.id &&
        <ResultTable 
          testlogs={data.testlogs}
        />}
      </Dialog>
  );
}