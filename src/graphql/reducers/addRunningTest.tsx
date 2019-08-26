import { gql } from "apollo-boost";
export default (_root: any, {testId, testName}: {testId: String, testName: String, }, { cache, getCacheKey }: any, info: any) => {
    
    const runningTestsQuery = gql`
        query {
            runningTests @client(always: true)
        }
    `
    const {runningTests} = cache.readQuery({
        query: runningTestsQuery 
    })

    cache.writeData({data: { runningTests: [...runningTests, testId] }});

    // console.log('runningTestsQuery', cache.readQuery({
    //     query: runningTestsQuery 
    // }))
    return null;
}