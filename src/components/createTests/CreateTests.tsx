import React, { useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import Card from '@material-ui/core/Card';
import ControlTestsForm from '../defineTests/ControlTestsForm';



const CreateTests = (props: any) => {

  const setStageMutation = useMutation(gql`
    mutation SetStage($stage: String!) {
        setStage(stage: $stage) @client
    }
  `);
  const [ready, setReady] = useState(false);

  useEffect( ()=>{
    const setStage = async () =>{
      setReady( await setStageMutation({ variables: {stage: 'SelectTestType'} }));
    }
    setStage()
  }, [])
  return (
        <Card style={{width: '80%', margin: "5rem auto 0", textAlign: 'center', top: '20%'}}>
          {ready&&<ControlTestsForm
            type={'create'}
          />}
        </Card>
  );
}


export default CreateTests;