import AuthService from "./AuthService";

function newAuthFetch(auth: AuthService) {
    return async (input: RequestInfo | URL, init?: RequestInit) => fetch(
        input, 
        {
            ...init, 
            headers: {
                ...init?.headers, 
                'Authentication': `Token ${(await auth.getToken()) as string}`,
            }
        }
    );
}
export default newAuthFetch; 