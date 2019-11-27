import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import Card from '@material-ui/core/Card';
import ControlTestsForm from '../defineTests/ControlTestsForm';



const CreateTests = (props: any) => {

  const [ready, setReady] = useState(false);
  const setStageMutation = useMutation(gql`
    mutation SetStage($stage: String!) {
        setStage(stage: $stage) @client
    }
  `);

  useEffect( ()=>{

    const setStage = async () =>{
      setReady( await setStageMutation({ variables: {stage: 'SelectTestToModify'} }));
    }
    setStage()
  }, [])

  return (
        <Card style={{width: '80%', margin: "5rem auto 0", textAlign: 'center', top: '20%'}}>
          {ready&&<ControlTestsForm
            type={'modify'}
          />}
        </Card>
  );
}


export default CreateTests;