import React, { Fragment } from 'react';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CreateTestsForm from './CreateTestsForm';



const CreateTests = (props: any) => {


  return (
        <Card style={{width: '80%', margin: "5rem auto 0", textAlign: 'center', top: '20%'}}>
          <CreateTestsForm
          />
        </Card>
  );
}


export default CreateTests;