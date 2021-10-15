import {TFHttpSend} from "../../typings/getRequest";

export default {
    datasetList: { url: '/classic/data/dataset-list', method: 'GET', dataType: "json" },
    datasetDetail: {url: '/classic/data/dataset-detail', method: 'GET', dataType: 'json' },
    datasetItemList: { url: '/classic/data/item-list', method: 'GET', dataType: 'json' },
    dataDelItem: {url: '/classic/data/del-item', method: 'POST', dataType: 'json'},
    datasetFolderCreate: { url: '/classic/data/create', method: 'POST', dataType: 'json' },
    datasetItemUpload: { url: '/dataset/data/upload-file', method: 'POST', dataType: 'json' },
    datasetAddItem: { url: '/classic/data/add-items', method: 'POST', dataType: 'json' },
    fakeRequest: { url: '/classic/data/{name}', method: 'GET', dataType: 'json' },
    fakeRequestNoUrlParam: { url: '/classic/data/fake', method: 'GET', dataType: 'json' },
    diskInfo: { url: '/classic/data/get-mount', method: 'GET', dataType: 'json' }
}

export interface IClassicalAssetApi {
    datasetList: TFHttpSend,
    datasetDetail: TFHttpSend,
    datasetItemList: TFHttpSend,
    dataDelItem: TFHttpSend,
    datasetFolderCreate: TFHttpSend,
    datasetItemUpload: TFHttpSend,
    datasetAddItem: TFHttpSend,
    fakeRequest: TFHttpSend,
    fakeRequestNoUrlParam: TFHttpSend,
    diskInfo: TFHttpSend,
}

