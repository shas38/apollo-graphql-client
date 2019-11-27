    
import React, {useState, useEffect} from 'react';
import { useMutation, useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import FormControl from '@material-ui/core/FormControl';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Button  from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

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
    progress: {
        margin: theme.spacing(2),
    },
  }),
);

const  ConfirmUmsTest = (props: any) => {

    const classes = useStyles();
    const [validationError, setValidationError] = useState<string | null>(null);
    const { loading, error, data }: any = useQuery(gql`
        query selectedUmsTestInput{
            testName @client
            selectedTestType @client
            testDescription @client
            umsTest{
                selectedDN @client
                selectedUms @client 
                selectedCluster @client 
            }
        }
    `);

    
    const setStageMutation = useMutation(gql`
        mutation SetStage($stage: String!) {
            setStage(stage: $stage) @client
        }
    `);
    const GET_TESTS = gql`
    query {
        tests{
            testName
            testDescription
            testType
            test
        }
    }
    `;
    const createTestMutation = useMutation(gql`
        mutation CreateTest($testName: String!, $testType: String!, $testDescription: String, $test: JSON) {
            createTest(test: {testName: $testName, testType: $testType, testDescription: $testDescription, test: $test}) {
                testName
                testDescription
                testType
                test
            }
        }
    `,
    {
      update(cache, { data: { createTest } }) {
        console.log({createTest})
  
        const { tests }: any = cache.readQuery({ query: GET_TESTS });
        
        if(props.type === 'modify'){
            const newTests = tests.map((test: any)=>{
                if(test.testName === createTest.testName) return createTest
                else return test
            })
            cache.writeQuery({
                query: GET_TESTS,
                data: { tests: newTests },
            });
        }
        else{
            cache.writeQuery({
                query: GET_TESTS,
                data: { tests: tests.concat([createTest]) },
            });
        }

      }
    });

    const confirm = async (e: any) => {
        e.preventDefault();
        // PROCESS FORM //
        try{

            const result = await createTestMutation({ variables: {
                testName: data.testName,
                testType: data.selectedTestType,
                testDescription: data.testDescription,
                test: [{
                    testName: data.testName,
                    testType: data.selectedTestType,
                    test:{
                        cluster: data.umsTest.selectedCluster,
                        DN: data.umsTest.selectedDN,
                        ums: +data.umsTest.selectedUms,
                    }
                }]
            }})
            console.log(result)
            setStageMutation({ variables: {stage: 'Success'} }); 
        }
        catch (err){
            console.log({err});
            setValidationError(err)
            throw err;
        } 
    };

    const prevStep = (e: any) => {
        e.preventDefault();
        setStageMutation({ variables: {stage: 'DefineUMSTest'} }); 
    };

    const cancel = ()=>{
        setStageMutation({ variables: {stage: 'SelectTestToModify'} });  
    }
    return (     
        <Grid container justify="center" className={classes.root} >
            {loading&&<CircularProgress className={classes.progress} />}
            {error&&<p>{`Error! ${error.message}`}</p>}
            
            {!loading && <Grid item xs={12} style={{display: 'block'}}>         
                <Grid container justify="center" spacing={10}>
                    <Grid item>
                        <h1 title="Test Type" style={{margin: '2rem auto'}}> Test Type </h1>
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
                    </Grid>
                </Grid>
                <Grid container justify="center" spacing={10}>
                    <Grid item>
                        <h1 title="Test Defination" style={{margin: '2rem auto'}}> Test Defination </h1>
                        <Grid container justify="center" spacing={10}>          
                            <Grid item>
                                {data&&
                                <ListItem>
                                    <ListItemText
                                        primary="DN"
                                        secondary={data.umsTest.selectedDN}
                                    />
                                </ListItem>}  
                            </Grid> 
                            <Grid item>
                                {data&&
                                <ListItem>
                                    <ListItemText
                                        primary="ums"
                                        secondary={data.umsTest.selectedUms}
                                    />  
                                </ListItem>}    
                            </Grid> 
                            <Grid item>
                                {data&&
                                <ListItem>
                                    <ListItemText
                                        primary="cluster"
                                        secondary={data.umsTest.selectedCluster}
                                    />  
                                </ListItem>}    
                            </Grid> 
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container justify="center">
                    {props.type === 'modify' && <FormControl>
                        <Button
                            color="primary"
                            onClick={cancel}
                            style={{margin: '2rem 0 auto'}}
                        >
                        Cancel
                        </Button>
                    </FormControl>}
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
            </Grid>}
            {validationError&&<p style={{color: 'red'}}>{`Error! ${validationError}`}</p>}
        </Grid>
    );
  
}


export default ConfirmUmsTest;