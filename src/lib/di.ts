import AuthFetcher, { newFetcherAuthMW } from "./features/auth/domain/service/AuthFetch";
import TokenAuthService from "./features/auth/domain/service/TokenAuthService";
import AuthBloc from "./features/auth/domain/state/AuthBloc";
import AuthScreenBloc from "./features/auth/domain/state/AuthScreenBloc";
import TokenDataSourceImpl from "./features/auth/datasources/TokenDataSourceImpl";
import { APITextsService } from "./features/texts/domain/service/APITextsService";
import { TextsBloc } from "./features/texts/domain/state/TextsBloc";
import NetworkAuthDataSource from "./features/auth/domain/datasources/NetworkAuthDataSource";
import NetworkAuthDataSourceImpl from "./features/auth/datasources/NetworkAuthDataSourceImpl";
import { FetcherExceptionMW } from "./core/fetcher/fetcher";

interface UIDeps {
    textsBloc: () => TextsBloc;
    authBloc: () => AuthBloc;
    authScreenBloc: () => AuthScreenBloc, 
}
export let uiDeps: UIDeps;

// const apiHost = "https://api.ocrv.skomarov.com/api/v1/";
const host = "http://localhost:8000/";
const apiHost = host+"api/v1/"; 
const ep = {
    texts: apiHost+"texts/", 
    speeches: apiHost+"speeches/",
    skips: apiHost+"skips/",
    login: host+"auth/login/", 
    register: host+"auth/register/", 
}


const baseFetcher = FetcherExceptionMW(fetch);

const tokenStore = new TokenDataSourceImpl(localStorage);
const authDS = new NetworkAuthDataSourceImpl(baseFetcher, ep);
const authService = new TokenAuthService(tokenStore, authDS);
const authFetcher = newFetcherAuthMW(authService)(baseFetcher);
const textsService = new APITextsService(authFetcher, ep);

uiDeps = {
    textsBloc: () => new TextsBloc(textsService),
    authBloc: () => new AuthBloc(authService),
    authScreenBloc: () => new AuthScreenBloc(authService),
};