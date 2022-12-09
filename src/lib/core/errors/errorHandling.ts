import { Failure, NetworkFailure, UnknownNetworkFailure } from "./failures";


export function getNetworkFailure(response: Response) {
    return response.json()
        .then((json: {display_message: string}) => 
            new NetworkFailure(json.display_message)
        )
        .catch((e) => new UnknownNetworkFailure());
}