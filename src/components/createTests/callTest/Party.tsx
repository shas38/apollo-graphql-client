import React, { useState, Fragment} from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import callTestInputsQuery from '../../../graphql/query/callTest/callTestInputsQuery';
import {useStyles} from './SelectTestType';


const Party = (props: any) => {

    const classes = useStyles();
    const partyName = props.partyName

    const { loading, error, data }: any = useQuery(callTestInputsQuery);
    const formInputs = [
        {name: 'DN', inputName: 'selectedDN'},
        {name: 'sbc', inputName: 'selectedSbc'},
        {name: 'product', inputName: 'selectedProduct'},
        {name: 'region', inputName: 'selectedRegion'},
        {name: 'cluster', inputName: 'selectedCluster'},
    ]

    const [state, setState] = useState({
        AParty:{
            __typename: 'AParty',
            selectedDN: '',
            selectedSbc: '',
            selectedProduct: '',
            selectedRegion: '',
            selectedCluster: '',
        },
        BParty:{
            __typename: 'BParty',
            selectedDN: '',
            selectedSbc: '',
            selectedProduct: '',
            selectedRegion: '',
            selectedCluster: '',
        },
    });



    const SetCallTestInputsMutation = useMutation(gql`
        mutation SetCallTestInputs($inputType: String!, $inputValue: String!, $partyName: String!) {
            setCallTestInputs(inputType: $inputType, inputValue: $inputValue, partyName: $partyName) @client
        }
    `);
    const setStageMutation = useMutation(gql`
        mutation SetStage($stage: String!) {
            setStage(stage: $stage) @client
        }
    `);
    


    const handleChange = (inputName: string) => (event: any) => {
        const oldParty = {
            ...Object.create(state)[partyName]
        }
        const newState = {
            ...state,
            [partyName as string]: {...oldParty, [inputName as string]: event.target.value}
        }
        setState(newState);
        SetCallTestInputsMutation({ variables: {inputType: inputName, inputValue: event.target.value, partyName } })
    }

    
    const nextStep = (e: any) => {
        e.preventDefault();
        if(partyName === 'AParty') setStageMutation({ variables: {stage: 'SelectBParty'} }); 
        else setStageMutation({ variables: {stage: 'ConfirmCallTest'} });      
    };
    
    const prevStep = (e: any) => {
        e.preventDefault();
        if(partyName === 'AParty') setStageMutation({ variables: {stage: 'SelectTestType'} }); 
        else setStageMutation({ variables: {stage: 'SelectAParty'} }); 
    };
    
    return (
        <Fragment>
            {loading&&<h2>Loading...</h2>}
            {error&&<p>{`Error! ${error.message}`}</p>}
            <div className={classes.root} style={{display: loading?'none':'block'}}>
            <h1 title={`Define ${partyName}`}> {`Define ${partyName}`} </h1>
            {formInputs.map(({name, inputName}: {name: string, inputName: string})=>(
                <div key={name}>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor={name}>{name}</InputLabel>
                        <Select 
                            value={Object.create(state)[partyName][inputName]}
                            onChange={handleChange(inputName)}
                            inputProps={{
                                name: name,
                                id: name,
                            }}
                        >
                        {data.callTest && data.callTest.AParty[name].map((input: string) => <MenuItem selected key={input} value={input}>{input}</MenuItem>)}
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
        </Fragment>
    );
}


export default Party;