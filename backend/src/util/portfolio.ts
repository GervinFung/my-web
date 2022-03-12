import fetch from 'node-fetch';
import { parseAsReadonlyArray, parseAsString } from 'parse-dont-validate';

type PortfolioData = Readonly<{
    name: string;
    description: string;
    language: string;
    url: string;
}>;

type Data = Readonly<{
    numberOfPagesQueried: number;
    portfolioLanguages: ReadonlyArray<string>;
    portfolioPaginated: ReadonlyArray<PortfolioData>;
    selectedLanguage: string;
}>;

const fetchGithubUser = async (): Promise<ReadonlyArray<PortfolioData>> =>
    parseAsReadonlyArray(
        await (
            await fetch(
                'https://api.github.com/users/GervinFung/repos?per_page=50'
            )
        ).json(),
        (repo) => {
            const { name, language, html_url, description } = repo;
            const parsedName = parseAsString(name).orElseThrowDefault('name');
            return ![
                'LibGDX-Chess-Game',
                'MinimalTicTacToe',
                'TextEditorFX',
                'SimpleParallelChessAI',
                'AndroidSimpleAIChess',
                'Connect4',
                'TicTacToe',
                'TextEditor',
                'RealTimeMarkdown',
                'Room',
            ].find((portfolioName) => parsedName === portfolioName)
                ? []
                : [
                      {
                          name: parsedName,
                          language:
                              parseAsString(language).orElseThrowDefault(
                                  'language'
                              ),
                          description:
                              parseAsString(description).orElseThrowDefault(
                                  'description'
                              ),
                          url: parseAsString(html_url).orElseThrowDefault(
                              'html_url'
                          ),
                      },
                  ];
        }
    )
        .orElseThrowDefault('repositories')
        .flat();

const fetchGithubOrganization = async (
    organizationName: string
): Promise<PortfolioData> => {
    const { language } = Array.from(
        parseAsReadonlyArray(
            await (
                await fetch(
                    `https://api.github.com/orgs/${organizationName}/repos`
                )
            ).json(),
            (repo) => {
                if (repo.full_name === 'Utari-Room/diagram') {
                    return [];
                }
                return [
                    parseAsString(repo.language).orElseThrowDefault('language'),
                ];
            }
        )
            .orElseThrowDefault('repositories')
            .flat()
            .reduce((prev, language) => {
                if (language) {
                    const prevItem = prev.get(language);
                    return prev.set(
                        language,
                        prevItem === undefined ? 1 : prevItem + 1
                    );
                }
                return prev;
            }, new Map<string, number>())
    ).reduce(
        (prev, [language, count]) =>
            prev.count < count
                ? {
                      language,
                      count,
                  }
                : prev,
        {
            language: '' as string,
            count: 0 as number,
        } as const
    );
    const organization: any = await (
        await fetch(`https://api.github.com/orgs/${organizationName}`)
    ).json();
    const { login, description, html_url } = organization;
    return {
        name: parseAsString(login).orElseThrowDefault('login'),
        language,
        description:
            parseAsString(description).orElseThrowDefault('description'),
        url: parseAsString(html_url).orElseThrowDefault('html_url'),
    };
};

const portfolioLanguagesList = (
    portfolioData: ReadonlyArray<PortfolioData>
): ReadonlyArray<string> =>
    Array.from(new Set(portfolioData.map((data) => data.language)))
        .concat('All')
        .sort((a, b) => a.localeCompare(b));

const findPortfoliosFromLanguage = (
    portfolioData: ReadonlyArray<PortfolioData>,
    selectedLanguage: string
): ReadonlyArray<PortfolioData> =>
    selectedLanguage === 'All'
        ? portfolioData
        : portfolioData.filter(({ language }) => language === selectedLanguage);

const parsePageQuery = (
    page: string,
    numberOfPortfolioPerPage: number
): number => {
    const parsedPage = parseInt(page, 10);
    return parsedPage >= 0 ? parsedPage * numberOfPortfolioPerPage : 0;
};

const findLanguageQueried = (
    portfolioData: ReadonlyArray<PortfolioData>,
    language: string
): string | 'All' => {
    const finalizedLang =
        language === 'CPP' ? 'C++' : language === 'C' ? 'C#' : language;

    return (
        portfolioData.find((data) => data.language === finalizedLang)
            ?.language ?? 'All'
    );
};

const paginatePortfolio = (
    portfolioData: ReadonlyArray<PortfolioData>,
    pageNumber: number
): ReadonlyArray<PortfolioData> =>
    portfolioData.flatMap((_, index) => {
        const data = portfolioData[index + pageNumber];
        return index < 9 ? (data ? [data] : []) : [];
    });

const portfolioDataPromise = async () =>
    (
        await Promise.all(['Utari-Room', 'P-YNPM'].map(fetchGithubOrganization))
    ).concat(await fetchGithubUser());

const portfolioData = portfolioDataPromise();

export const getSpecifiedResponse = async (
    page: string | number,
    language: string
): Promise<Data> => {
    const numberOfPortfolioPerPage = 9;

    const portfolio = await portfolioData;

    const selectedLanguage = findLanguageQueried(portfolio, language);
    const portfolioQueried = findPortfoliosFromLanguage(
        portfolio,
        selectedLanguage
    );

    return {
        numberOfPagesQueried: Math.ceil(
            portfolioQueried.length / numberOfPortfolioPerPage
        ),
        portfolioLanguages: portfolioLanguagesList(portfolio),
        portfolioPaginated: paginatePortfolio(
            portfolioQueried,
            typeof page === 'number'
                ? page
                : parsePageQuery(page, numberOfPortfolioPerPage)
        ),
        selectedLanguage,
    };
};

export const getUnspecifiedResponse = () => getSpecifiedResponse(0, 'All');
