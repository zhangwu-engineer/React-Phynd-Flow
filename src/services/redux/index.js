import { applyMiddleware, createStore as reduxCreateStore, compose } from 'redux'
import { createBrowserHistory } from 'history'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import sagas from 'sagas/index'
import createRootReducer from 'reducers/index'

const initialState = {}
export const history = createBrowserHistory()
const rootReducer = createRootReducer(history)

const sagaMiddleware = createSagaMiddleware()
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const store = reduxCreateStore(
  persistReducer({
    key: 'root',
    storage,
  }, rootReducer),
  initialState,
  composeEnhancers(
    applyMiddleware(sagaMiddleware)
  )
)

sagaMiddleware.run(sagas)

export const persistor = persistStore(store)
