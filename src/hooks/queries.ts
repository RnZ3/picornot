import gql from "graphql-tag";

export const POOL_QUERY = gql`
  query  Pool(
    $id: String!
  ) { 
    pool(
      id: $id
    ) {
      name 
      id 
      address 
      poolType 
      volume24h
      fees24h
      apr {
        total
        swapApr
        beetsApr
      }
      farm {
        rewardTokens { 
          rewardPerDay 
        }
      }
      tokens {
        name
        symbol
        balance
        priceRate
      }
    }
  }
`;

export const POOL_QUERY_V2 = gql`
  query  Pool (
    $id: String!
  ) {
    blocksGetBlocksPerDay
    poolGetPool(
      id:$id
    ) {
      staking {
        farm {
          beetsPerBlock
        }
      }
    }
  }
`;

