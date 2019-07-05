import React, { useState } from 'react';
import { useQuery } from 'react-apollo-hooks';
import SelectTestType from './callTest/SelectTestType';
import Party from './callTest/Party';
import ConfirmCallTest from './callTest/ConfirmCallTest';
import stageQuery from '../../graphql/query/stageQuery';


const CreateTestsForm = (props: any) => {

    const data = useQuery(stageQuery);
    console.log({CreateTestsForm: data});
    const stage = data.data.stage;

    switch (stage) {
        case 'SelectTestType':
            return (        
                <SelectTestType/>
            );
        case 'SelectAParty':
            return (
            <Party
                partyName={'AParty'}
            />
            );
        case 'SelectBParty':
            return (
            <Party
                partyName={'BParty'}
            />
            );
        case 'ConfirmCallTest':
            return <ConfirmCallTest />;
        // case 4:
        //     return <Success />;
        default:
            return(
                <SelectTestType/>
            );
    }
  
}


export default CreateTestsForm;