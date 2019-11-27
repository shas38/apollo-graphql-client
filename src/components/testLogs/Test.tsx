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
    const [openInfo, setOpenInfo] = useState(false);
    const [testId, setTestId] = useState<Array<string>>([]);
    // const [numberOfTestsCompleted, setNumberOfTestsCompleted] = useState<number|null>(null);
    const [backgroundColor, setBackgroundColor] = useState(blue[500]);

    const testResults = async () => {
        setOpenResult(true);
    }

    const showInfo = async () => {
        setOpenInfo(true); 
    }

    return (
        <Fragment>
            {openResult&&<Result 
                tests={props.test} 
                openResult={openResult}
                closeResult={()=> setOpenResult(false)}
            />}
            {openInfo&&<Info 
                tests={props.test.tests.map((test: any)=>({
                    testName: test.testName,
                    testType: test.testType,
                    partOfTestSet: props.test.isTestSet,
                    ...test.test,
                }))} 
                openInfo={openInfo}
                closeInfo={()=> setOpenInfo(false)}
            />}
            <div title={props.test.testDescription}>
                <IconButton onClick={showInfo} style={{color: blue[300], padding: '0', margin: '0'}} className={classes.button} aria-label="info">
                    <InfoIcon/>
                </IconButton>
                <Chip   
                    label={props.test.isTestSet ? [<SettingsEthernet key='SettingsEthernet' style={{margin: '0 0.5rem 0 0'}}/>, props.test.testName]: props.test.testName} 
                    className={classes.chip} 
                    style={{
                        backgroundColor: backgroundColor, 
                        color: 'white',
                        minWidth: '15rem',
                        minHeight: '2.3rem',
                        fontSize:   '1.1rem'
                    }}
                    onClick={testResults}
                />
            </div>
            <Chip   
                label={props.test.startTime} 
                className={classes.chip} 
                style={{
                    backgroundColor: backgroundColor, 
                    color: 'white',
                    minWidth: '15rem',
                    minHeight: '2.3rem',
                    fontSize:   '1.1rem'
                }}
                onClick={testResults}
            />
        </Fragment>
    );
}
