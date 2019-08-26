import React, {Fragment} from 'react';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Button  from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';

const Success = (props: any) => {


    return (
        <Fragment>
          <h1 style={{fontSize: '2rem'}} title="Success"> Success </h1>
          <p style={{fontSize: '2rem', color: 'blue'}}>New Test Was Successfully Created</p>
            <FormControl>
                <Button
                    color="primary"
                    onClick={props.setNewStage}
                    style={{margin: '2rem 0 auto', fontSize: '1.25rem'}}
                >
                Create Another
                </Button>
            </FormControl>
        </Fragment>
    );
}

export default Success;