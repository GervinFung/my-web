import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { GlobalContainer } from '../util/theme/GlobalTheme';
import Title from '../components/Title';
import { Link, useHistory } from 'react-router-dom';

const DELAY = 0.5;
const TIME_TO_CHARGE = 10 + DELAY;

const Error = () => {
    const history = useHistory();

    const [countDown, setCountDown] = React.useState(TIME_TO_CHARGE - DELAY);

    React.useEffect(() => {
        if (countDown === 0) {
            history.push('/');
        }
        setTimeout(
            () => setCountDown((prevCountDown) => prevCountDown - 1),
            1000
        );
    }, [countDown]);

    return (
        <Container>
            <Title
                title="Page Not Found"
                content="You took the wrong turn and came here"
            />
            <ErrorContentContainer>
                <ErrorLeft>
                    <ErrorMessageTitle>Oops! You seems lost.</ErrorMessageTitle>
                    <ErrorMessageDescription>
                        Yeah, I am as confused as you are.
                    </ErrorMessageDescription>
                    <ErrorMessageDescription>
                        From what I&apos;ve seen, it appears that the page you
                        are looking for is now beyond my reach.
                    </ErrorMessageDescription>
                    <ErrorMessageDescription>
                        Luckily, unlike some other mistakes, this can be fixed.
                    </ErrorMessageDescription>
                    <ErrorMessageDescription>
                        So let&apos;s get you..
                    </ErrorMessageDescription>

                    <BackToHomeTimer>
                        Back to Home in: 00:00:
                        {countDown < 10 ? `0${countDown}` : countDown}
                    </BackToHomeTimer>
                    <BackToHomeAlternative>OR</BackToHomeAlternative>
                    <BackToHomeButton>
                        Go <Link to="/">Home</Link> Immediately
                    </BackToHomeButton>
                </ErrorLeft>
                <ErrorRight>
                    <ErrorMessageFourZeroFour>404</ErrorMessageFourZeroFour>
                </ErrorRight>
            </ErrorContentContainer>
        </Container>
    );
};

const Container = styled(GlobalContainer)`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ErrorContentContainer = styled.div`
    width: 85%;
    display: flex;
    justify-content: space-between;
    @media (max-width: 877px) {
        text-align: center;
        flex-direction: column-reverse;
        > div {
            margin: 10px 0 10px 0;
        }
    }
`;

const ErrorLeft = styled.div`
    flex: 0.5;
`;

const ErrorRight = styled.div`
    flex: 0.5;
    text-align: center;
`;

const ErrorMessageFourZeroFour = styled.h1`
    color: ${({ theme }) => theme.theme.highEmphasesTextColor};
    font-size: 135px;
    @media (max-width: 877px) {
        font-size: 100px;
        margin: 0 !important;
    }
`;

const ErrorMessageTitle = styled.h2`
    color: ${({ theme }) => theme.theme.highEmphasesTextColor};
    font-size: 40px;
    @media (max-width: 877px) {
        font-size: 30px;
    }
`;

const ErrorMessageDescription = styled.p`
    color: ${({ theme }) => theme.theme.mediumEmphasesTextColor};
`;

const BackToHomeTimer = styled.div`
    padding: 15px 0 0 0;
    color: ${({ theme }) => theme.theme.highEmphasesTextColor};
`;

const BackToHomeAlternative = styled.p`
    color: ${({ theme }) => theme.theme.highEmphasesTextColor};
    padding: 0 0 0 110px;
    @media (max-width: 877px) {
        padding: 0 0 0 0;
    }
`;

const ChargeHomeButton = keyframes`
    0% {
        background-position: 100% 0%;
    }
    100% {
        background-position: 0% -100%;
    }
`;

const BackToHomeButton = styled.div`
    color: ${({ theme }) => theme.theme.highEmphasesTextColor};
    > a {
        background-color: ${({ theme }) => theme.errorHomeButton} !important;
        background: linear-gradient(
                to left,
                ${({ theme }) => theme.theme.primaryColor} 50%,
                ${({ theme }) => theme.errorHomeButton} 50%
            )
            right;
        background-size: 200%;
        display: inline-block;
        padding: 12px 16px;
        text-transform: uppercase;
        color: ${({ theme }) => theme.theme.secondaryColor};
        text-decoration: none;
        font-weight: 600;
        animation: ${ChargeHomeButton} ease-in-out ${TIME_TO_CHARGE}s;
        -moz-animation: ${ChargeHomeButton} ease-in-out ${TIME_TO_CHARGE}s;
        -webkit-animation: ${ChargeHomeButton} ease-in-out ${TIME_TO_CHARGE}s;
        -o-animation: ${ChargeHomeButton} ease-in-out ${TIME_TO_CHARGE}s;
        -ms-animation: ${ChargeHomeButton} ease-in-out ${TIME_TO_CHARGE}s;

        &:hover {
            background-position: left !important;
            cursor: pointer;
        }
    }
`;

export default Error;
