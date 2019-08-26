import React, { useState, useEffect, Fragment} from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import {useStyles} from '../SelectTestType';


const DefineUMSTest = (props: any) => {

    const classes = useStyles();

    const formInputs = [
        {name: 'DN', inputName: 'selectedDN'},
        {name: 'ums', inputName: 'selectedUms'},
        {name: 'cluster', inputName: 'selectedCluster'},
    ]
    const [validationError, setValidationError] = useState<string | null>(null);
    const [state, setState] = useState({
        selectedDN: '',
        selectedUms: '',
        selectedCluster: '',
    });

    const { loading, error, data, refetch } = useQuery(gql`
        query UmsTest($DN: String, $ums: String, $cluster: String){
            umsTest(DN: $DN, ums: $ums, cluster: $cluster){
                DN
                ums
                cluster
            }
        }
    `, { 
        variables: {
            DN: state.selectedDN, ums: state.selectedUms, cluster: state.selectedCluster,
        },
    });

    useEffect(()=>{
        refetch()
    }, [state])

    const setUmsTestInputsMutation = useMutation(gql`
        mutation SetUmsTestInputs($inputType: String!, $inputValue: String!) {
            setUmsTestInputs(inputType: $inputType, inputValue: $inputValue) @client
        }
    `);

    const setStageMutation = useMutation(gql`
        mutation SetStage($stage: String!) {
            setStage(stage: $stage) @client
        }
    `);
    


    const handleChange = (inputName: string) => (event: any) => {

        setState({
            ...state,
            [inputName as string]: event.target.value
        });
        setUmsTestInputsMutation({ variables: {inputType: inputName, inputValue: event.target.value} })
    }

    
    const nextStep = (event: any) => {
        event.preventDefault();
        const stateObject =Object.create(state);
        let condition = Object.keys(state).every((key)=>{
            
            if(key === '__typename') return true;
            else if(stateObject[key].trim() === "") return true;
            else return false;
        })
        if(condition){
            setValidationError("At least one field needs to be specified!");
            return;
        }
        setValidationError(null);
        setStageMutation({ variables: {stage: 'ConfirmUmsTest'} });      
    };
    
    const prevStep = (event: any) => {
        event.preventDefault();
        setStageMutation({ variables: {stage: 'SelectTestType'} });  
    };
    
    return (
        <Fragment>
            {!data && loading&&<h2>Loading...</h2>}
            {error&&<p>{`Error! ${error.message}`}</p>}
            <div className={classes.root} style={{display: 'block'}}>
            <h1 title={`Define UMS Test`}> {`Define UMS Test`} </h1>
            {formInputs.map(({name, inputName}: {name: string, inputName: string})=>(
                <div key={name}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor={name}>{name}</InputLabel>
                        <Select 
                            value={Object.create(state)[inputName]}
                            onChange={handleChange(inputName)}
                            inputProps={{
                                name: name,
                                id: name,
                            }}
                        >
                        <MenuItem selected key={'none'} value={''}>None</MenuItem>)
                        {data.umsTest && data.umsTest[name].map((input: string) => <MenuItem selected key={input} value={input}>{input}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
            ))}
            <FormControl className={classes.formControl}>
                <Button
                    color="primary"
                    onClick={prevStep}
                    style={{margin: '2rem 0 auto'}}
                >
                Back
                </Button>
            </FormControl>
            <FormControl className={classes.formControl}>
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


export default DefineUMSTest;