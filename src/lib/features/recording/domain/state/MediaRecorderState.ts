import { Failure } from "../../../../core/errors/failures";
import { DurationSec } from "../../../../core/utils/utils";
import { RecInfo } from "../../../texts/domain/state/TextsState";

export interface BaseRecording {
    retries: number
    minDuration?: DurationSec, 
    maxDuration?: DurationSec,
};

export interface BaseRecordingState {
    base: BaseRecording,
}

export class Initial implements BaseRecordingState {
    constructor(readonly base: BaseRecording, readonly video: boolean = false) { };
};

export class Recording implements BaseRecordingState {
    constructor(
        readonly currDuration: DurationSec, 
        readonly base: BaseRecording, 
        readonly video: boolean
    ) { };
};

export class Recorded implements BaseRecordingState {
    constructor(readonly rec: RecInfo, readonly base: BaseRecording) { };
};

export class ErrorState implements BaseRecordingState {
    constructor(readonly err: Failure, readonly base: BaseRecording) { };
}

export type MediaRecordingState = Initial | Recording | Recorded | ErrorState;
