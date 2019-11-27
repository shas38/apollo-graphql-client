import React, { Fragment } from 'react';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import { amber, green } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions/transition';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
  }),
);

const variantIcon: any = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

export interface Props {
    className?: string;
    message?: string;
    onClose?: () => void;
    variant: string;
}

function TransitionLeft(props: TransitionProps) {
    return <Slide {...props} direction="left" />;
}

export default (props: any) =>{

    const classes: any = useStyles();
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarContent, setSnackbarContent] = React.useState({message: '', variant: "info", Icon: variantIcon["info"]});

    const rebuildCollection = async () =>{
        try{
            let data: any = await fetch(`${process.env.REACT_APP_DOMAIN}/api/rebuildBWusers`, {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            });
            data = await data.json();
            
            setSnackbarContent({message: 'Command Sent', variant: 'info', Icon: variantIcon["info"]});
            setOpenSnackbar(true);
        }
        catch(err){
            setSnackbarContent({message: err.message, variant: 'error', Icon: variantIcon["error"]});
            setOpenSnackbar(true);
            console.log(err)
        }
    }


    return (
        <Fragment>
            <Snackbar
                TransitionComponent={(props: any)=> <TransitionLeft {...props} className={classes[snackbarContent.variant]}/>}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={()=>{setOpenSnackbar(false)}}
                message={
                    <span id="client-snackbar" className={classes.message}>
                        <snackbarContent.Icon className={classes.icon} />
                        {snackbarContent.message}
                    </span>
                }
                action={[
                    <IconButton key="close" aria-label="close" color="inherit" onClick={()=>{setOpenSnackbar(false)}}>
                        <CloseIcon className={classes.icon} />
                    </IconButton>,
                ]}
            >
            </Snackbar>

            <Card style={{width: '80%', margin: "5rem auto 0", textAlign: 'center', top: '20%'}}>
                <List component="nav" aria-label="Manage">
                    <ListItem divider>
                        <Button style={{margin: "0 auto", textAlign: 'center'}} variant="contained" color="primary" className={classes.button} onClick={rebuildCollection}>
                            Rebuild BWUsers Collection
                        </Button>
                    </ListItem>
                </List>
            </Card>
        </Fragment>
    );
}
