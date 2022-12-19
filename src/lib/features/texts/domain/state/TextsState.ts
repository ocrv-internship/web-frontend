import { Failure } from "../../../../core/errors/failures";
import { DurationSec } from "../../../../core/utils/utils";
import { TextInfo } from "../service/TextsService";

export enum Loading {
    skipping, 
    sending,
}

export interface LoadedState {
    texts: TextInfo[], 
    currentInd: number, 
    fullRecDurationSec: number,
    rewriteMode?: boolean, 
    loading?: Loading, 
    err?: Failure;
}

export interface RecInfo {
    blob: Blob, 
    isVideo: boolean,
    duration: DurationSec,
}

export type TextsState = null | LoadedState | Failure; 

