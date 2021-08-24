export default {
    datasetList: { url: '/classic/data/dataset-list', method: 'GET', dataType: "json" },
    fakeRequest: { url: '/classic/data/{name}', method: 'GET', dataType: 'json' },
    fakeRequestNoUrlParam: { url: '/classic/data/fake', method: 'GET', dataType: 'json' },
}

