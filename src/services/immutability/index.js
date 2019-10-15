import update from 'immutability-helper'
import * as constants from 'constants/index'

const successStatus = {
  isSuccess: { $set: true },
  isFailure: { $set: false },
  isLoading: { $set: false },
  isIdle: { $set: false },
}

const failureStatus = {
  isSuccess: { $set: false },
  isFailure: { $set: true },
  isLoading: { $set: false },
  isIdle: { $set: false },
}

const loadingStatus = {
  isSuccess: { $set: false },
  isFailure: { $set: false },
  isLoading: { $set: true },
  isIdle: { $set: false },
}

const idleStatus = {
  isSuccess: { $set: false },
  isFailure: { $set: false },
  isLoading: { $set: false },
  isIdle: { $set: true },
}

update.extend('$auto', (value, object) =>
  object ?
    update(object, value) :
    update({}, value)
)

update.extend('$autoArray', (value, object) =>
  object ?
    update(object, value) :
    update([], value)
)

update.extend('$setStatusMeta', (data, original) => {
  if (data === constants.SUCCESS) {
    return update(original, successStatus)
  }
  else if (data === constants.FAILURE) {
    return update(original, failureStatus)
  }
  else if (data === constants.LOADING) {
    return update(original, loadingStatus)
  }
  else if (data === constants.IDLE) {
    return update(original, idleStatus)
  }
  return original
})

export const setStatusMetaHelper = (status) => {
  return update({}, { $setStatusMeta: status })
}
