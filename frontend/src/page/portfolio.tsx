import * as React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Data } from '../util/portfolio';
import { GlobalContainer } from '../util/theme/GlobalTheme';
import Title from '../components/Title';
const Surprise = React.lazy(() => import('../components/portfolio/Surprise'));
import { useHistory, useLocation } from 'react-router-dom';
import { portfolioURL, portfolioQuery } from '../util/url';
import { HashLoading, ErrorBoundary } from '../components/HashLoading';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';
interface PortfolioImageBackgroundProps {
    readonly backgroundImage: string;
}

type PortfolioState = {
    readonly portfolio: Data | undefined;
    readonly queryLanguage: string;
    readonly url: string;
    readonly initialLoad: boolean;
    readonly show: boolean;
    readonly width: number;
};

const Portfolio = (): JSX.Element => {
    const history = useHistory();
    const location = useLocation();
    const dotBreakPoint = 586;

    const processQuery = (search: string | null) => {
        if (search) {
            const query = new URLSearchParams(search);
            const page = query.get('page');
            const language = query.get('language');
            if (page && language) {
                return portfolioQuery(parseInt(page, 10), language);
            }
        }
        return portfolioURL;
    };

    const [state, setState] = React.useState<PortfolioState>({
        portfolio: undefined,
        queryLanguage: 'Select a language',
        url: processQuery(location.search),
        initialLoad: true,
        show: false,
        width: window.innerWidth,
    });

    const { portfolio, queryLanguage, url, initialLoad, show, width } = state;

    React.useEffect(() => {
        if (!initialLoad) {
            fetch(url)
                .then((response) => response.json())
                .then((json: Data) =>
                    setState((prevState) => ({
                        ...prevState,
                        portfolio: json,
                        queryLanguage: json.selectedLanguage,
                    }))
                )
                .catch((error) => console.error(error.message));
        }
    }, [url, initialLoad]);

    React.useEffect(() => {
        setState((prevState) => ({
            ...prevState,
            initialLoad: false,
        }));
        showSurprise();
        return history.listen((location) => {
            const { pathname, search } = location;
            if (pathname.startsWith('/portfolio')) {
                setState((prevState) => ({
                    ...prevState,
                    url: processQuery(search),
                }));
            }
        });
    }, [history]);

    React.useEffect(() => {
        const handleResizeWindow = () =>
            setState((prevState) => ({
                ...prevState,
                width: window.innerWidth,
            }));
        window.addEventListener('resize', handleResizeWindow);
        return () => {
            window.removeEventListener('resize', handleResizeWindow);
        };
    }, []);

    const showSurprise = () => {
        const viewedKey = '20799527-d73d-4ebd-87a9-efdca713af3e';
        const value = window.sessionStorage.getItem(viewedKey);
        if (value === null) {
            setTimeout(() => {
                setState((prevState) => ({
                    ...prevState,
                    show: true,
                }));
                window.sessionStorage.setItem(viewedKey, JSON.stringify(true));
            }, 5500);
        }
    };

    const ShowPortfolios = (): JSX.Element | null => {
        if (!portfolio) {
            return null;
        }
        return (
            <Container>
                <PortfolioContainer>
                    {portfolio.portfolioForPagingQueried.map(
                        ({ path, caption }) => {
                            const backgroundPath = `asset/images/portfolioBackground/${path}.webp`;
                            const logoPath = `asset/images/logo/${path}.webp`;

                            return (
                                <PortfolioItemContainer key={path}>
                                    <PortfolioImageBackground
                                        backgroundImage={backgroundPath}
                                    />
                                    <ImageTextContainer>
                                        <div>
                                            <PortfolioLink
                                                href={`https://github.com/GervinFung/${path}`}
                                            >
                                                <PortfolioLogo
                                                    src={logoPath}
                                                    alt={`${path}.webp`}
                                                />
                                            </PortfolioLink>
                                        </div>
                                        <Caption>{caption}</Caption>
                                    </ImageTextContainer>
                                </PortfolioItemContainer>
                            );
                        }
                    )}
                </PortfolioContainer>
            </Container>
        );
    };

    const customQueryPortfolio = (page: number) =>
        queryPortfolio(
            page,
            new URLSearchParams(location.search).get('language') || 'All'
        );

    const getNextPage = (portfolio: Data): number => {
        const paging = getPagingNumber();
        return paging === portfolio.numberOfPagesQueried - 1 ? 0 : paging + 1;
    };

    const getPrevPage = (portfolio: Data): number => {
        const paging = getPagingNumber();
        return paging === 0 ? portfolio.numberOfPagesQueried - 1 : paging - 1;
    };

    const Buttons = (): JSX.Element | null => {
        if (portfolio === undefined || portfolio.numberOfPagesQueried === 1) {
            return null;
        }
        return (
            <div>
                <LeftButton
                    onClick={() => customQueryPortfolio(getPrevPage(portfolio))}
                >
                    <LeftCircle />
                </LeftButton>
                <RightButton
                    onClick={() => customQueryPortfolio(getNextPage(portfolio))}
                >
                    <RightCircle />
                </RightButton>
            </div>
        );
    };

    const getPagingNumber = () => {
        const url = new URLSearchParams(location.search);
        const page = url.get('page');
        return page === null ? 0 : parseInt(page, 10) ?? 0;
    };

    const DotsNav = (): JSX.Element | null => {
        if (
            portfolio === undefined ||
            portfolio.numberOfPagesQueried === 1 ||
            width <= dotBreakPoint
        ) {
            return null;
        }
        const paging = getPagingNumber();
        const DotList = () => (
            <>
                {Array.from({ length: portfolio.numberOfPagesQueried }).map(
                    (_, i) => {
                        return paging === i ? (
                            <ActiveDot
                                onClick={() => customQueryPortfolio(i)}
                                key={i}
                            />
                        ) : (
                            <Dot
                                onClick={() => customQueryPortfolio(i)}
                                key={i}
                            />
                        );
                    }
                )}
            </>
        );
        return (
            <Dots>
                <DotList />
            </Dots>
        );
    };

    const queryPortfolio = (page: number, queryLanguage: string) => {
        setState((prevState) => ({
            ...prevState,
            url: portfolioQuery(page, queryLanguage),
            queryLanguage,
        }));
        history.push(`/portfolio?page=${page}&language=${queryLanguage}`);
    };

    const LanguageSelector = (): JSX.Element | null => {
        if (portfolio === undefined) {
            return null;
        }
        const languages = portfolio.portfolioLanguageQueried;

        return (
            <LanguageChooser>
                <Languages
                    value={queryLanguage}
                    onChange={(e) => queryPortfolio(0, e.target.value)}
                >
                    {[
                        <option key={0} disabled={true}>
                            Language
                        </option>,
                    ].concat(
                        languages.map((language) => (
                            <option key={language}>{language}</option>
                        ))
                    )}
                </Languages>
            </LanguageChooser>
        );
    };

    return (
        <ContentContainer>
            <Title
                title="Portfolio"
                content="PoolOfDeath20 or Gervin's repositories on github, the portfolio page"
            />
            <LanguageSelector />
            <ShowPortfolios />
            <Buttons />
            <DotsNav />
            <ErrorBoundary>
                <React.Suspense fallback={<HashLoading />}>
                    <Surprise
                        show={show}
                        closeMessage={() =>
                            setState((prevState) => ({
                                ...prevState,
                                show: false,
                            }))
                        }
                    />
                </React.Suspense>
            </ErrorBoundary>
        </ContentContainer>
    );
};

