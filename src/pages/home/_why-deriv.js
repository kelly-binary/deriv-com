import React from 'react'
import styled from 'styled-components'
import device from 'themes/device'
import Carousel from 'components/elements/carousel'
import Button from 'components/form/button'
import { Header } from 'components/elements/typography.js'
import { localize } from 'components/localization'
import { deriv_app_url } from 'common/utility'
// Icons
import CarouselBackground from 'images/svg/abstract.svg'
import ChecklistLogo from 'images/svg/checklist.svg'

const handleExternalLink = e => {
    e.preventDefault()

    window.open(deriv_app_url, '_blank')
}

const carousel_1_text = [
    'Exclusive synthetic market available 24/7',
    'USD 5 minimum deposit',
    'Stakes as low as USD 0.35',
    'Payouts up to USD 50,000',
]

const carousel_2_text = [
    'Patented, licensed, and regulated',
    'Short- to long-term trades',
    'Reliable customer support',
    'Privacy guaranteed',
]

const HomeCarouselWrapper = styled.section`
    background-color: var(--color-grey-1);
    display: flex;
`
const HomeCarouselContainer = styled.div`
    width: 90%;
    margin-left: 14.3vw;
    margin-right: 0;
    display: flex;
    max-width: 123.2rem;
    padding: 5.8rem 0 5.4rem 0;
    padding-top: 5.8rem;
    padding-bottom: 5.4rem;
    justify-content: space-between;
    align-items: flex-start;

    @media ${device.laptop} {
        margin-left: 10vw;
    }
    @media ${device.desktopS} {
        margin-left: 22.5vw;
    }
`
const StyledSubHeader = styled(Header)`
    margin-top: 0.8rem;
`
const ContextContainer = styled.div`
    margin-top: 3.8rem;
    color: var(--color-black-2);
    width: 32.8rem;
    margin-right: 10.7rem;
`
const DemoButton = styled(Button)`
    width: 13.5rem;
    margin-top: 4rem;
`
const Slide = styled.section`
    @keyframes slide {
        0% {
            margin-left: 12.6rem;
            opacity: 0;
        }
        70% {
            opacity: 0.2;
        }
        100% {
            margin-left: 0;
            opacity: 1;
        }
    }

    div {
        display: inline-flex;
        margin-top: 4rem;
        width: 100%;
        position: relative;
        animation-name: slide;
        animation-duration: 0.4s;
        animation-timing-function: linear;

        p {
            margin-left: 1.6rem;
            height: 30px;
            font-size: 20px;
            color: var(--color-black-2);
            line-height: 1.5;
        }
    }
    div:first-child {
        margin-top: 0;
    }
`
const CarouselItems = carousel_text => (
    <Slide>
        {carousel_text.map((content, index) => (
            <div key={index}>
                <ChecklistLogo />
                <p>{localize(content)}</p>
            </div>
        ))}
    </Slide>
)
export const WhyDeriv = () => (
    <HomeCarouselWrapper>
        <HomeCarouselContainer>
            <ContextContainer>
                <Header as="h2">{localize('Why choose Deriv?')}</Header>
                <StyledSubHeader as="h4" weight="500">
                    {localize('Your one-stop shop for online trading.')}
                </StyledSubHeader>
                <DemoButton onClick={handleExternalLink} secondary>
                    {localize('See a demo')}
                </DemoButton>
            </ContextContainer>
            <Carousel
                slides={[
                    () => CarouselItems(carousel_1_text),
                    () => CarouselItems(carousel_2_text),
                ]}
                background={CarouselBackground}
            />
        </HomeCarouselContainer>
    </HomeCarouselWrapper>
)
