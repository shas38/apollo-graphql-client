import React, { useState, useEffect, useCallback, Fragment} from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import callTestInputsQuery from '../../../graphql/query/callTest/callTestInputsQuery';
import {useStyles} from '../SelectTestType';
import {useSpring, animated} from 'react-spring'

const Party = (props: any) => {

    const classes = useStyles();
    const partyName = props.partyName
    const [validationError, setValidationError] = useState<string | null>(null);
    // const { loading, error, data }: any = useQuery(callTestInputsQuery);
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
        selected: {
            __typename: 'selected',
            selectedDN: '',
            selectedSbc: '',
            selectedProduct: '',
            selectedRegion: '',
            selectedCluster: '',
        }
    });
    const { loading, error, data, refetch } = useQuery(gql`
        query CallTest($DN: String, $sbc: String, $product: String, $region: String, $cluster: String){
            callTest(DN: $DN, sbc: $sbc, product: $product, region: $region, cluster: $cluster){
                DN
                sbc
                product
                region
                cluster
            }
        }
    `, { 
        variables: {
            DN: state.selected.selectedDN, sbc: state.selected.selectedSbc, product: state.selected.selectedProduct, region: state.selected.selectedRegion, cluster: state.selected.selectedCluster,
        },
    });

    useEffect(()=>{
        refetch()

    }, [state.selected])
    
    // useEffect(()=>{
    //     console.log('mounting')
    //     return ()=>{
    //         console.log('unmounting')
    //     }
    // }, [])
    const formInputs = [
        {name: 'DN', inputName: 'selectedDN'},
        {name: 'sbc', inputName: 'selectedSbc'},
        {name: 'product', inputName: 'selectedProduct'},
        {name: 'region', inputName: 'selectedRegion'},
        {name: 'cluster', inputName: 'selectedCluster'},
    ]





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
        const selected = {
            ...Object.create(state)['selected']
        }
        const newState = {
            ...state,
            [partyName as string]: {...oldParty, [inputName as string]: event.target.value},
            selected: {...selected, [inputName as string]: event.target.value}
        }
        setState(newState);
        SetCallTestInputsMutation({ variables: {inputType: inputName, inputValue: event.target.value, partyName } })

    }

    
    const nextStep = (e: any) => {
        e.preventDefault();
        const party = Object.create(state)[partyName]
        
        let condition = Object.keys(party).every((key)=>{
            if(key === '__typename') return true;
            else if(party[key].trim() === "") return true;
            else return false;
        })
        if(condition){
            setValidationError("At least one field needs to be specified!");
            return;
        }
        setValidationError(null);
        setState({...state, selected: {
            __typename: 'selected',
            selectedDN: '',
            selectedSbc: '',
            selectedProduct: '',
            selectedRegion: '',
            selectedCluster: '',
        }});
        if(partyName === 'AParty') setStageMutation({ variables: {stage: 'SelectBParty'} }); 
        else setStageMutation({ variables: {stage: 'ConfirmCallTest'} });      
    };
    
    const prevStep = (e: any) => {
        e.preventDefault();
        setState({...state, selected: {
            __typename: 'selected',
            selectedDN: '',
            selectedSbc: '',
            selectedProduct: '',
            selectedRegion: '',
            selectedCluster: '',
        }});
        if(partyName === 'AParty') setStageMutation({ variables: {stage: 'SelectTestType'} }); 
        else setStageMutation({ variables: {stage: 'SelectAParty'} }); 
    };
    
    const springProps = useSpring({to: { opacity: 1, marginTop: 0 }, from: { opacity: 0, marginTop: -500 }})
    return (
        <animated.div  style={springProps}>
        <Fragment>
            {!data && loading&&<h2>Loading...</h2>}
            {error&&<p>{`Error! ${error.message}`}</p>}
            {data&&<div className={classes.root} style={{display: 'block'}}>
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
                        <MenuItem selected key={'none'} value={''}>None</MenuItem>)
                        {data.callTest && data.callTest[name].map((input: string) => <MenuItem selected key={input} value={input}>{input}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
            ))}
            <FormControl className={classes.formControl} >
                <Button
                    color="primary"
                    onClick={prevStep}
                    style={{margin: '2rem 0 auto'}}
                >
                Back
                </Button>
            </FormControl>
            <FormControl className={classes.formControl} style={{display: 'inline-block'}}>
                <Button
                    color="primary"
                    onClick={nextStep}
                    style={{margin: '2rem 0 auto'}}
                >
                Continue
                </Button>
            </FormControl>
            </div>}
            {validationError&&<p style={{color: 'red'}}>{`Error! ${validationError}`}</p>}      
        </Fragment>
        </animated.div>
    );
}


export default Party;