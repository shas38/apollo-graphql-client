import React, { useState, Fragment, useEffect} from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import testTypesQuery from '../../graphql/query/testTypesQuery';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column'
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        progress: {
            margin: theme.spacing(2),
        },
    }),
);

const FormPersonalDetails = (props: any) => {

    const classes = useStyles();

    const [selectedTestType, setSelectedTestType]= useState('');
    const [testName, setTestName] = useState('');
    const [testDescription, setTestDescription] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    const SetCallTestInputsMutation = useMutation(gql`
        mutation SetCallTestInputs($inputType: String!, $inputValue: String!) {
            setCallTestInputs(inputType: $inputType, inputValue: $inputValue) @client
        }
    `);
    const setStageMutation = useMutation(gql`
        mutation SetStage($stage: String!, $modifyTestName: String) {
            setStage(stage: $stage, modifyTestName: $modifyTestName) @client
        }
    `);
    
    useEffect(()=>{

        if(props.type === 'modify'){
            if(props.test[0]){
                setTestName(props.test[0].testName)
                setSelectedTestType(props.test[0].testType)
                setTestDescription(props.test[0].testDescription)
                SetCallTestInputsMutation({ variables: {inputType: "testName", inputValue: props.test[0].testName } })
                SetCallTestInputsMutation({ variables: {inputType: "selectedTestType", inputValue: props.test[0].testType } })
                SetCallTestInputsMutation({ variables: {inputType: "testDescription", inputValue: props.test[0].testDescription } })
            }

        }
        else{
            SetCallTestInputsMutation({ variables: {inputType: "testDescription", inputValue: null } })
        }
    }, [])
    const { loading, error, data }: any = useQuery(testTypesQuery);
    const { testTypes } = data;

    const handleChange = (inputName: string) => (event: any) => {
        if(inputName === 'selectedTestType') setSelectedTestType(event.target.value);
        else if(inputName === 'testDescription') setTestDescription(event.target.value)
        else setTestName(event.target.value);
        SetCallTestInputsMutation({ variables: {inputType: inputName, inputValue: event.target.value } })
    }

    const tests = useQuery(gql`
        query {
            tests{
                testName
                testDescription
                testType
                test
            }
        }
    `);

    const nextStep = (e: any) => {
        e.preventDefault();
        if(selectedTestType.trim() === '' || testName.trim() === '') {
            setValidationError("Both Test Type and Test Name is Required")
            return
        }
        if(props.test && props.test[0] && testName === props.test[0].testName){

        }
        else if(tests.data.tests.some((test: any)=>{
            return test.testName === testName;
        })){
            setValidationError(`${testName} already exists`)
            return;
        }

        switch(selectedTestType){
            case 'call': 
                setStageMutation({ variables: {stage: 'SelectAParty', modifyTestName: testName} }); 
                break;
            case 'ums': 
                setStageMutation({ variables: {stage: 'DefineUMSTest', modifyTestName: testName} }); 
                break;
            case 'callcentre': 
                setStageMutation({ variables: {stage: 'DefineCallCentreTest', modifyTestName: testName} }); 
                break;
            case 'mireception': 
                setStageMutation({ variables: {stage: 'DefineMireceptionTest', modifyTestName: testName} }); 
                break;
            case 'commpilot': 
                setStageMutation({ variables: {stage: 'DefineCommpilotTest', modifyTestName: testName} }); 
                break;
            case 'commpilot-DOT': 
                setStageMutation({ variables: {stage: 'DefineCommpilot-DOTTest', modifyTestName: testName} }); 
                break;
            default: 
                setStageMutation({ variables: {stage: 'SelectAParty', modifyTestName: testName} }); 
                break;
        }    
    };
    const cancel = ()=>{
        setStageMutation({ variables: {stage: 'SelectTestToModify'} });  
    }
    return (
        <Fragment>
            {loading&&<CircularProgress className={classes.progress} />}
            {error&&<p style={{color: 'red', fontSize: '2rem'}}>{`Error! ${error.message}`}</p>}
            {!loading && <div className={classes.root} style={{display: 'block'}}>
                <h1 title="Select Test Type"> Select Test Type </h1>
                <FormControl className={classes.formControl} style={{display: 'block'}} required>
                    <TextField
                        required
                        disabled={props.type === 'modify'}
                        placeholder="Enter a Test Name"
                        label="Test Name"
                        id='testName'
                        onChange={handleChange('testName')}
                        style={{margin: '0 0 auto'}}
                        helperText="Required"
                        value={testName}
                    />
                </FormControl>
                <FormControl className={classes.formControl} style={{display: 'block'}} >
                    <TextField 
                        placeholder="Short Description"
                        label="Test Description"
                        id='testDescription'
                        onChange={handleChange('testDescription')}
                        style={{margin: '0 0 auto'}}
                        value={testDescription}
                    />
                </FormControl>
                <FormControl className={classes.formControl} required style={{display: 'inline-block'}}>
                    <InputLabel htmlFor="testType">Test Type</InputLabel>
                    <Select
                        disabled={props.type === 'modify'}
                        style={{minWidth: '11.5rem'}}
                        value={selectedTestType}
                        onChange={handleChange('selectedTestType')}
                        inputProps={{
                            name: 'testType',
                            id: 'testType',
                        }}
                    >
                    {testTypes && testTypes.map((testType: string) => <MenuItem selected key={testType} value={testType}>{testType}</MenuItem>)}
                    </Select>
                    <FormHelperText>Required</FormHelperText>

                </FormControl>
                <h1></h1>
                
                {props.type === 'modify' &&
                <FormControl> 
                    <Button
                        color="primary"
                        onClick={cancel}
                        style={{margin: '2rem 1rem auto'}}
                    >
                    Cancel
                    </Button>
                </FormControl>}
                
                <FormControl >
                    <Button
                        color="primary"
                        onClick={nextStep}
                        style={{margin: '2rem 1rem auto'}}
                    >
                    Continue
                    </Button>
                </FormControl>
            </div>}
            {validationError&&<p style={{color: 'red'}}>{`Error! ${validationError}`}</p>}        
        </Fragment>
    );
}


export default FormPersonalDetails;