const ContentContainer = styled(GlobalContainer)``;

const LanguageChooser = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const Languages = styled.select`
    font-size: 1.1em;
    margin: 0 0 15px 0;
    background-color: ${({ theme }) => theme.theme.secondaryColor};
    border: 3px solid ${({ theme }) => theme.theme.secondaryColor};
    color: ${({ theme }) => theme.theme.primaryColor};
    letter-spacing: 1.5px;
    font-family: 'Orbitron', sans-serif !important;
`;

const Container = styled.div`
    display: flex;
    margin: auto;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    min-width: 100vw;
`;

const PortfolioContainer = styled.div`
    display: inline-flex;
    flex-wrap: wrap;
    min-width: 100vw;
    animation: fadeIn ease 0.5s;
    @media (max-width: 877px) {
        flex-direction: column;
    }
`;

const PortfolioImageBackground = styled.div`
    height: 40vh;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(${({
        backgroundImage,
    }: PortfolioImageBackgroundProps) => backgroundImage});
    @media (max-width: 877px) {
        height: 250px;
    }
`;

const PortfolioItemContainer = styled.div`
    width: calc(100% / 3);
    position: relative;
    justify-content: center;
    align-items: center;
    &:hover ${PortfolioImageBackground} {
        transition: all 1s ease;
        filter: brightness(20%);
    }
    @media (max-width: 877px) {
        width: 100%;
    }
`;

