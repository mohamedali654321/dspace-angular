import { RemoteData } from '../core/data/remote-data';
import { Observable, of as observableOf } from 'rxjs';
import { environment } from '../../environments/environment';
import { PathableObjectError, RequestEntryState } from '../core/data/request.reducer';

/**
 * A fixed timestamp to use in tests
 */
const FIXED_TIMESTAMP = new Date().getTime();

/**
 * Method to create a remote data object that has succeeded
 * @param object The object to wrap
 * @param timeCompleted the moment when the remoteData was completed
 */
export function createSuccessfulRemoteDataObject<T>(object: T, timeCompleted = FIXED_TIMESTAMP): RemoteData<T> {
  return new RemoteData(
    timeCompleted,
    environment.cache.msToLive.default,
    timeCompleted,
    RequestEntryState.Success,
    undefined,
    object,
    200
  );
}

/**
 * Method to create a remote data object that has succeeded, wrapped in an observable
 * @param object The object to wrap
 * @param timeCompleted the moment when the remoteData was completed
 */
export function createSuccessfulRemoteDataObject$<T>(object: T, timeCompleted?: number): Observable<RemoteData<T>> {
  return observableOf(createSuccessfulRemoteDataObject(object, timeCompleted));
}

/**
 * Method to create a remote data object that has failed
 *
 * @param errorMessage  the error message
 * @param statusCode    the status code
 * @param timeCompleted the moment when the remoteData was completed
 * @param errors the list of pathable errors
 */
export function createFailedRemoteDataObject<T>(errorMessage?: string, statusCode?: number, timeCompleted = 1577836800000, errors: PathableObjectError[] = []): RemoteData<T> {
  return new RemoteData(
    timeCompleted,
    environment.cache.msToLive.default,
    timeCompleted,
    RequestEntryState.Error,
    errorMessage,
    undefined,
    statusCode,
    errors
  );
}

/**
 * Method to create a remote data object that has failed, wrapped in an observable
 *
 * @param errorMessage  the error message
 * @param statusCode    the status code
 * @param timeCompleted the moment when the remoteData was completed
 * @param errors the list of pathable errors
 */
export function createFailedRemoteDataObject$<T>(errorMessage?: string, statusCode?: number, timeCompleted?: number, errors?: PathableObjectError[]): Observable<RemoteData<T>> {
  return observableOf(createFailedRemoteDataObject(errorMessage, statusCode, timeCompleted, errors));
}

/**
 * Method to create a remote data object that is still pending
 * @param lastVerified the moment when the remoteData was last verified
 */
export function createPendingRemoteDataObject<T>(lastVerified = FIXED_TIMESTAMP): RemoteData<T> {
  return new RemoteData(
    undefined,
    environment.cache.msToLive.default,
    lastVerified,
    RequestEntryState.ResponsePending,
    undefined,
    undefined,
    undefined
  );
}

/**
 * Method to create a remote data object that is still pending, wrapped in an observable
 * @param lastVerified the moment when the remoteData was last verified
 */
export function createPendingRemoteDataObject$<T>(lastVerified?: number): Observable<RemoteData<T>> {
  return observableOf(createPendingRemoteDataObject(lastVerified));
}

/**
 * Method to create a remote data object with no content
 * @param timeCompleted the moment when the remoteData was completed
 */
export function createNoContentRemoteDataObject<T>(timeCompleted?: number): RemoteData<T> {
  return createSuccessfulRemoteDataObject(undefined, timeCompleted);
}

/**
 * Method to create a remote data object that has succeeded with no content, wrapped in an observable
 * @param timeCompleted the moment when the remoteData was completed
 */
export function createNoContentRemoteDataObject$<T>(timeCompleted?: number): Observable<RemoteData<T>> {
  return createSuccessfulRemoteDataObject$(undefined, timeCompleted);
}
