import { useState, MouseEventHandler, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { PrimaryButtonLarge } from '../components/Button'
import { Description, PageTitle } from '../components/Text'
import { useContributionStore, Store } from '../store/contribute'
import {
  SingleContainer as Container,
  SingleWrap as Wrap
} from '../components/Layout'
import Logo from '../components/Logo'
import ProgressBar from '../components/ProgressBar'
import { textSerif } from '../style/utils'
import ROUTES from '../routes'
import { FONT_SIZE } from '../constants'

const MIN_ENTROPY_LENGTH = 20000

const EntropyInputPage = () => {
  const navigate = useNavigate()
  const [entropy, setEntropy] = useState('')
  const [mouseEntropy, setMouseEntropy] = useState('')
  const [percentage, setPercentage] = useState(0)

  const updateEntropy = useContributionStore((state: Store) => state.updateEntropy)
  const handleSubmit = () => {
    if (percentage !== 100) return
    updateEntropy(0, entropy)    
    // convert entropy to secrets
    // sign
    navigate(ROUTES.LOBBY)
  }

  const handleCaptureMouseEntropy: MouseEventHandler<HTMLDivElement> = (e) => {
    const d = new Date()
    setMouseEntropy(
      `${mouseEntropy}${e.movementX}${e.movementY}${e.screenX}${
        e.screenY
      }${d.getTime()}`
    )
  }

  useEffect(() => {
    setPercentage(
      Math.min(
        Math.floor(
          ((entropy + mouseEntropy).length / MIN_ENTROPY_LENGTH) * 100
        ),
        100
      )
    )
  }, [entropy, mouseEntropy])

  return (
    <Container onMouseMove={handleCaptureMouseEntropy}>
      <Wrap>
        <Logo inverse />
        <Title>Entropy & sorcery.</Title>
        <Desc>
        To conjure the magic, sacrifice is necessary. You are required to offer a secret. Consider something important, like a hint of a memory or the name of someone dear. Bring this offering to the altar and then join the others in the hallway.
        </Desc>
        <Input onChange={(e) => setEntropy(e.target.value)} />
        <Footnote>
        You can also move your cursor around on this screen.
        </Footnote>
        <ProgressSection>
          <ProgressBar percentage={percentage} />
        </ProgressSection>

        <ButtonSection>
          <PrimaryButtonLarge
            inverse
            onClick={handleSubmit}
            disabled={percentage !== 100}
          >
            Enter hallway
          </PrimaryButtonLarge>
        </ButtonSection>
      </Wrap>
    </Container>
  )
}

const Title = styled(PageTitle)`
  color: ${({ theme }) => theme.onPrimary};
  margin-top: 0;
`

const Desc = styled(Description)`
  color: ${({ theme }) => theme.onPrimary};
`

const Footnote = styled(Description)`
  color: ${({ theme }) => theme.onPrimary};
  font-size: ${FONT_SIZE.S};
`

const Input = styled.input`
  ${textSerif};
  font-size: 32px;
  padding: 8px 16px;
  border: solid 1px ${({ theme }) => theme.onPrimary};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.onPrimary};
  width: 100%;
`

const ProgressSection = styled.div`
  margin: 20px 0;
`

const ButtonSection = styled.div`
  padding-bottom: 24px;
`

export default EntropyInputPage
