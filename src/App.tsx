import * as React from "react";
import {
  Square,
  Spacer,
  Center,
  Flex,
  Divider,
  Heading,
  ChakraProvider,
  Box,
  chakra,
  theme,
  Stat,
  StatLabel,
  StatNumber,
  StatArrow,
  Button,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  TableContainer,
  Tooltip,
  Input,
  Text,
  Link,
} from "@chakra-ui/react";
import { ColorModeSwitcher } from "ColorModeSwitcher";
import { Spinner, Progress } from "@chakra-ui/react";
import { usePoolData } from "hooks/getPoolData";

const XLQDR_APR = 52.25;
const COMP_FREQ = 365;

export const App = () => {
  const linkPIC = "https://beets.fi/#/pool/0xeadcfa1f34308b144e96fcd7a07145e027a8467d000000000000000000000331";
  const linkXLQDR = "https://www.liquiddriver.finance/xlqdr";
  const linkCLQDR = "https://mor-ftm.growthdefi.com/clqdr";
  const linkSHEET = "https://docs.google.com/spreadsheets/d/1C9Xron4HBsTvUJc_YUB1oo5L1S-WQuegZtB7ajGQoKk/edit?pli=1#gid=1600753533";

  const [interval, setInterval] = React.useState<number | null>(null);
  const [compoundFrequency, setCompundFrequency] = React.useState(COMP_FREQ);
  const [xLqdrApr, setxLqdrApr] = React.useState(XLQDR_APR);
  const [value, setValue] = React.useState(XLQDR_APR);

  const pData = usePoolData(interval, xLqdrApr, compoundFrequency);

  const handleClick = () => {
    setInterval(interval === null ? 30000 : null);
  };

  const handleFreq = (e: any) => {
    setCompundFrequency(e.target.value);
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setxLqdrApr(value);
  };

  //console.log(interval, compoundFrequency, xLqdrApr);

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="end">
        <Button size="xs" onClick={handleClick}>
          auto refresh:{" "}
          {interval === null ? (
            <chakra.span color="red.400">&nbsp;OFF </chakra.span>
          ) : (
            <chakra.span color="green.400">&nbsp;ON </chakra.span>
          )}
        </Button>
        <ColorModeSwitcher />
      </Box>
      <Box textAlign="center">
        <Heading size='3xl' sx={{ filter: "blur(2px)" }}>PiC or Not?</Heading>
      </Box>
      <Box padding="1px">
        {" "}
        {interval === null ? (
          <Divider />
        ) : (
          <Progress hasStripe size="xs" height="1px" isIndeterminate />
        )}{" "}
      </Box>
      {pData!.status === "loading" && (
        <Box textAlign="center">
          <Spinner />
        </Box>
      )}
      {pData!.status === "loaded" && (
        <Center>
          <Box width="80%">
            <Flex padding="10px" alignItems="center">
              <Spacer />
              <Box padding="5px">
                <Stat >
                  <StatLabel sx={{textAlign: "center", fontSize: "1.3rem"}}>APY cLQDR</StatLabel>
                  <StatNumber sx={{ fontSize: "2rem"}}>
                    <chakra.span
                      color={
                        pData.payload.results.provideLP
                          ? "red.400"
                          : "green.400"
                      }
                    >
                      {pData.payload.results.clqdrApy.toFixed(2)}%
                    </chakra.span>
                  </StatNumber>
                </Stat>
              </Box>
              <Box padding="5px" width="33%" >
                <Center
                  sx={{ fontSize: "1.3rem", fontWeight: "800", textAlign: "center"}}
                >
                  {!pData ? (
                    <Spinner />
                  ) : pData.payload.results.provideLP ? (
                    "Provide LP"
                  ) : (
                    "Hodl cLQDR"
                  )}
                </Center>
              </Box>
              <Box padding="5px">
                <Stat sx={{textAlign: "center"}}>
                  <StatLabel sx={{textAlign: "center", fontSize: "1.3rem"}}>APY PiC</StatLabel>
                  <StatNumber sx={{ fontSize: "2rem"}}>
                    <chakra.span
                      color={
                        pData.payload.results.provideLP
                          ? "green.400"
                          : "red.400"
                      }
                    >
                      {pData.payload.results.picApy.toFixed(2)}%
                    </chakra.span>
                  </StatNumber>
                </Stat>
              </Box>
              <Spacer />
            </Flex>

            <Divider />
            <Flex padding="10px" flexWrap="wrap">
              <TableContainer
                padding="10px"
                flex="1"
                flexGrow="1"
                flexShrink="1"
                minWidth="max-content"
              >
                <Table
                  size="sm"
                  bg="#f9f9f9"
                  borderColor="red"
                  _dark={{ bg: "#444" }}
                  sx={{ fontFamily: "monospace" }}
                >
                  <Tbody>
                    <Tr>
                      <Td>xLQDR APR %</Td>
                      <Td isNumeric>
                        <form onSubmit={submitForm}>
                          <Input
                            size="sm"
                            htmlSize={5}
                            width="auto"
                            onChange={(e: any) =>
                              setValue(e.currentTarget.value)
                            }
                            value={value}
                            type="number"
                            max="200"
                            min="0"
                            step="0.01"
                          />{" "}
                          <button type="submit">Submit</button>
                        </form>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <TableContainer
                padding="10px"
                flex="1"
                flexGrow="1"
                flexShrink="1"
                minWidth="max-content"
              >
                <Table
                  size="sm"
                  bg="#f9f9f9"
                  borderColor="red"
                  _dark={{ bg: "#444" }}
                  sx={{ fontFamily: "monospace" }}
                >
                  <Tbody>
                    <Tr>
                      <Td>Compound frequency</Td>
                      <Td isNumeric>
                        <Select
                          value={compoundFrequency}
                          size="sm"
                          width="max-content"
                          onChange={(e) => handleFreq(e)}
                        >
                          <option value="12">12</option>
                          <option value="52">52</option>
                          <option value="365">365</option>
                        </Select>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Flex>
            <Flex padding="10px" flexWrap="wrap">
              <TableContainer
                padding="10px"
                flex="1"
                flexGrow="1"
                flexShrink="1"
                minWidth="max-content"
              >
                <Table
                  size="sm"
                  bg="#f9f9f9"
                  borderColor="red"
                  _dark={{ bg: "#444" }}
                  sx={{ fontFamily: "monospace" }}
                >
                  <Thead>
                    <Tr>
                      <Td colSpan={3}>
                        <Heading size="xs">Parameter</Heading>
                      </Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>BEETS/day</Td>
                      <Td isNumeric>
                        {pData.payload.results.beetsPerDay.toFixed(0)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>BEETS price $</Td>
                      <Td isNumeric>
                        {pData.payload.results.beetsPrice.toFixed(3)}
                      </Td>
                      <Td isNumeric>
                        <Tooltip hasArrow label="24h change">
                          <Stat>
                            {pData.payload.results.beetsChange24h.toFixed(3)} %{" "}
                            <StatArrow
                              type={
                                pData.payload.results.beetsChange24h > 0
                                  ? "increase"
                                  : "decrease"
                              }
                            />
                          </Stat>
                        </Tooltip>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>LQDR price $</Td>
                      <Td isNumeric>
                        {pData && pData.payload.results.lqdrPrice.toFixed(3)}
                      </Td>
                      <Td isNumeric>
                        <Tooltip hasArrow label="24h change">
                          <Stat>
                            {pData.payload.results.lqdrChange24h.toFixed(3)} %{" "}
                            <StatArrow
                              type={
                                pData.payload.results.lqdrChange24h > 0
                                  ? "increase"
                                  : "decrease"
                              }
                            />
                          </Stat>
                        </Tooltip>
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>cLQDR Ratio</Td>
                      <Td isNumeric>
                        {pData.payload.results.clqdrRatio.toFixed(4)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>cLQDR in pool %</Td>
                      <Td isNumeric>
                        {pData.payload.results.picClqdrPercent.toFixed(2)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>LQDR in Pool</Td>
                      <Td isNumeric>
                        {pData.payload.results.lqdrInPool.toFixed(0)}
                      </Td>
                      <Td isNumeric>
                        ${" "}
                        {(
                          pData.payload.results.lqdrInPool *
                          pData.payload.results.lqdrPrice
                        ).toFixed(0)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>cLQDR in Pool</Td>
                      <Td isNumeric>
                        {pData.payload.results.clqdrInPool.toFixed(0)}
                      </Td>
                      <Td isNumeric>
                        ${" "}
                        {(
                          pData.payload.results.clqdrInPool *
                          pData.payload.results.lqdrPrice *
                          pData.payload.results.clqdrRatio
                        ).toFixed(0)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>Fees/day $</Td>
                      <Td isNumeric>
                        {pData.payload.results.fees24h.toFixed(4)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>APR beets calc %</Td>
                      <Td isNumeric>
                        {pData.payload.results.beetsAprCalc.toFixed(4)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>APR pool beets %</Td>
                      <Td isNumeric>
                        {pData.payload.results.beetsAprPool.toFixed(4)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>APR pool swap %</Td>
                      <Td isNumeric>
                        {pData.payload.results.swapAprPool.toFixed(4)}
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>APR pool total %</Td>
                      <Td isNumeric>
                        {pData.payload.results.totalAprPool.toFixed(4)}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              <Box padding="10px" flex="1" flexGrow="1" flexShrink="1">
                <TableContainer>
                  <Table
                    size="sm"
                    bg="#f9f9f9"
                    borderColor="red"
                    _dark={{ bg: "#444" }}
                    sx={{ fontFamily: "monospace" }}
                  >
                    <Thead>
                      <Tr>
                        <Td colSpan={3}>
                          <Heading size="xs">
                            Breakdown PiC (APR on year basis)
                          </Heading>
                        </Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>cLQDR %</Td>
                        <Td isNumeric>
                          {pData.payload.results.breakdownClqdr.toFixed(2)}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>BEETS %</Td>
                        <Td isNumeric>
                          {pData.payload.results.breakdownBeets.toFixed(2)}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Swap fees %</Td>
                        <Td isNumeric>
                          {pData.payload.results.breakdownSwap.toFixed(2)}
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Total %</Td>
                        <Td isNumeric>
                          {pData.payload.results.breakdownTotal.toFixed(2)}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <Box padding="10px" fontSize="sm">
                  <Text>
                    This is to help you decide weather to provide liquidity in{" "}
                    <Link
                      _dark={{ color: "teal.200" }}
                      color="teal.500"
                      href={linkPIC}
                      isExternal
                    >
                      beethoven-x 'Pirate in C' pool
                    </Link>{" "}
                    or just keep holding{" "}
                    <Link
                      _dark={{ color: "teal.200" }}
                      color="teal.500"
                      href={linkCLQDR}
                      isExternal
                    >
                      cLQDR
                    </Link>{" "}
                    for better return.
                  </Text>
                  <Text>
                    Works best when submitting currrent xLQDR APR value which
                    you can find on Liquiddriver's{" "}
                    <Link
                      _dark={{ color: "teal.200" }}
                      color="teal.500"
                      href={linkXLQDR}
                      isExternal
                    >
                      {" "}
                      xLQDR page
                    </Link>
                    . Set compund frequency to how often you compound yearly.
                  </Text>
                  <Text>
                    Derived from the{" "}
                    <Link
                      _dark={{ color: "teal.200" }}
                      color="teal.500"
                      href={linkSHEET}
                      isExternal
                    >
                      google sheet
                    </Link>{" "}
                    made by ALMIGHTY ABE and JacksWiths.
                  </Text>
                </Box>
                <Divider />
                <Center>
                  <small>
                    <chakra.span color="red">NFA!</chakra.span> Numbers might be
                    wrong! <chakra.span color="red">DYOR!</chakra.span>
                  </small>
                </Center>
              </Box>
            </Flex>
          </Box>
        </Center>
      )}
    </ChakraProvider>
  );
};
