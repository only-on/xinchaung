export interface ICourseScore {
  name: string;
  max_score: number;
  average_score: number;
}
interface itemJob{
  name: string,
  min: number,
  max: number
}
export interface IjobData{
  name: itemJob[],
  value: number[]
}
export interface IfourChart{
  error_knowledge: any[],
  content_score: {
    name: string[],
    score: any[],
  },
  knowledge_map: any,
  combData: {
    data: any[],
    links: any[],
  }
}