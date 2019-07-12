import React, { useState, Fragment} from 'react';
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
import testTypesQuery from '../../../graphql/query/testTypesQuery';

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
    }),
);

const FormPersonalDetails = (props: any) => {

    const classes = useStyles();

    const [selectedTestType, setSelectedTestType]= useState('');
    const [testName, setTestName] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);

    const SetCallTestInputsMutation = useMutation(gql`
        mutation SetCallTestInputs($inputType: String!, $inputValue: String!) {
            setCallTestInputs(inputType: $inputType, inputValue: $inputValue) @client
        }
    `);
    const setStageMutation = useMutation(gql`
        mutation SetStage($stage: String!) {
            setStage(stage: $stage) @client
        }
    `);
    
    const { loading, error, data }: any = useQuery(testTypesQuery);
    const { testTypes } = data;

    const handleChange = (inputName: string) => (event: any) => {
        if(inputName === 'selectedTestType') setSelectedTestType(event.target.value);
        else setTestName(event.target.value);
        SetCallTestInputsMutation({ variables: {inputType: inputName, inputValue: event.target.value } })
    }

    const nextStep = (e: any) => {
        e.preventDefault();
        if(selectedTestType.trim() === '' || testName.trim() === '') {
            setValidationError("Both Test Type and Test Name is Required")
            return
        }

        switch(selectedTestType){
            case 'call': 
                setStageMutation({ variables: {stage: 'SelectAParty'} }); 
                break;
            default: 
                setStageMutation({ variables: {stage: 'SelectAParty'} }); 
                break;
        }    
    };


    return (
        <Fragment>
            {loading&&<h2>Loading...</h2>}
            {error&&<p style={{color: 'red', fontSize: '2rem'}}>{`Error! ${error.message}`}</p>}
            <div className={classes.root} style={{display: loading?'none':'block'}}>
            <h1 title="Select Test Type"> Select Test Type </h1>
            <FormControl className={classes.formControl} style={{display: 'block'}} required>
                <TextField
                    required
                    placeholder="Enter a Test Name"
                    label="Test Name"
                    id='testName'
                    onChange={handleChange('testName')}
                    style={{margin: '0 0 auto'}}
                    helperText="Required"
                />
            </FormControl>
            <FormControl className={classes.formControl} style={{display: 'block'}} >
                <TextField
                    // required
                    placeholder="Short Description"
                    label="Test Description"
                    id='testDescription'
                    onChange={handleChange('testDescription')}
                    style={{margin: '0 0 auto'}}
                    // helperText="Required"
                />
            </FormControl>
            <FormControl className={classes.formControl} required>
                <InputLabel htmlFor="testType">Test Type</InputLabel>
                <Select
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
                <Button
                    color="primary"
                    onClick={nextStep}
                    style={{margin: '2rem 0 auto'}}
                >
                Continue
                </Button>
            </FormControl>
            </div>
            {validationError&&<p style={{color: 'red'}}>{`Error! ${validationError}`}</p>}        
        </Fragment>
    );
}


export default FormPersonalDetails;