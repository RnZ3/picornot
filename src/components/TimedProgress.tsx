import { useState, useEffect } from "react"
import { Progress, Divider } from "@chakra-ui/react"

export function TimedProgress(props:any) {
  const [showComponent, setShowComponent] = useState(false)
  useEffect(() => {
    const toRef = setTimeout(() => {
      setShowComponent(true)
      clearTimeout(toRef)
    }, 1000)
  }, [props.oldts])
  useEffect(() => {
    if (showComponent) {
      const toRef = setTimeout(() => {
        setShowComponent(false)
        clearTimeout(toRef)
      }, 1000)
    }
  }, [showComponent])
  const ProgComponent = () => {
    return ( <Progress size="xs" height="1px" isIndeterminate /> )
  };
  return ( <>{showComponent ? ProgComponent() : <Divider />}</> )
}

