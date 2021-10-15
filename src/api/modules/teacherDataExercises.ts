
export default {
    getExerciseList: { url: `/api/v1/question/pools`, method: "GET" },
    createExercise: { url: `/api/v1/question/pools`, method: "POST", dataType: 'json' },
    deleteExercise: { url: `/api/v1/question/pools/{pool_id}`, method: "DELETE", dataType: 'json' },
    detailExercise: { url: `/api/v1/question/pools/{pool_id}`, method: "GET" },
    updateExercise: { url: `/api/v1/question/pools/{pool_id}`, method: "PUT" },
    typeExercise: { url: `/api/v1/question/types`, method: "GET", dataType: 'json' },
    getDetailExerciseList: { url: `/api/v1/question/pools/{pool_id}/questions`, method: "GET" },
    getDetailExerLevels: { url: `/api/v1/question/levels`, method: "GET" },
    detailExerCreate: { url: `/api/v1/question/pools/{pool_id}/questions`, method: "POST", dataType: 'json' },
    detailExerDelete: { url: `/api/v1/question/questions/{question_id}`, method: "DELETE", dataType: 'json' },
    detailExerUpdate: { url: `/api/v1/question/questions/{question_id}`, method: "PUT", dataType: 'json' },
    detailExerBatchImport: { url: `/api/v1/question/pools/{pool_id}/questions/import`, method: "POST", dataType: 'formdata' },
    detailExerDownLoad: { url: `/api/v1/question/questions/import/demo`, method: "GET", dataType: 'json' }
}
