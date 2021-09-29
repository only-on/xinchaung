
export default {
    getExerciseList: { url: `/api/v1/question/pools`, method: "GET" },
    createExercise: { url: `/api/v1/question/pools`, method: "POST", dataType: 'json' },
    deleteExercise: { url: `/api/v1/question/pools/{pool_id}`, method: "DELETE", dataType: 'json' },
    detailExercise: { url: `/api/v1/question/pools/{pool_id}`, method: "GET" },
    typeExercise: { url: `/api/v1/question/types`, method: "GET", dataType: 'json' },
    getDetailExerciseList: { url: `/api/v1/question/pools/{pool_id}/questions`, method: "GET" },
    getDetailExerLevels: { url: `/api/v1/question/levels`, method: "GET" },
    detailExerCreate: { url: `/api/v1/question/pools/{pool_id}/questions`, method: "POST", dataType: 'json' },

}
