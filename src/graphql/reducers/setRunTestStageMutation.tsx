
export default (_root: any, {testResultId, runTestStage}: {testResultId: String, runTestStage: String}, { cache, getCacheKey }: any, info: any) => {

    cache.writeData({data: { testResultId,  runTestStage}});

    return null;
}