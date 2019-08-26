import React from 'react';
import { useQuery } from 'react-apollo-hooks';
import SelectTestType from './SelectTestType';
import Party from './callTest/Party';
import ConfirmCallTest from './callTest/ConfirmCallTest';
import Success from './Success';
import DefineUMSTest from './umsTest/DefineUMSTest';
import ConfirmUmsTest from './umsTest/ConfirmUmsTest';
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
        case 'DefineUMSTest':
            return <DefineUMSTest/>;
        case 'ConfirmCallTest':
            return <ConfirmCallTest />;
        case 'ConfirmUmsTest':
            return <ConfirmUmsTest />;
        case 'Success':
            return <Success />;
        default:
            return(
                <SelectTestType/>
            );
    }
  
}


export default CreateTestsForm;