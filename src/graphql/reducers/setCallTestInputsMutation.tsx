import testTypeInputsQuery from '../query/testTypeInputsQuery';

export default (_root: any, {inputType, inputValue, partyName}: {inputType: String, inputValue: String, partyName: String}, { cache, getCacheKey }: any, info: any) => {

    if(inputType === 'testName' || inputType === 'selectedTestType'){
        cache.writeData({data: { [inputType as string]: inputValue }});
    }
    else{
        cache.writeData({data: {[partyName as string]:{__typename: 'Party', [inputType as string]: inputValue }}});
    }
    

    console.log('selectedTestTypeQuery', cache.readQuery({
        query: testTypeInputsQuery 
    }))
    return null;
}