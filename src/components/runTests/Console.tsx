import React, {useEffect, useState, useRef} from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';


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
  const [testLogs, setTestLogs] = useState('');
  const divEl: React.RefObject<HTMLDivElement> = useRef(null);
  useEffect(()=>{

    if(props.testLogs){
      setTestLogs(testLogs + '<br>' + props.testLogs)
      // divEl.current!.scrollIntoView({ behavior: "smooth" })
      // console.log('divEl.current!.scrollTop', divEl.current)
      // console.log('testLogs', props.testLogs)
    }
    

  }, [props.testLogs]);

  return (
    <Dialog                     

      fullScreen  
      open={props.openResult} 
      onClose={props.closeResult} 
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={props.closeResult} aria-label="Close">
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Console
          </Typography>
        </Toolbar>
      </AppBar>
      <div             
        style={{
          // margin: '1rem',
          padding: '1rem',
          backgroundColor: '#ccccff',
          wordWrap: 'break-word',
          overflow: 'scroll',
          textOverflow: 'ellipsis'
        }}  
        ref={divEl} 
        id={'console'} 
      >

        <pre>
          <div

            dangerouslySetInnerHTML={{__html: testLogs}}
          />
        </pre>
      </div>
    </Dialog>
  );
}