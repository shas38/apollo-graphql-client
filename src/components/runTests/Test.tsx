import React, { Fragment, useState, useEffect } from 'react';
import uuidv1 from 'uuid/v1';
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
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
// import IconButton from '@material-ui/core/IconButton';
// import CheckIcon from '@material-ui/icons/Check';
// import ClearIcon from '@material-ui/icons/Clear';
import SettingsEthernet from '@material-ui/icons/SettingsEthernet';
// import InfoIcon from '@material-ui/icons/Info';
import PlayCircleOutline from '@material-ui/icons/PlayCircleOutline';
import { green, red, blue, amber } from '@material-ui/core/colors';
import PauseCircleOutline from '@material-ui/icons/PauseCircleOutline';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Result from './Result';
import Console from './Console';
import Info from './Info';

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

      success: {
          backgroundColor: green[600],
      },
      error: {
          backgroundColor: theme.palette.error.dark,
      },
      info: {
          backgroundColor: theme.palette.primary.main,
      },
      warning: {
          backgroundColor: amber[700],
      },
      icon: {
          fontSize: 20,
          opacity: 0.9,
          marginRight: theme.spacing(1),
      },
      message: {
          display: 'flex',
          alignItems: 'center',
      },
  }),
);
type Stage = {
    stage: string,
    numberOfTestsCompleted: number,
    testSetID: string | null,
}
const variantIcon: any = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};
function TransitionLeft(props: TransitionProps) {
    return <Slide {...props} direction="left" />;
}
export default (props: any) =>{

    const classes: any = useStyles();
    const [stage, setStage] = useState<Stage>({
        stage: 'READY',
        numberOfTestsCompleted: 0,
        testSetID: null,
    });
    const [openResult, setOpenResult] = useState(false);
    const [openConsole, setOpenConsole] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [testId, setTestId] = useState<Array<string>>([]);
    // const [numberOfTestsCompleted, setNumberOfTestsCompleted] = useState<number|null>(null);
    const [backgroundColor, setBackgroundColor] = useState(blue[500]);
    const [activeIcon, setActiveIcon] = useState(<PlayCircleOutline />);
    const [testLogs, setTestLogs] = useState();
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarContent, setSnackbarContent] = React.useState({message: '', variant: "info", Icon: variantIcon["info"]});

    useEffect(()=>{

        if(props.testLogs && testId.includes(props.testLogs.testId)){
            setTestLogs(props.testLogs.data)
        }
    }, [props.testLogs, testId]);

    useEffect(()=>{
        switch(stage.stage){
            case "PASSED":
                // setActiveIcon(<CheckIcon/>)
                setActiveIcon(<PlayCircleOutline/>)
                setBackgroundColor(green[500]);
                break;
            case "FAILED":
                // setActiveIcon(<ClearIcon/>)
                setActiveIcon(<PlayCircleOutline/>)
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
                // console.log({testLendth: props.test.test.length, completeLength: stage.numberOfTestsCompleted, stage: stage.stage, passed: props.finishedTest.passed})
                if(stage.numberOfTestsCompleted > 0 && !props.finishedTest.passed){
                    setSnackbarContent({message: `${props.test.testName} failed, message: ${props.finishedTest.message}`, variant: 'error', Icon: variantIcon["error"]});
                    setOpenSnackbar(true);
                    setStage({
                        ...stage,
                        stage: 'FAILED',
                    });
                }
                else if(stage.numberOfTestsCompleted === props.test.test.length){ 
                    setSnackbarContent({message: `${props.test.testName} ran successfully`, variant: 'info', Icon: variantIcon["info"]});
                    setOpenSnackbar(true);   
                    setStage({
                        ...stage,
                        stage: 'PASSED',
                    });
                }
                else{
                    try{
                        console.log(stage.testSetID)
                        let test = {
                            ...props.test.test[stage.numberOfTestsCompleted],
                            isTestSet: props.test.testType === "testSet",
                            testSetName: props.test.testName,
                            testSetID: stage.testSetID,
                        }
                        let data: any = await fetch(`${process.env.REACT_APP_DOMAIN}/api/startTest`, {
                            method: "POST",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify(test), // body data type must match "Content-Type" header
                        });
                        data = await data.json();
                        // props.socket.emit('subscribe', data.id);
                        setTestId((testId: any) => [...testId, data.id]);
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
            let uuid = uuidv1();
            // if(props.test.testType === "testSet"){
            //     uuid = uuidv1();
            // }
            setTestId([]);
            setStage({
                stage: 'RUNNING',
                numberOfTestsCompleted: 0,
                testSetID: uuid,
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

    const showInfo = async () => {
        setOpenInfo(true); 
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
            {openInfo&&<Info 
                tests={props.test.test} 
                openInfo={openInfo}
                closeInfo={()=> setOpenInfo(false)}
            />}
            <Snackbar
            TransitionComponent={(props: any)=> <TransitionLeft {...props} className={classes[snackbarContent.variant]}/>}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={openSnackbar}
            autoHideDuration={5000}
            onClose={()=>{setOpenSnackbar(false)}}
            message={
                <span id="client-snackbar" className={classes.message}>
                    <snackbarContent.Icon className={classes.icon} />
                    {snackbarContent.message}
                </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={()=>{setOpenSnackbar(false)}}>
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            >
            </Snackbar>
            <div title={props.test.testDescription}>
                <IconButton onClick={showInfo} style={{color: blue[300], padding: '0', margin: '0'}} className={classes.button} aria-label="info">
                    <InfoIcon/>
                </IconButton>
                <Chip   
                    label={props.test.testType === 'testSet'? [<SettingsEthernet key='SettingsEthernet' style={{margin: '0 0.5rem 0 0'}}/>, props.test.testName]: props.test.testName} 
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
