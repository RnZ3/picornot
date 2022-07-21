export interface PoolType  {
  pool: { 
    name:string
    id:string
    address:string
    poolType: string 
    volume24h: number
    fees24h: number
    apr: {
      total: number
      swapApr: number
      beetsApr: number 
    }
    farm: { 
      rewardTokens: [ 
        { 
          rewardPerDay: number 
        } 
      ] 
    } 
    tokens: [
      {
        name: string
        symbol: string
        balance: number
        priceRate: number
      }
    ]
  }
}

export interface FinalData {
  ts: number
  beetsPerDay: number
  fees24h: number
  beetsPrice: number
  lqdrPrice: number
  lqdrInPool: number
  clqdrInPool: number
  xlqdrApr: number
  beetsAprCalc: number
  beetsAprPool: number
  swapAprPool: number
  totalAprPool: number
  picClqdrPercent: number
  clqdrRatio: number
  compoundFreq: number
  breakdownBeets: number
  breakdownClqdr: number
  breakdownSwap: number
  breakdownTotal: number
  provideLP: boolean
  picApy: number
  clqdrApy: number
  beetsChange24h: number
  lqdrChange24h: number
}

export interface Dashboard {
  results: FinalData
}

