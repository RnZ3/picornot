import { extendTheme } from '@chakra-ui/react'
import { mode, StyleFunctionProps } from '@chakra-ui/theme-tools'

const theme = {
  styles: {
    global: (props:any) => ({
      table: {
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.700',
      },
      a: {
        color: props.colorMode === 'dark' ? 'teal.300' : 'teal.500',
        _hover: {
          textDecoration: 'underline',
        },
      },
    })
  },
  components: (props:any) => ({
    Link: {
    },
  }),
}

const myTheme = extendTheme(theme)

export {myTheme}
