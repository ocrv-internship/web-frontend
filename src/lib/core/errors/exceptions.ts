import { isConstructorDeclaration } from "typescript"

export class NetworkException {
    constructor(readonly resp: Response) {};
}
