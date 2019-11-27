import 'date-fns';
import React, { Fragment, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Test from './Test';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
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

const variantIcon: any = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

export interface Props {
    className?: string;
    message?: string;
    onClose?: () => void;
    variant: string;
}

function TransitionLeft(props: TransitionProps) {
    return <Slide {...props} direction="left" />;
}

export default (props: any) =>{
    let start = new Date();
    start.setHours(0,0,0,0);
    let end = new Date();
    end.setHours(0,0,0,0);
    end.setDate(end.getDate() + 1);
    const classes: any = useStyles();
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarContent, setSnackbarContent] = React.useState({message: '', variant: "info", Icon: variantIcon["info"]});
    const [selectedDate, setSelectedDate] = React.useState({
        startDate: start,
        endDate: end,
    });

    const [state, setState] = React.useState({
        testName: "",
        tests: true,
        testSets: true,
    });
    const [testLogs, setTestLogs] = React.useState([]);

    const handleDateChange = (inputName: string) => (value: any) => {
        console.log(value)
      setSelectedDate({
        ...selectedDate,
        [inputName as string]: value
      });
    };

    const handleChange = (inputName: string) => (event: any) => {
        console.log(event.target.checked)
        
      setState({
        ...state,
        [inputName as string]: inputName === "testName"? event.target.value : event.target.checked,
      });
    };
    const search = (event: any) => {
        let startDate = selectedDate.startDate.getTime();
        let endDate = selectedDate.endDate.getTime();
        // startDate = startDate.getTime();
        // endDate = endDate.getTime();
        console.log({startDate, endDate})
        

    };
    const { loading, error, data } = useQuery(gql`
        query Testlogs($testName: String, $startDate: Float, $endDate: Float, $tests: Boolean, $testSets: Boolean){
            testlogs(testName: $testName, startDate: $startDate, endDate: $endDate, tests: $tests, testSets: $testSets){
                testName
                testType
                test
                id
                startTime
                endTtime
                results
                isTestSet
                testSetName
                testSetID
            }
        }
    `, {
        fetchPolicy: "network-only",
        variables: {
            testName: state.testName?state.testName:null,
            startDate: selectedDate.startDate.getTime(),
            endDate: selectedDate.endDate.getTime(),
            tests: state.tests,
            testSets: state.testSets,
        },
    });
    useEffect(()=>{
        console.log(data)
        let testLogsObject: any = {}
        if(data.testlogs){
            for(let i = 0; i<data.testlogs.length; i++) {
                let testlog = data.testlogs[i];
                if(testLogsObject[testlog.testSetID]){
                    testLogsObject[testlog.testSetID].push(testlog);
                }
                else{
                    testLogsObject[testlog.testSetID] = [testlog];
                }
            };
        }
        let testLogsLocal: any = [];

        for (const id of Object.keys(testLogsObject)) {
            testLogsLocal.push({
                testName: testLogsObject[id][0].testSetName,
                startTime: testLogsObject[id][0].startTime,
                isTestSet: testLogsObject[id][0].isTestSet,
                tests: testLogsObject[id],
                testSetID: id,
            })
        }
        setTestLogs(testLogsLocal)
        console.log({testLogsLocal})
    }, [data.testlogs])



    return (
        <Fragment>
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
            <Card style={{width: '95%', margin: "5rem auto 0", textAlign: 'center', top: '20%'}}>

                <Grid container justify="space-around" style={{margin: "1rem 0rem 0.5rem 0rem"}}>
                    <TextField onChange={handleChange('testName')} label="Test Name" />
                    <FormControlLabel control={<Switch onChange={handleChange('testSets')} color="primary" checked={state.testSets} value="testSets" />} label="Test Sets" />
                    <FormControlLabel control={<Switch onChange={handleChange('tests')} color="primary" checked={state.tests} value="tests" />} label="Tests" />
                </Grid>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                        <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="startDate"
                        label="Start Date"
                        value={selectedDate.startDate}
                        onChange={handleDateChange("startDate")}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        />
                        <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        margin="normal"
                        id="endDate"
                        label="End Date"
                        format="dd/MM/yyyy"
                        value={selectedDate.endDate}
                        onChange={handleDateChange("endDate")}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        />
                        {/* <Button onClick={search} style={{height: '3rem'}} variant="contained" color="primary" className={classes.button}>
                            Search
                        </Button> */}
                    </Grid>
                </MuiPickersUtilsProvider>
            </Card>
            <Card style={{width: '95%', margin: "5rem auto 0", textAlign: 'center', top: '20%'}}>
                {loading&&<CircularProgress className={classes.progress} />}
                {error&&<p>{`Error! ${error.message}`}</p>}
                {!loading&&testLogs.length===0?<h1>Zero Test Logs Found</h1>:<div style={{display: 'block'}}>

                    <h1> Test Logs </h1>
                    <List component="nav" className={classes.root} aria-label="Tests">
                    {testLogs.map((test: any)=>(
                        <ListItem key={test.testSetID} divider>
                        <Test
                            test={test}
                        />
                        </ListItem>
                    ))}
                    </List>
                    {/* <TablePagination
                    style={{margin: '0 auto'}}
                    component="nav"
                    page={page}
                    rowsPerPage={rowsPerPage}
                    count={filteredTests ? filteredTests.length : 100}
                    onChangePage={(event: any, page: number) => {setPage(page)}}
                    rowsPerPageOptions={[5, 10]}
                    onChangeRowsPerPage={(event: any) => {setRowsPerPage(event.target.value)}}
                    /> */}
                </div>}
            </Card>
        </Fragment>
    );
}
