import React, {useEffect, useState} from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import SelectTestType from '../createTests/SelectTestType';
import Party from './callTest/Party';
import ConfirmCallTest from './callTest/ConfirmCallTest';
import Success from '../createTests/Success';
import DefineUMSTest from './umsTest/DefineUMSTest';
import DefineCallCentreTest from './callCentreTest/DefineCallCentreTest';
import ConfirmUmsTest from './umsTest/ConfirmUmsTest';
import ConfirmCallCentreTest from './callCentreTest/ConfirmCallCentreTest';
import stageQuery from '../../graphql/query/stageQuery';
import SelectTestToModify from '../modifyTests/SelectTestToModify';
import CreateTestSets from '../createTestSets/Create';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    progress: {
      margin: theme.spacing(2),
    },
  }),
);

const CreateTestsForm = (props: any) => {
    const classes = useStyles();
    const newStage = useQuery(stageQuery);
    let searchResults = useQuery(gql`
        query search{
        search @client(always: true)
        }
    `);
    const { loading, error, data, refetch } = useQuery(gql`
        query Tests($testName: String){
            tests(testName: $testName){
                testName
                testDescription
                testType
                test
            }
        }
    `, { 
        variables: {
            testName: newStage.data.modifyTestName
        },
    });

    useEffect(()=>{
        console.log({stage: newStage.data, data})
        refetch()
    }, [newStage])
    
    if(loading){
        return <CircularProgress className={classes.progress} />
    }else
    switch (newStage.data.stage) {
        case 'SelectTestToModify':
            return (
                <SelectTestToModify 
                    search={searchResults.data.search}
                />
            )
        case 'SelectTestType':
            return (
                <SelectTestType
                    type={props.type}
                    test={data.tests}
                />
            )
        case 'SelectAParty':
            return (
                <Party
                    partyName={'AParty'}
                    type={props.type}
                    test={data.tests}
                />
            );
        case 'SelectBParty':
            return (
                <Party
                    partyName={'BParty'}
                    type={props.type}
                    test={data.tests}
                />
            );
        case 'DefineUMSTest':
            return (
                <DefineUMSTest
                    type={props.type}
                    test={data.tests}
                />
            )
        case 'DefineCallCentreTest':
            return (
                <DefineCallCentreTest
                    type={props.type}
                    test={data.tests}
                    typeName={"Call Centre"}
                    testType={"callcentre"}
                />
            )
        case 'DefineMireceptionTest':
            return (
                <DefineCallCentreTest
                    type={props.type}
                    test={data.tests}
                    typeName={"Mireception"}
                    testType={"mireception"}
                />
            )
        case 'DefineCommpilotTest':
            return (
                <DefineCallCentreTest
                    type={props.type}
                    test={data.tests}
                    typeName={"Commpilot"}
                    testType={"commpilot"}
                />
        )
        case 'DefineCommpilot-DOTTest':
            return (
                <DefineCallCentreTest
                    type={props.type}
                    test={data.tests}
                    typeName={"Commpilot-DOT"}
                    testType={"commpilot-DOT"}
                />
        )
        case 'ConfirmCallCentreTest':
            return (
                <ConfirmCallCentreTest
                    type={props.type}
                    test={data.tests}
                />
            )
        case 'ConfirmCallTest':
            return (
                <ConfirmCallTest 
                    type={props.type}
                    test={data.tests}
                />
            )
        case 'ConfirmUmsTest':
            return (
                <ConfirmUmsTest 
                    type={props.type}
                    test={data.tests}
                />
            )
        case 'CreateTestSets':
            return (
                <CreateTestSets 
                    type={props.type}
                    test={data.tests}
                />
            )
        case 'Success':
            return (
                <Success 
                    type={props.type}
                    test={data.tests}
                />
            )
        default:
            return props.type==='create'?<SelectTestType/>:<SelectTestToModify />;
    }
  
}


export default CreateTestsForm;