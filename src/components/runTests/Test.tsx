import React, { Fragment, useState, useEffect } from 'react';
import {
    createStyles,
    makeStyles,
    Theme,
  } from '@material-ui/core/styles';
import { useMutation, useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
// import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';
import LinearProgress from '@material-ui/core/LinearProgress';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import { green, red, blue } from '@material-ui/core/colors';
import PauseCircleOutline from '@material-ui/icons/PauseCircleOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    LinearProgress : {
        flexGrow: 1,
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    button: {
        margin: theme.spacing(1),
      },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1,
    },
    chip: {
      margin: theme.spacing(1),
    },
    margin: {
        margin: theme.spacing(1),
      },
  }),
);

export default (props: any) =>{

    // console.log('DOMAIN', `${process.env.REACT_APP_DOMAIN}`)
    const socket = props.socket;
    const classes = useStyles();
    const [stage, setStage] = useState('READY');
    const [testId, setTestId] = useState<String|null>(null);
    const [backgroundColor, setBackgroundColor] = useState(blue[500]);
    const [activeIcon, setActiveIcon] = useState(<PlayCircleOutline />);

    useEffect(()=>{
        switch(stage){
            case "PASSED":
                setActiveIcon(<CheckIcon/>)
                setBackgroundColor(green[500]);
                break;
            case "FAILED":
                setActiveIcon(<ClearIcon/>)
                setBackgroundColor(red[500]);
                break;
            case "READY":
                setActiveIcon(<PlayCircleOutline/>)
                setBackgroundColor(blue[500]);
                break;
            case "RUNNING":
                setActiveIcon(<PauseCircleOutline/>)
                setBackgroundColor(blue[500]);
                break;
            default:
                setActiveIcon(<PlayCircleOutline/>)
                break;
        }
    }, [stage]);


    const addRunningTest = useMutation(gql`
        mutation AddRunningTest($testId: String!, $testName: String!) {
            addRunningTest(testId: $testId, testName: $testName) @client
        }
    `);

    const runTest = async () => {
        if (stage !== 'RUNNING') {
            setActiveIcon(<PauseCircleOutline/>);
            setStage('RUNNING');
            setTimeout(() => {
                setStage('PASSED');
            }, 2000);
            try{
                let data: any = await fetch(`${process.env.REACT_APP_DOMAIN}/api/starttest`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(props.test), // body data type must match "Content-Type" header
                });
                data = await data.json();
                addRunningTest({ variables: {testId: data.id, testName: props.testName} })
                // console.log({data})
                setTestId(data.id)
            }
            catch(err){
                console.log(err)
            }
        }
    }
    const testResults = () => {

        if (stage !== 'RUNNING') {
            setActiveIcon(<PauseCircleOutline/>);
            setStage('RUNNING');
            setTimeout(() => {
                setStage('PASSED');
            }, 2000);
        }
    }
    return (
        <Fragment>
            <div title={props.testDescription}>
                <Chip 
                    label={props.testName} 
                    className={classes.chip} 
                    style={{
                        backgroundColor: backgroundColor, 
                        color: 'white',
                        minWidth: '15rem',
                        minHeight: '2.3rem',
                        fontSize:   '1.1rem'
                    }}
                />
            </div>
            <div className={classes.wrapper}>
                <IconButton className={classes.button} aria-label="Run Test" color="primary" onClick={runTest}>
                    {activeIcon}
                </IconButton>
                {stage==='RUNNING' && <CircularProgress size={68} className={classes.fabProgress} />}
            </div>
            <Fab
                aria-label="Status"
                variant="extended"
                size="medium"
                style={{
                    display: stage==='READY'?'none':'inline-block',
                    backgroundColor: backgroundColor,
                    color: 'white',
                    margin: '1rem',
                    minWidth: '8rem',
                }}
                disabled={stage==='RUNNING'}
                onClick={testResults}
            >
                {stage}
            </Fab>
            <div className={classes.LinearProgress} style={{display: stage==='RUNNING'?'inline-block':'none'}}>
                <LinearProgress />
            </div>
        </Fragment>
    );
}
