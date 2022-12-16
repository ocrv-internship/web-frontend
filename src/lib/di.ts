import AuthFetcher from "./features/auth/domain/service/AuthFetch";
import TokenAuthService from "./features/auth/domain/service/TokenAuthService";
import AuthBloc from "./features/auth/domain/state/AuthBloc";
import AuthScreenBloc from "./features/auth/domain/state/AuthScreenBloc";
import TokenStoreImpl from "./features/auth/store/TokenStoreImpl";
import { APITextsService } from "./features/texts/domain/service/APITextsService";
import { MockTextsService } from "./features/texts/domain/service/MockTextsService";
import { TextsBloc } from "./features/texts/domain/state/TextsBloc";

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

const tokenStore = new TokenStoreImpl(localStorage);
const authService = new TokenAuthService(tokenStore, ep);
const authFetcher = new AuthFetcher(authService);
const textsService = new APITextsService(authFetcher, ep);

uiDeps = {
    textsBloc: () => new TextsBloc(textsService),
    authBloc: () => new AuthBloc(authService),
    authScreenBloc: () => new AuthScreenBloc(authService),
};