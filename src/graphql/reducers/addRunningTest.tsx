import runningTestsQuery from '../query/runningTests';

export default (_root: any, {testId, testName}: {testId: String, testName: String, }, { cache, getCacheKey }: any, info: any) => {
    
    const runningTests = cache.readQuery({
        query: runningTestsQuery 
    })
    
    cache.writeData({data: { runningTests: {...runningTests, [testId as string]: testName} }});

    console.log('runningTestsQuery', cache.readQuery({
        query: runningTestsQuery 
    }))
    return null;
}