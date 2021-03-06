import * as React from 'react';
import styled from 'styled-components';
import ResumeLeft from '../components/resume/ResumeLeft';
import ResumeRight from '../components/resume/ResumeRight';
import { GlobalContainer } from '../theme/GlobalTheme';
import Title from '../components/Title';

const Resume = () => (
    <ContentContainer>
        <Title title="Resume" content="PoolOfDeath20 or Gervin's resume page" />
        <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap"
            rel="stylesheet"
        />
        <Container>
            <ResumeContainer>
                <ResumeLeft />
                <ResumeRight />
            </ResumeContainer>
        </Container>
    </ContentContainer>
);

const ContentContainer = styled(GlobalContainer)``;

const Container = styled.div`
    display: flex;
    margin: auto;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    min-width: 100vw;
    font-family: 'Montserrat', sans-serif !important;
`;

const ResumeContainer = styled.div`
    margin: 15px;
    display: flex;
    width: 90%;
    justify-content: center;
    box-shadow: -5px 5px ${({ theme }) => theme.greenColor},
        5px -5px ${({ theme }) => theme.redColor};
    background-color: transparent;
    @media (max-width: 840px) {
        display: block;
    }
`;

export default Resume;
