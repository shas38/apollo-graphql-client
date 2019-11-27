import React, { useState, useEffect, Fragment} from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import {useStyles} from '../../createTests/SelectTestType';


const DefineCallCentreTest = (props: any) => {

    const classes = useStyles();


    const formInputs = [
        {name: 'DN', inputName: 'selectedDN'},
        {name: 'product', inputName: 'selectedProduct'},
        {name: 'cluster', inputName: 'selectedCluster'},
        {name: 'datacenter', inputName: 'selectedDataCenter'},
    ]
    const [validationError, setValidationError] = useState<string | null>(null);
    const [state, setState] = useState({
        selectedDN: '',
        selectedProduct: '',
        selectedCluster: '',
        selectedDataCenter: '',
    });

    const { loading, error, data, refetch } = useQuery(gql`
        query ClientsTest($DN: String, $product: String, $cluster: String, $datacenter: String, $client: String!){
            clientsTest(DN: $DN, product: $product, cluster: $cluster, datacenter: $datacenter, client: $client){
                DN
                product
                cluster
                datacenter
            }
        }
    `, { 
        variables: {
            DN: state.selectedDN, product: state.selectedProduct, cluster: state.selectedCluster, datacenter: state.selectedDataCenter, client: props.testType
        },
    });

    useEffect(()=>{
        if(props.type === 'modify'){
            setState({
                selectedDN: props.test[0].test[0].test.DN ? props.test[0].test[0].test.DN : '',
                selectedProduct: props.test[0].test[0].test.product ? String(props.test[0].test[0].test.product) : '',
                selectedCluster: props.test[0].test[0].test.cluster ? props.test[0].test[0].test.cluster : '',
                selectedDataCenter: props.test[0].test[0].test.datacenter ? props.test[0].test[0].test.datacenter : '',
            })
            setClientsTestInputsMutation({ variables: {inputType: "selectedDN", inputValue: props.test[0].test[0].test.DN} })
            setClientsTestInputsMutation({ variables: {inputType: "selectedProduct", inputValue: String(props.test[0].test[0].test.product)} })
            setClientsTestInputsMutation({ variables: {inputType: "selectedCluster", inputValue: props.test[0].test[0].test.cluster} })
            setClientsTestInputsMutation({ variables: {inputType: "selectedDataCenter", inputValue: props.test[0].test[0].test.datacenter} })
        }
        else{
            setClientsTestInputsMutation({ variables: {inputType: "selectedDN", inputValue: null} })
            setClientsTestInputsMutation({ variables: {inputType: "selectedProduct", inputValue: null} })
            setClientsTestInputsMutation({ variables: {inputType: "selectedCluster", inputValue: null} })
            setClientsTestInputsMutation({ variables: {inputType: "selectedDataCenter", inputValue: null} })
        }
    }, [])

    useEffect(()=>{
        refetch()
    }, [state])

    const setClientsTestInputsMutation = useMutation(gql`
        mutation SetClientsTestInputs($inputType: String!, $inputValue: String!) {
            setClientsTestInputs(inputType: $inputType, inputValue: $inputValue) @client
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
        setClientsTestInputsMutation({ variables: {inputType: inputName, inputValue: event.target.value} })
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
        setStageMutation({ variables: {stage: 'ConfirmCallCentreTest'} });      
    };
    
    const prevStep = (event: any) => {
        event.preventDefault();
        setStageMutation({ variables: {stage: 'SelectTestType'} });  
    };
    
    const cancel = ()=>{
        setStageMutation({ variables: {stage: 'SelectTestToModify'} });  
    }
    return (
        <Fragment>
            {!data && loading&&<CircularProgress className={classes.progress} />}
            {error&&<p>{`Error! ${error.message}`}</p>}
            {!loading && <div className={classes.root} style={{display: 'block'}}>
            <h1 title={`Define ${props.typeName} Test`}> {`Define ${props.typeName} Test`} </h1>
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
                        {data && data.clientsTest && data.clientsTest[name].map((input: string) => <MenuItem selected key={input} value={input}>{input}</MenuItem>)}
                        </Select>
                    </FormControl>
                </div>
            ))}
            {props.type === 'modify' && <FormControl className={classes.formControl}>
                <Button
                    color="primary"
                    onClick={cancel}
                    style={{margin: '2rem 0 auto'}}
                >
                Cancel
                </Button>
            </FormControl>}
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
            </div>}
            {validationError&&<p style={{color: 'red'}}>{`Error! ${validationError}`}</p>}  
        </Fragment>
    );
}


export default DefineCallCentreTest;