export const filterTests = (tests: any[], search: string) =>{
    return search === '' ? tests : tests.filter((test: any)=>{
        const description = test.testDescription || '';
        const lowerCaseSearch = search.toLowerCase()
        return  test.testName.toLowerCase().includes(lowerCaseSearch) || description.toLowerCase().includes(lowerCaseSearch) || test.testType.toLowerCase().includes(lowerCaseSearch);
    })
}