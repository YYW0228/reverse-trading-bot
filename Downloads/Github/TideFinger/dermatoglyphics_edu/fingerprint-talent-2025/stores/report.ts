import { defineStore } from 'pinia'

function xorshift(seed: number) {
  let x = Math.floor(seed * 1e9) || 123456789
  return () => {
    x ^= x << 13
    x ^= x >> 17
    x ^= x << 5
    return (x >>> 0) / 0xffffffff
  }
}

import { OCEAN_MATRIX, calculateRarity } from '~/config/personality-matrix'

export const useReportStore = defineStore('report', {
  state: () => ({
    isUnlocked: false as boolean,
    isAnalyzing: false as boolean,
    scanData: null as string | null,
    userSeed: 0 as number,
    traits: { o: 0.5, c: 0.5, e: 0.5, a: 0.5, n: 0.5 } as { o: number; c: number; e: number; a: number; n: number },
    analysis: {
      archetype: '等待觉醒',
      rarity: 'N',
      mainDesc: '',
      keywords: [] as string[],
      cards: [] as any[],
      dominantColor: '#FFD700'
    }
  }),
  actions: {
    generateReport(payload?: { scanData?: string }) {
      this.isAnalyzing = true
      // 确定性随机种子（可改为用户ID + 日期确保稳定）
      if (this.userSeed === 0) {
        const ua = navigator.userAgent
        const t = Date.now() % 100000
        const baseSeed = Math.abs(Array.from(ua).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) + t) % 100000
        this.userSeed = baseSeed
      }
      const rng = ((): (() => number) => {
        let a = this.userSeed
        return () => {
          let t = a += 0x6D2B79F5
          t = Math.imul(t ^ (t >>> 15), t | 1)
          t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296
        }
      })()

      // 生成 OCEAN 五维（中心化分布，避免极端）
      this.traits = {
        o: 0.2 + rng() * 0.7,
        c: 0.2 + rng() * 0.7,
        e: 0.15 + rng() * 0.8,
        a: 0.3 + rng() * 0.6,
        n: 0.1 + rng() * 0.5
      }

      // 主副人格
      const sorted = Object.entries(this.traits).sort((a, b) => b[1] - a[1])
      const [domKey, domScore] = sorted[0]
      const [subKey, subScore] = sorted[1]

      // 从矩阵取文案
      // @ts-ignore
      const domData = OCEAN_MATRIX[domKey][domScore > 0.6 ? 'high' : 'low']
      // @ts-ignore
      const subData = OCEAN_MATRIX[subKey][subScore > 0.6 ? 'high' : 'low']

      this.analysis.archetype = domData.title
      this.analysis.rarity = calculateRarity(this.traits)
      this.analysis.mainDesc = domData.desc
      this.analysis.keywords = [...domData.keywords, ...subData.keywords].slice(0, 4)

      const colorMap: Record<string, string> = { o: '#3b82f6', c: '#10b981', e: '#f59e0b', a: '#ec4899', n: '#8b5cf6' }
      // @ts-ignore
      this.analysis.dominantColor = colorMap[domKey] || '#f59e0b'

      this.analysis.cards = [
        { title: '核心天赋', score: Math.floor(domScore * 100), desc: domData.desc, highlight: domData.gift, isLocked: false },
        { title: '潜在优势', score: Math.floor(subScore * 100), desc: subData.desc, highlight: subData.gift, isLocked: false },
        { title: '未来职业锚点', score: 98, desc: `基于 ${domData.title} 特质，AI 预测该儿童在【${domData.careers[0]}】、【${domData.careers[1]}】等领域具有极高成才率...`, highlight: '解锁查看完整职业路径', isLocked: true, hooks: ['年薪百万潜力', '行业领袖', '避免入错行'] },
        { title: '黄金教养法则', score: 95, desc: '针对该性格类型的专属沟通话术，避开 90% 父母常犯的扼杀天赋的错误...', highlight: '解锁获取定制教养方案', isLocked: true, hooks: ['哈佛教育法', '亲子关系修复', '叛逆期规避'] }
      ]

      if (payload?.scanData) this.scanData = payload.scanData
      this.isAnalyzing = false
    },
    unlock() { this.isUnlocked = true; (this.analysis.cards || []).forEach((c:any) => c.isLocked = false) }
  }
})
