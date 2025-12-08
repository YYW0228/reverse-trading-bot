import { defineStore } from 'pinia'

export interface OceanScores { openness: number; conscientiousness: number; extraversion: number; agreeableness: number; neuroticism: number }
export interface AnalysisState {
  childName: string
  childAge: number
  gender: 'male' | 'female'
  photo?: string
  ocean: OceanScores
  archetype: string
}

export const useAnalysisStore = defineStore('analysis', {
  state: (): AnalysisState => ({
    childName: '悠悠',
    childAge: 6,
    gender: 'female',
    ocean: { openness: 82, conscientiousness: 74, extraversion: 68, agreeableness: 91, neuroticism: 38 },
    archetype: 'wolf'
  }),
  actions: {
    setPhoto(dataUrl: string) { this.photo = dataUrl },
    setOcean(payload: Partial<OceanScores>) { this.ocean = { ...this.ocean, ...payload } },
    setBase(info: Partial<Pick<AnalysisState, 'childName' | 'childAge' | 'gender'>>) { Object.assign(this, info) }
  }
})
