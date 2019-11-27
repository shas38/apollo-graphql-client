import React, { Fragment, useState } from 'react';
import {
    createStyles,
    makeStyles,
    Theme,
  } from '@material-ui/core/styles';
import { useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Chip from '@material-ui/core/Chip';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import SettingsEthernet from '@material-ui/icons/SettingsEthernet';
import { green, blue } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Modal from './Modal';
import Backdrop from './Backdrop';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
        buttonEdit: {
            color: green[500],
            '&:hover': {
                color: green[700],
            },
            margin: theme.spacing(1),
        },
        chip: {
            margin: theme.spacing(1),
        },
    }));

export default (props: any) =>{

    const classes = useStyles();
    const [deleting, setDeleting] = useState(false);
    
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
    const deleteTestMutation = useMutation(gql`
        mutation DeleteTest($testName: String!) {
            deleteTest(testName: $testName) {
                ok
                n
                testName
            }
        }
    `,
    {
      update(cache, { data: { deleteTest } }) {
            const testName = deleteTest.testName
            console.log({testName})

            const { tests }: any = cache.readQuery({ query: GET_TESTS });

            var newTests = tests.filter(function(test: any, index: any){
                return test.testName !== testName;
            });

            cache.writeQuery({
                query: GET_TESTS,
                data: { tests: newTests },
            });
      }
    });


    const setStageMutation = useMutation(gql`
        mutation SetStage($stage: String!, $modifyTestName: String) {
            setStage(stage: $stage, modifyTestName: $modifyTestName) @client
        }
    `);

    const editTest = async () => {
        // if(props.test.testType === 'testSet')
        //     setStageMutation({ variables: {stage: 'CreateTestSets', modifyTestName: props.testName} })
        // else{
        //     setStageMutation({ variables: {stage: 'SelectTestType', modifyTestName: props.testName} })
        // }
    }
    const deleteTest = async () => {

        setDeleting(true);
    }


    const modalConfirmHandler = async() => {
        setDeleting(false);
        const result = await deleteTestMutation({ variables: {
            testName: props.testName
        }})
        if(result.ok === 0){

        }
        else{
            console.log({result})
        }

    };

    const modalCancelHandler  = () => {
        setDeleting(false);
    };

    return (
        <Fragment>
        {deleting && <Backdrop />}
        {deleting && (
          <Modal
            title="Delete Test?"
            onCancel={modalCancelHandler}
            onConfirm={modalConfirmHandler}
          >
            <p><b>Delete {props.testName}?</b></p>
            <p><b>Test Description:</b> {props.testDescription}</p>
          </Modal>
        )}
        <div style={{width: '100%', margin: "auto", textAlign: 'center'}}>
            <div title={props.testDescription} style={{float: 'left', display: 'inline-block'}}>
                <Chip 
                    label={props.test.testType === 'testSet'? [<SettingsEthernet key='SettingsEthernet' style={{margin: '0 0.5rem 0 0'}}/>, props.test.testName]: props.test.testName} 
                    className={classes.chip} 
                    style={{
                        backgroundColor: blue[500], 
                        color: 'white',
                        minWidth: '15rem',
                        minHeight: '2.3rem',
                        fontSize:   '1.1rem'
                    }}
                />
            </div>
            <div style={{float: 'right', display: 'inline-block'}}>
                <IconButton className={classes.buttonEdit} aria-label="Edit Test" color="primary" onClick={editTest}>
                    <EditIcon/>
                </IconButton>
                <IconButton className={classes.button} aria-label="Delete Test" color="secondary" onClick={deleteTest}>
                    <ClearIcon/>
                </IconButton>
            </div>
        </div>
        </Fragment>
    );
}
