import React, { Fragment, useState, useEffect } from 'react';
import {
    createStyles,
    makeStyles,
    Theme,
  } from '@material-ui/core/styles';
// import { useMutation, useQuery } from 'react-apollo-hooks';
// import gql from 'graphql-tag';
// import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Chip from '@material-ui/core/Chip';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
import EditIcon from '@material-ui/icons/Edit';
import { green, red, blue } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';

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

    const editTest = async () => {


    }
    const deleteTest = async () => {


    }

    return (
        <div style={{width: '100%', margin: "auto", textAlign: 'center'}}>
            <div title={props.testDescription} style={{float: 'left', display: 'inline-block'}}>
                <Chip 
                    label={props.testName} 
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
    );
}
