import ApolloClient from 'apollo-client'
import { Store } from 'redux'
import { all } from 'redux-saga/effects'

import initialFormSaga from '../components/Form.sagas'
declare global {
  interface ApplicationSagaContext {
    apolloClient: ApolloClient<any>
    store: Store<ApplicationState>
  }
}
/**
 * This file is the root of sagas
 * - in our application saga will start running on client side only
 * - For performance improve you should avoid to run saga if your page is
 *   not using it
 */
export default (context: ApplicationSagaContext) => function * rootSagas() {
  // sagas begin initial
  console.log('Sagas start !!')
  yield all([
    // add your sagas here
    initialFormSaga(context)
  ])

}
