import request from 'src/request/fetch'

function getTree(courseId: number) {
  return request({
    url: `api/course/courses/${courseId}/chapters/tree`,
    method: 'GET',
    dataType: 'json',
    body: {}
  })
}
export {getTree}
