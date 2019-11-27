import React, {Fragment} from 'react';
import { useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Button  from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';

const Success = (props: any) => {

    const setStageMutation = useMutation(gql`
        mutation SetStage($stage: String!) {
            setStage(stage: $stage) @client
        }
    `);

    const createAnother = (e: any) => {
        e.preventDefault();
        if(props.type === 'create'){
            setStageMutation({ variables: {stage: 'SelectTestType'} }); 
        }
        else{
            // if(props.tests[0].testType === 'testSet')
            //     setStageMutation({ variables: {stage: 'SelectTestToModify'} }); 
            // else setStageMutation({ variables: {stage: 'SelectTestType'} }); 
            setStageMutation({ variables: {stage: 'SelectTestToModify'} }); 
        }
        
    };

    return (
        <Fragment>
          <h1 style={{fontSize: '2rem'}} title="Success"> Success </h1>
          <p style={{fontSize: '2rem', color: 'blue'}}>New Test Was Successfully Created</p>
            <FormControl>
                <Button
                    color="primary"
                    onClick={createAnother}
                    style={{margin: '2rem 0 auto', fontSize: '1.25rem'}}
                >
                    {props.type === 'modify'? "Modify Another": "Create Another"}
                </Button>
            </FormControl>
        </Fragment>
    );
}

export default Success;