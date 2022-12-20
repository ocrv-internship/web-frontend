import { newFetcherAuthMW } from "./features/auth/domain/service/AuthFetch";
import TokenAuthService from "./features/auth/domain/service/TokenAuthService";
import AuthBloc from "./features/auth/domain/state/AuthBloc";
import AuthScreenBloc from "./features/auth/domain/state/AuthScreenBloc";
import TokenDataSourceImpl from "./features/auth/datasources/TokenDataSourceImpl";
import { APITextsService } from "./features/texts/domain/service/APITextsService";
import { TextsBloc } from "./features/texts/domain/state/TextsBloc";
import NetworkAuthDataSourceImpl from "./features/auth/datasources/NetworkAuthDataSourceImpl";
import { FetcherExceptionMW } from "./core/fetcher/fetcher";
import NetworkTextsDataSourceImpl from "./features/texts/datasources/NetworkTextsDataSourceImpl";

interface UIDeps {
    textsBloc: () => TextsBloc;
    authBloc: () => AuthBloc;
    authScreenBloc: () => AuthScreenBloc, 
}
export let uiDeps: UIDeps;

window.addEventListener('storage', (e) => console.log(e));

const host = "http://localhost:8000/";
// const host = "https://api.ocrv.skomarov.com/";
const apiHost = host+"api/v1/"; 
const ep = {
    texts: apiHost+"texts/", 
    speeches: apiHost+"speeches/",
    skips: apiHost+"skips/",
    login: host+"auth/login/", 
    register: host+"auth/register/", 
    logout: host+"auth/logout/",
};


const baseFetcher = FetcherExceptionMW(fetch);

const tokenStore = new TokenDataSourceImpl(localStorage);
const authDS = new NetworkAuthDataSourceImpl(baseFetcher, ep);
const authService = new TokenAuthService(tokenStore, authDS);
const authFetcher = newFetcherAuthMW(authService)(baseFetcher);
const textsDS = new NetworkTextsDataSourceImpl(authFetcher, ep);
const textsService = new APITextsService(textsDS);

uiDeps = {
    textsBloc: () => new TextsBloc(textsService),
    authBloc: () => new AuthBloc(authService),
    authScreenBloc: () => new AuthScreenBloc(authService),
};