import React, {} from 'react';
import { useQuery } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import ResultTable from './ResultTable';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    progress: {
      margin: theme.spacing(2),
    },
  }),
);


const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default (props: any) => {
  const classes = useStyles();

  return (
      <Dialog fullScreen open={props.openResult} onClose={props.closeResult} TransitionComponent={Transition}>
        <AppBar className={classes.appBar} style={{position: 'sticky', top: '0', marginBottom: '1rem'}}>
          <Toolbar >
            <IconButton edge="start" color="inherit" onClick={props.closeResult} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Test Result
            </Typography>
          </Toolbar>
        </AppBar>
        <ResultTable 
          testlogs={props.tests.tests}
        />
      </Dialog>
  );
}