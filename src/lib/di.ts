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

const host = "http://localhost:8000/";

const apiHost = host+"api/v1/"; 
const auth = apiHost+"auth/";
const ep = {
    texts: apiHost+"texts/", 
    speeches: apiHost+"speeches/",
    skips: apiHost+"skips/",
    login: auth+"login/", 
    register: auth+"register/", 
    logout: auth+"logout/",
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