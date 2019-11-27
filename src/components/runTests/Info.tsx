import React, {useRef} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';


const populateTable = (test: any): any =>{ 
   
  const result = Object.keys(test).map((field: any)=>{
    
    if(typeof(test[field]) === 'object' && test[field] !== null){
      const markUp = <tr key={field}><td colSpan={2}><b>{field}</b></td></tr>;
      return [markUp, ...populateTable(test[field])]
    }
    else{
      return (
        <tr key={field}>
          <td>{field}</td>
          <td>{test[field]}</td>
        </tr>
      )
    }
  })
  console.log(result)
  return result
}
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);

const Transition = React.forwardRef<unknown, TransitionProps>(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default (props: any) => {
  const classes = useStyles();
  const divEl: React.RefObject<HTMLDivElement> = useRef(null);


  return (
    <Dialog                     

      fullScreen  
      open={props.openInfo} 
      onClose={props.closeInfo} 
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={props.closeInfo} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Test Info
          </Typography>
        </Toolbar>
      </AppBar>
      <div             
        ref={divEl} 
        id={'info'} 
      >

        {props.tests.map((test: any)=>(
          <table key={test.testName} style={{margin: '2rem'}}>
            <tbody>
              {populateTable(test).flat()}
            </tbody>
          </table>
        ))}


      </div>
    </Dialog>
  );
}