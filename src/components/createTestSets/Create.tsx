import React, { Fragment, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation, useQuery } from 'react-apollo-hooks';
import FormHelperText from '@material-ui/core/FormHelperText';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Chip from '@material-ui/core/Chip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: 'column'
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
        },
    }),
);
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

function getStyles(name: string, personName: string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }


export default (props: any) =>{

  const classes = useStyles();
  const theme = useTheme();

  const [testName, setTestName] = useState('');
  const [allowDuplicate, setAllowDuplicate] = useState(true);
  const [testDescription, setTestDescription] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

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
  const { loading, error, data } = useQuery(GET_TESTS);

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

      cache.writeQuery({
        query: GET_TESTS,
        data: { tests: tests.concat([createTest]) },
      });
    }
  });


  const handleChange = (inputName: string) => (event: any) => {
    if(inputName === 'testName') setTestName(event.target.value);
    else if(inputName === 'testDescription') setTestDescription(event.target.value);
    else if(inputName === 'allowDuplicate') setAllowDuplicate(event.target.checked );
  }

  function handleSelectedTests(event: React.ChangeEvent<{ value: unknown }>) {
    setSelectedTests(event.target.value as string[]);

  }

  const createTestSet = async () =>{
    
    let filteredTest: any = [];

    for(let test of data.tests){
        if(selectedTests.includes(test.testName)){
          if(allowDuplicate){
            filteredTest = [...filteredTest, ...test.test]
          }
          else{
            for(let currentTest of test.test){
              if(!filteredTest.some((currentFilteredTest: any)=>{
                return currentFilteredTest.testName === currentTest.testName;
              })){
                filteredTest = [...filteredTest, currentTest];
              }
            }
          }
        }
    }

    // console.log(filteredTest)
    
    if(testName.trim().length === 0 || filteredTest.length === 0) {
      setValidationError('Enter all the required fields!');
      return
    }
    else if(data.tests.some((test: any)=>{
      return test.testName === testName;
    })) {
      setValidationError('Test Set Name is Already Taken!');
      return
    }

    const result = await createTestMutation({ variables: {
      testName,
      testType: 'testSet',
      testDescription,
      test: filteredTest,
    }})
    console.log({result})

    props.setNewStage()
  }
  return (
    <Fragment>
      {loading&&<h2>Loading...</h2>}
      {error&&<p style={{color: 'red', fontSize: '2rem'}}>{`Error! ${error.message}`}</p>}
      <div className={classes.root} style={{display: loading?'none':'block'}}>
      <h1 title="Select Test Type"> Select Test Type </h1>
      <FormControl className={classes.formControl} style={{display: 'block'}} required>
          <TextField
              required
              placeholder="Enter a Test Name"
              label="Test Set Name"
              id='testName'
              onChange={handleChange('testName')}
              style={{margin: '0 0 auto'}}
              helperText="Required"
          />
      </FormControl>
      <FormControl className={classes.formControl} style={{display: 'block'}} >
          <TextField
              placeholder="Short Description"
              label="Test Description"
              id='testDescription'
              onChange={handleChange('testDescription')}
              style={{margin: '0 0 auto'}}
          />
      </FormControl>
      <FormControl className={classes.formControl} style={{display: 'inline-block'}} required>
        <InputLabel htmlFor="selectTests">Select Tests</InputLabel>
        <Select
            required
            style={{minWidth: '11.5rem'}}
            multiple
            value={selectedTests}
            onChange={handleSelectedTests}
            input={<Input required id="selectTests"/>}
            renderValue={selected => (
                <div className={classes.chips}>
                {(selected as string[]).map(value => (
                    <Chip key={value} label={value} className={classes.chip} />
                ))}
                </div>
            )}
            MenuProps={MenuProps}
        >
          
        {data.tests && data.tests.map((test: any) => (
            <MenuItem key={test.testName} value={test.testName} style={getStyles(test.testName, selectedTests, theme)}>
            {test.testName}
            </MenuItem>
        ))}
        </Select>
        <FormHelperText>Required</FormHelperText>
      </FormControl>
      <FormControlLabel style={{display: 'block', margin: '1rem 0 auto'}}
        control={
          <Checkbox
            checked={allowDuplicate}
            onChange={handleChange('allowDuplicate')}
            value='allowDuplicate'
            color="primary"
          />
        }
        label="Allow Duplicate Tests"
        labelPlacement="end"
      />
      <FormControl className={classes.formControl} style={{display: 'block'}}>

          <Button
              color="primary"
              onClick={createTestSet}
              style={{margin: '2rem 0 auto'}}
          >
          Create
          </Button>
      </FormControl>
      </div>
      {validationError&&<p style={{color: 'red'}}>{`Error! ${validationError}`}</p>}        
    </Fragment>
  );
};
