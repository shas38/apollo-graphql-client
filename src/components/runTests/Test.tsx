import React, { Fragment, useState, useEffect } from 'react';
import {
    createStyles,
    makeStyles,
    Theme,
  } from '@material-ui/core/styles';
import { useMutation } from 'react-apollo-hooks';
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
import Result from './Result';
import Console from './Console';

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
type Stage = {
    stage: string,
    numberOfTestsCompleted: number,
}
export default (props: any) =>{

    const classes = useStyles();
    const [stage, setStage] = useState<Stage>({
        stage: 'READY',
        numberOfTestsCompleted: 0,
    });
    const [openResult, setOpenResult] = useState(false);
    const [openConsole, setOpenConsole] = useState(false);
    const [testId, setTestId] = useState<Array<string>>([]);
    // const [numberOfTestsCompleted, setNumberOfTestsCompleted] = useState<number|null>(null);
    const [backgroundColor, setBackgroundColor] = useState(blue[500]);
    const [activeIcon, setActiveIcon] = useState(<PlayCircleOutline />);
    const [testLogs, setTestLogs] = useState();
    useEffect(()=>{

        if(props.testLogs && testId.includes(props.testLogs.testId)){
            setTestLogs(props.testLogs.data)
        }
    }, [props.testLogs]);

    useEffect(()=>{
        switch(stage.stage){
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
    }, [stage.stage]);

    useEffect(()=>{
        if(testId.includes(props.finishedTest.id) && stage.stage === "RUNNING"){
            
            setStage({
                ...stage,
                numberOfTestsCompleted: stage.numberOfTestsCompleted + 1,
            });
        }
    }, [props.finishedTest]);



    useEffect(()=>{
        const runNextTest = async () => {
            
            if(stage.stage === 'RUNNING'){
                
                if(stage.numberOfTestsCompleted > 0 && !props.finishedTest.passed){
                    setStage({
                        ...stage,
                        stage: 'FAILED',
                    });
                }
                else if(stage.numberOfTestsCompleted === props.test.test.length){    
                    setStage({
                        ...stage,
                        stage: 'PASSED',
                    });
                }
                else{
                    try{
                        let data: any = await fetch(`${process.env.REACT_APP_DOMAIN}/api/startTest`, {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify(props.test.test[stage.numberOfTestsCompleted]), // body data type must match "Content-Type" header
                        });
                        data = await data.json();
                        // props.socket.emit('subscribe', data.id);
                        setTestId([...testId, data.id]);
                        addRunningTest({ variables: {testId: data.id, testName: props.test.testName} });
                        
                    }
                    catch(err){
                        console.log(err)
                    }

                }
            }
        }

        runNextTest();

    }, [stage]);

    const addRunningTest = useMutation(gql`
        mutation AddRunningTest($testId: [String], $testName: String!) {
            addRunningTest(testId: $testId, testName: $testName) @client
        }
    `);
    const setRunTestStage = useMutation(gql`
        mutation SetRunTestStage($testResultId: String!, $runTestStage: String!) {
            setRunTestStage(testResultId: $testResultId, runTestStage: $runTestStage) @client
        }
    `);

    const runTest = async () => {
        if (stage.stage !== 'RUNNING') {
            
            setTestId([]);
            setStage({
                stage: 'RUNNING',
                numberOfTestsCompleted: 0,
            });
        }
    }

    const testResults = async () => {

        setRunTestStage({ variables: {testResultId: testId, runTestStage: 'RESULT'} });
        setOpenResult(true);
    }

    const showConsole = async () => {
        setOpenConsole(true); 
    }

    return (
        <Fragment>
            {openResult&&<Result 
                testResultId={testId} 
                openResult={openResult}
                closeResult={()=> setOpenResult(false)}
            />}
            <Console 
                testLogs={testLogs} 
                openResult={openConsole}
                closeResult={()=> setOpenConsole(false)}
            />
            <div title={props.test.testDescription}>
                <Chip 
                    label={props.test.testName} 
                    className={classes.chip} 
                    style={{
                        backgroundColor: backgroundColor, 
                        color: 'white',
                        minWidth: '15rem',
                        minHeight: '2.3rem',
                        fontSize:   '1.1rem'
                    }}
                    onClick={showConsole}
                />
            </div>
            <div className={classes.wrapper}>
                <IconButton className={classes.button} aria-label="Run Test" color="primary" onClick={runTest}>
                    {activeIcon}
                </IconButton>
                {stage.stage==='RUNNING' && <CircularProgress size={68} className={classes.fabProgress} />}
            </div>
            <Fab
                aria-label="Status"
                variant="extended"
                size="medium"
                style={{
                    display: stage.stage==='READY'?'none':'inline-block',
                    backgroundColor: backgroundColor,
                    color: 'white',
                    margin: '1rem',
                    minWidth: '8rem',
                }}
                disabled={stage.stage==='RUNNING'}
                onClick={testResults}
            >
                {stage.stage}
            </Fab>
            <div className={classes.LinearProgress} style={{textAlign: 'center', display: stage.stage==='RUNNING'?'inline-block':'none'}}>
                <LinearProgress />
                <span 
                style={{
                    color: blue[700],
                    fontWeight: 'bold',
                    top: '2rem',
                    margin: '0rem 0 0 0 ',
                    padding: '0.5rem 0 0 0',
                    display: 'inline-block',
                }}>
                    {`${stage.numberOfTestsCompleted} / ${props.test.test.length}`}
                </span>
            </div>
        </Fragment>
    );
}
