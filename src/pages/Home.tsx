import React, { useState } from 'react';
import { connect } from 'react-redux';

const Home = (props: any) => {

  const [writer, setWriter] = useState(props.writers[props.writers.length-1])
  
  const handleClick = () => {
    setWriter(props.writers[props.writers.length-2])
  }
  return (
    <div>
        <h1>Home</h1>
        <p>{writer.name}</p>
        <button onClick={handleClick}>Second Last</button>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    writers: state.writers
  }
}

export default connect(mapStateToProps)(Home);