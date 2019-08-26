import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import Create from './Create';
import Success from './Success';


export default (props: any) =>{

  const [stage, setStage] = useState('Create');

  return (
    <Card style={{width: '80%', margin: "5rem auto 0", textAlign: 'center', top: '20%'}}>
        {stage==='Create'?
                <Create
                  setNewStage={() => {setStage('Success')}}
                />   
                :
                <Success
                    setNewStage={() => {setStage('Create')}}
                />
        }
    </Card>
  );
};