const Caption = styled.div`
    transition: 1s;
    font-size: 0.9em;
    font-weight: 600;
    color: transparent;
    width: 30vw;
    @media (max-width: 877px) {
        width: 50vw;
        font-size: 1em;
    }
    @media (max-width: 586px) {
        font-size: 0.7em;
    }
`;

const ImageTextContainer = styled.div`
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    padding-left: 100px;
    padding-right: 100px;
    width: calc(100% - 200px);
    &:hover ${Caption} {
        color: ${({ theme }) => theme.greenColor};
    }
`;

const PortfolioLink = styled.a.attrs({
    target: 'blank',
    rel: 'noopener noreferrer',
})`
    display: block;
`;

const PortfolioLogo = styled.img`
    width: 15vh;
    margin-bottom: 20px;
    @media (max-width: 877px) {
        width: 10vh;
        margin-bottom: 20px;
    }
    @media (max-width: 586px) {
        width: 10vh;
        margin-bottom: 5px;
    }
`;

const PortfolioNavButton = styled.div`
    cursor: pointer;
    position: fixed;
    top: 50%;
`;

const LeftButtonSlideIn = keyframes`
    0% {left: -50%;}
    100% {left: 0%;}
`;

const LeftButton = styled(PortfolioNavButton)`
    left: 0;
    animation: ${LeftButtonSlideIn} ease 1.5s;
    -moz-animation: ${LeftButtonSlideIn} ease 1.5s;
    -webkit-animation: ${LeftButtonSlideIn} ease 1.5s;
    -o-animation: ${LeftButtonSlideIn} ease 1.5s;
    -ms-animation: ${LeftButtonSlideIn} ease 1.5s;
`;

const RightButtonSlideIn = keyframes`
    0% {right: -50%;}
    100% {right: 0%;}
`;

const RightButton = styled(PortfolioNavButton)`
    right: 0;
    animation: ${RightButtonSlideIn} ease 1.5s;
    -moz-animation: ${RightButtonSlideIn} ease 1.5s;
    -webkit-animation: ${RightButtonSlideIn} ease 1.5s;
    -o-animation: ${RightButtonSlideIn} ease 1.5s;
    -ms-animation: ${RightButtonSlideIn} ease 1.5s;
`;

const FaChevronCircle = css`
    height: auto;
    width: 50px;
    border-radius: 50%;
    color: ${({ theme }) => theme.theme.secondaryColor};
    transition: all 0.2s ease;
    &:hover {
        color: ${({ theme }) => theme.theme.primaryColor};
    }
`;

const LeftCircle = styled(FaChevronCircleLeft)`
    ${FaChevronCircle};
    padding: 0 0 0 2px;
`;

const RightCircle = styled(FaChevronCircleRight)`
    ${FaChevronCircle};
    padding: 0 2px 0 0;
`;

const Dots = styled.div`
    margin-top: 10px;
    text-align: center;
`;

const Dot = styled.div`
    cursor: pointer;
    height: 16px;
    width: 40px;
    margin: 10px;
    background-color: transparent;
    display: inline-block;
    border: 3px solid ${({ theme }) => theme.theme.secondaryColor};
    &:hover {
        transition: all 0.2s ease-in;
        background-color: ${({ theme }) => theme.theme.secondaryColor};
    }
    @media (max-width: 877px) {
        height: 10px;
        width: 20px;
    }
`;

const ActiveDot = styled(Dot)`
    background-color: ${({ theme }) => theme.theme.secondaryColor};
`;

export default Portfolio;
