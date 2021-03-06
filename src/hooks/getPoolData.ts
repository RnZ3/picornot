import { useState, useEffect } from 'react';
import { FinalData, Dashboard } from "types/Pool"
import { ServiceType } from "types/Service";
import { request } from "graphql-request"
import { POOL_QUERY } from "hooks/queries"
import { useTimer } from "hooks/useTimer"

const endpoint = "https://backend.beets-ftm-node.com/graphql"
const id = "0xeadcfa1f34308b144e96fcd7a07145e027a8467d000000000000000000000331"
const coingecko = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=liquiddriver,beethoven-x'

export const usePoolData = (interval: number | null, xlqdrApr: number, compoundFreq: number) => {

  const [displayData, setDisplayData] = useState<ServiceType<Dashboard>>({ status: "loading" });
  const refresh = useTimer(interval)

  //console.log(interval, compoundFreq, xlqdrApr)

  useEffect(() => {

    let finalData: FinalData

    const fetchData = async () => {

      const poolData = await request(endpoint, POOL_QUERY, { id })
        .then((response) => {
          if (response.status >= 400 && response.status < 600) {
            throw new Error("Bad response from server")
          }
          return response;
        })
        .then((response) => {
          //console.log("return pool")
          return response;
        });

      const tokenData = await fetch(coingecko || "")
        .then((response) => {
          if (response.status >= 400 && response.status < 600) {
            throw new Error("Bad response from server")
          }
          return response.json();
        })
        .then((response) => {
          //console.log("return tokens")
          return response;
        });

      const pdata = await (JSON.parse(JSON.stringify(poolData)))
      //console.log(tokenData)
      //console.log(pdata)

      let beetsPrice: number = 0
      let lqdrPrice: number = 0
      let beetsChange24h: number = 0
      let lqdrChange24h: number = 0
      let lqdrInPool: number = 0
      let clqdrInPool: number = 0
      let clqdrRatio: number = 0

      tokenData.forEach((tk: any) => {
        if (tk.id === "liquiddriver") {
          lqdrPrice = parseFloat(tk.current_price)
          lqdrChange24h = parseFloat(tk.price_change_percentage_24h)
        }
        if (tk.id === "beethoven-x") {
          beetsPrice = parseFloat(tk.current_price)
          beetsChange24h = parseFloat(tk.price_change_percentage_24h)
        }
      })

      pdata.pool.tokens.forEach((tk: any) => {
        if (tk.symbol === "LQDR") {
          lqdrInPool = parseFloat(tk.balance)
        }
        if (tk.symbol === "cLQDR") {
          clqdrInPool = parseFloat(tk.balance)
          clqdrRatio = parseFloat(tk.priceRate)
        }
      })

      // const xlqdrApr = 63.53  // use form value

      let beetsPerDay = 0
      if (pdata.pool.farm.rewardTokens.length !== 0) {
        beetsPerDay = parseFloat(pdata.pool.farm.rewardTokens[0].rewardPerDay)
      }

      //                 = (C7          * C8         * 365) / ((C10        * C9       ) + (C11         * C17        * C9       )) * 100
      const beetsAprCalc = (beetsPerDay * beetsPrice * 365) / ((lqdrInPool * lqdrPrice) + (clqdrInPool * clqdrRatio * lqdrPrice)) * 100

      const picClqdrPercent = (clqdrInPool / (lqdrInPool + clqdrInPool) * 100)

      //                    = (C17        * C16             * (C13      *           0.875 )  /100)
      const breakdownClqdr  = (clqdrRatio * picClqdrPercent * (xlqdrApr *           0.875 ) / 100)

      //                     ((1+(1+((C14         /100)/C18         )) ^(C18*1         )-1)^ (1/365)-1)*365
      const breakdownBeets = ((1+(1+((beetsAprCalc/100)/compoundFreq))**(compoundFreq*1)-1)**(1/365)-1)*365*100

      const swapAprPool = parseFloat(pdata.pool.apr.swapApr)

      const breakdownSwap = swapAprPool * 100

      const breakdownTotal = breakdownClqdr + breakdownBeets + breakdownSwap

      //                 (  ((1 + ((C13      *           0.875 ) / 100) / 365          ) ^  365   ) - 1)
      const clqdrApy   = (  ((1 + ((xlqdrApr *           0.875 ) / 100) / 365          ) ** 365   ) - 1) * 100

      //              (  (1 + ( B29+B30+B31          ) /          365 ) ^           365) - 1
      const picApy =  (( (1 + ( breakdownTotal / 100 ) / compoundFreq ) ** compoundFreq) - 1 ) * 100

      const provideLP = (picApy > clqdrApy) ? true : false

      const ts = Date.now()

      finalData = {
        ts: ts,
        beetsPerDay: beetsPerDay,
        fees24h: parseFloat(pdata.pool.fees24h),
        beetsPrice: beetsPrice,
        lqdrPrice: lqdrPrice,
        lqdrInPool: lqdrInPool,
        clqdrInPool: clqdrInPool,
        xlqdrApr: xlqdrApr,
        beetsAprCalc: beetsAprCalc,
        beetsAprPool: parseFloat(pdata.pool.apr.beetsApr) * 100,
        swapAprPool: swapAprPool * 100,
        totalAprPool: parseFloat(pdata.pool.apr.total) * 100,
        picClqdrPercent: picClqdrPercent,
        clqdrRatio: clqdrRatio,
        compoundFreq: compoundFreq,
        clqdrApy: clqdrApy,
        picApy: picApy,
        breakdownClqdr: breakdownClqdr,
        breakdownBeets: breakdownBeets,
        breakdownSwap: breakdownSwap,
        breakdownTotal: breakdownTotal,
        provideLP: provideLP,
        lqdrChange24h: lqdrChange24h,
        beetsChange24h: beetsChange24h
      }

      setDisplayData({
        status: "loaded",
        payload: {
          results: finalData
        }
      })
    }

    fetchData()

  }, [ interval, refresh, compoundFreq, xlqdrApr]);

  return displayData
}

