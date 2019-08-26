import { gql } from "apollo-boost";


export default (_root: any, {testId}: {testId: String}, { cache, getCacheKey }: any, info: any) => {
    
    const runningTestsQuery = gql`
        query {
            runningTests @client(always: true)
        }
    `

    const {runningTests} = cache.readQuery({
        query: runningTestsQuery 
    })
    // delete runningTests[testId as string]
    var index = runningTests.indexOf(testId);
    if (index > -1) {
        runningTests.splice(index, 1);
    }
    cache.writeData({data: { runningTests }});

    // console.log('runningTestsQuery', cache.readQuery({
    //     query: runningTestsQuery 
    // }))
    return null;
}