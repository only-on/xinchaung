
export default {
    getExerciseList: { url: `/api/v1/question/pools`, method: "GET" },
    createExercise: { url: `/api/v1/question/pools`, method: "POST" },
    deleteExercise: { url: `api/v1/question/pools/{pool_id}`, method: "DELETE", dataType: 'json' }
}
