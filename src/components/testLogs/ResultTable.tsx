import React, {Fragment, useEffect} from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import './ResultTable.css'

const Headers = (props: any) =>{
    return (
        <Fragment>
            <tr>
                <td><b>Test Name</b></td>
                <td>{props.testlog.testName}</td>
            </tr>
            <tr>
                <td><b>Start Time</b></td>
                <td>{props.testlog.startTime}</td>
            </tr>
            <tr>
                <td><b>End Time</b></td>
                <td>{props.testlog.endTtime}</td>
            </tr>
            <tr>
                <td><b>Test Type</b></td>
                <td>{props.testlog.testType}</td>
            </tr>
        </Fragment>
    )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

export default (props: any) => {

    const classes = useStyles();
    useEffect(()=>{
        console.log(props.testlogs)
    }, [props.testlogs])
  return (
    <div>
    <List component="nav" className={classes.root} aria-label="Tests">
    {props.testlogs.map((testlog: any) => {
        if(testlog.testType === 'call'){
            return(
                <ListItem key={testlog.id} divider style={{display: 'block'}}>
                    <table>
                        <tbody>
                        <Headers 
                            testlog={testlog}
                        />
                        {testlog.results && Object.keys(testlog.results).map((result:any)=>{
                            if(result === 'failure'){
                                return;
                            }
                            else{
                                return(
                                    <Fragment key={result}>
                                        <tr>
                                            <td colSpan={2}><b>{result}</b></td>
                                        </tr>
                                        <tr>
                                            <td><b>Result</b></td>
                                            <td>{testlog.results[result].result}</td>
                                        </tr>
                                        {Object.keys(testlog.results[result].resultdata).map((log:string)=>{
                                            if(log.toLowerCase().includes('log')){
                                                return (
                                                    <tr key={log}>
                                                        <td><b>{log}</b></td>
                                                        <td><button onClick={()=>{window.open(testlog.results[result].resultdata[log],'_blank')}}>View Logs</button></td>
                                                    </tr>  
                                                )
                                            }
                                            else{
                                                return (
                                                    <tr key={log}>
                                                        <td><b>{log}</b></td>
                                                        <td>{testlog.results[result].resultdata[log]}</td>
                                                    </tr> 
                                                )
                                            }
                                        })}
                                    </Fragment>
                                )
                            }
                        })}
                        </tbody>
                    </table>
                </ListItem>
            )
        }
        else if (testlog.testType === 'ums'){
            return(
                <ListItem key={testlog.id} divider style={{display: 'block'}}>
                    <table>
                        <tbody>
                            <Headers 
                                testlog={testlog}
                            />
                            <tr>
                                <td><b>Result</b></td>
                                <td>{testlog.results.UMS.result}</td>
                            </tr> 
                        </tbody>
                    </table>
                    <h4>resultdata:</h4>
                    <pre>
                        <div
                            dangerouslySetInnerHTML={{__html: testlog.results.UMS.resultdata}}
                        />
                    </pre>
                </ListItem>
            )
        }
        else{
            return(
                <ListItem key={testlog.id} divider style={{display: 'block'}}>
                    <table>
                        <tbody>
                            <Headers 
                                testlog={testlog}
                            />
                            <tr>
                                <td><b>Result</b></td>
                                <td>{testlog.results[testlog.testType as string].result}</td>
                            </tr> 
                        </tbody>
                    </table>
                    <h4>resultdata:</h4>
                    <pre>
                        <div
                            dangerouslySetInnerHTML={{__html: testlog.results[testlog.testType as string].resultdata.logData}}
                        />
                    </pre>
                    {
                        testlog.results[testlog.testType as string].resultdata.SCREENSHOT&&
                        <div>
                            <img src={`data:image/png;base64,${testlog.results[testlog.testType as string].resultdata.SCREENSHOT}`}/>
                        </div>
                    }
                </ListItem>
            )
        }
    })}
    </List>
    </div>
  );
}