import { applyMiddleware, createStore as reduxCreateStore, compose } from 'redux'
import { createBrowserHistory } from 'history'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer, createMigrate } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import sagas from 'sagas/index'
import createRootReducer from 'reducers/index'

const initialState = {}
export const history = createBrowserHistory()
const rootReducer = createRootReducer(history)

const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

//ensure that changes to persisted store are migrated from one version to the next
const migrations = {
  0: state => {
    return {
      ...state,
    }
  }
}

export const store = reduxCreateStore(
  persistReducer({
    key: 'root',
    storage,
    version: 0,
    migrate: createMigrate(migrations, { debug: true }),
  }, rootReducer),
  initialState,
  composeEnhancers(
    applyMiddleware(sagaMiddleware)
  )
)

sagaMiddleware.run(sagas)

export const persistor = persistStore(store)
