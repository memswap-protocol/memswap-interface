import { faImage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Flex from './Flex'
import Image from 'next/image'
import {
  CSSProperties,
  ComponentPropsWithoutRef,
  useEffect,
  useState,
} from 'react'

const defaultLoader = ({ src }: { src: string }) => src

type ImgProps = ComponentPropsWithoutRef<typeof Image> & {
  css?: CSSProperties
}

const Img = ({ css, ...props }: ImgProps) => {
  const [imageBroken, setImageBroken] = useState(false)

  useEffect(() => {
    if (imageBroken) {
      setImageBroken(false)
    }
  }, [props.src])

  return imageBroken || !props.src ? (
    <Flex css={{ ...css, background: 'gray3' }} justify="center" align="center">
      <FontAwesomeIcon icon={faImage} size="2xl" />
    </Flex>
  ) : (
    <Image
      {...props}
      style={css}
      alt={props.alt}
      loader={props.loader || defaultLoader}
      onError={() => {
        setImageBroken(true)
      }}
    />
  )
}

export default Img
