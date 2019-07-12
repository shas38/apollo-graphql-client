import React, { } from 'react';
import { useQuery } from 'react-apollo-hooks';
import SelectTestType from './callTest/SelectTestType';
import Party from './callTest/Party';
import ConfirmCallTest from './callTest/ConfirmCallTest';
import SuccessCallTest from './callTest/SuccessCallTest';
import stageQuery from '../../graphql/query/stageQuery';


const CreateTestsForm = (props: any) => {

    const data = useQuery(stageQuery);
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
        case 'SuccessCallTest':
            return <SuccessCallTest />;
        default:
            return(
                <SelectTestType/>
            );
    }
  
}


export default CreateTestsForm;