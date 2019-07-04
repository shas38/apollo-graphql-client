import React, { useRef, useState, Fragment} from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'; 
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import testTypesQuery from '../../graphql/query/testTypesQuery';
import selectedTestTypeQuery from '../../graphql/query/selectedTestTypeQuery';

const useStyles = makeStyles((theme: Theme) =>
createStyles({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
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

    const inputLabel = useRef<HTMLLabelElement>(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
      setLabelWidth(inputLabel.current!.offsetWidth);
    }, []);

    // const [selectedTestType, setSelectedTestType] = React.useState('');

    const SetSelectedTestTypeMutation = useMutation(gql`
        mutation SetSelectedTestType($selectedTestType: String!) {
            setSelectedTestType(selectedTestType: $selectedTestType) @client
        }
    `);

    const { loading, error, data }: any = useQuery(testTypesQuery);
    const { testTypes } = data;
    
    let selectedTestType = useQuery(selectedTestTypeQuery);


    const handleChange = (event: any) => {
        // setSelectedTestType(event.target.value);
        SetSelectedTestTypeMutation({ variables: { selectedTestType: event.target.value } })
    }

    

    const nextStep = (e: any) => {
        e.preventDefault();
        props.nextStep();
    };

    

    const theme = createMuiTheme({
        /* theme for v1.x */
    });

    return (

            <MuiThemeProvider theme={theme}>
                <Fragment>
                    {loading&&<h2>"Loading..."</h2>}
                    {error&&<p>{`Error! ${error.message}`}</p>}
                    <div style={{display: loading?'none':'inline-block'}}>
                    <h1 title="Select Test Type"> Select Test Type </h1>
                    <FormControl className={classes.formControl}>
                        <InputLabel ref={inputLabel} htmlFor="testType">Test Type</InputLabel>
                        <Select
                            value={selectedTestType.data.selectedTestType}
                            onChange={handleChange}
                            // defaultChecked={selectedTestType}
                            inputProps={{
                                name: 'testType',
                                id: 'testType',
                            }}
                        >
                        {testTypes && testTypes.map((testType: string) => <MenuItem selected key={testType} value={testType}>{testType}</MenuItem>)}
                        </Select>
                        <Button
                            color="primary"
                            onClick={nextStep}
                            style={{margin: '2rem 0 auto'}}
                        >
                        Continue
                        </Button>
                    </FormControl>
                    </div>
                </Fragment>
            </MuiThemeProvider>
    );
}


export default FormPersonalDetails;