    
import React, {useState} from 'react';
import { useMutation, useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import FormControl from '@material-ui/core/FormControl';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button  from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import selectedCallTestInputQuery from '../../../graphql/query/callTest/selectedCallTestInputQuery';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(10),
    },
  }),
);

const  ConfirmCallTest = (props: any) => {

    const classes = useStyles();
    const [validationError, setValidationError] = useState<string | null>(null);
    const { loading, error, data }: any = useQuery(selectedCallTestInputQuery);

    console.log({ConfirmCallTest: data})
    const setStageMutation = useMutation(gql`
        mutation SetStage($stage: String!) {
            setStage(stage: $stage) @client
        }
    `);

    const createTestMutation = useMutation(gql`
        mutation CreateTest($testName: String!, $testType: String!, $testDescription: String, $AParty: SelectedParty!, $BParty: SelectedParty!) {
            createTest(test: {testName: $testName, testType: $testType, testDescription: $testDescription, AParty: $AParty, BParty: $BParty}) {
                testName
                _id
            }
        }
    `);

    const confirm = async (e: any) => {
        e.preventDefault();
        // PROCESS FORM //
        try{
            const AParty = {
                cluster: data.AParty.selectedCluster,
                DN: data.AParty.selectedDN,
                product: data.AParty.selectedProduct,
                region: data.AParty.selectedRegion,
                sbc: data.AParty.selectedSbc,
            }
            const BParty = {
                cluster: data.BParty.selectedCluster,
                DN: data.BParty.selectedDN,
                product: data.BParty.selectedProduct,
                region: data.BParty.selectedRegion,
                sbc: data.BParty.selectedSbc,
            }
            const result = await createTestMutation({ variables: {
                testName: data.testName,
                testType: data.selectedTestType,
                testDescription: data.testDescription,
                AParty: AParty,
                BParty: BParty,
            }})
            console.log(result)
            setStageMutation({ variables: {stage: 'SuccessCallTest'} }); 
        }
        catch (err){
            console.log({err});
            setValidationError(err)
            throw err;
        } 
    };

    const prevStep = (e: any) => {
        e.preventDefault();
        setStageMutation({ variables: {stage: 'SelectBParty'} }); 
    };

    const displayParty = (party: any) => (
        <List >
            {   
                Object.keys(party).map((key: string)=>{
                    if(key !== '__typename'){
                        return (
                            <ListItem key={key}>
                                <ListItemText
                                    primary={key.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()} 
                                    secondary={party[key]}
                                />
                            </ListItem>
                        )
                    }
                })
            }
        </List>
    )

    
    return (     
        <Grid container justify="center" className={classes.root} >
            {loading&&<h2>Loading...</h2>}
            {error&&<p>{`Error! ${error.message}`}</p>}
            <h1 title="TestType"> Test Type </h1>  
            <Grid item xs={12} style={{display: loading?'none':'block'}}>         
                <Grid container justify="center" spacing={10}>          
                    <Grid item>
                        {data&&
                        <ListItem>
                            <ListItemText
                                primary="TEST TYPE"
                                secondary={data.selectedTestType}
                            />
                        </ListItem>}  
                    </Grid> 
                    <Grid item>
                        {data&&
                        <ListItem>
                            <ListItemText
                                primary="TEST NAME"
                                secondary={data.testName}
                            />  
                        </ListItem>}    
                    </Grid> 
                    <Grid item>
                        {data&&
                        <ListItem>
                            <ListItemText
                                primary="TEST DESCRIPTION"
                                secondary={data.testDescription}
                            />  
                        </ListItem>}    
                    </Grid> 
                </Grid>
                <Grid container justify="center" spacing={10}>
                    <Grid item>
                        <h1 title="AParty" style={{margin: '0rem 0 auto'}}> AParty </h1>
                        {data.AParty && displayParty(data.AParty)}
                    </Grid>
                    <Grid item>
                        <h1 title="BParty" style={{margin: '0rem 0 auto'}}> BParty </h1>
                        {data.BParty && displayParty(data.BParty)}
                    </Grid>   
                </Grid>
                <Grid container justify="center">
                    <FormControl>
                        <Button
                            color="primary"
                            onClick={prevStep}
                            style={{margin: '2rem 0 auto'}}
                        >
                        Back
                        </Button>
                    </FormControl>
                    <FormControl>
                        <Button
                            color="primary"
                            onClick={confirm}
                            style={{margin: '2rem 0 auto'}}
                        >
                        Submit
                        </Button>
                    </FormControl>
                </Grid>
            </Grid>
            {validationError&&<p style={{color: 'red'}}>{`Error! ${validationError}`}</p>}
        </Grid>
    );
  
}


export default ConfirmCallTest;