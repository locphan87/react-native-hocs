import { SFC } from 'react'
import insertIf from 'insert-if'
import { isNonEmptyArray, isNilOrEmpty } from 'ramda-adjunct'
import { compose } from 'recompose'

import { IRenderBranch, renderWhen } from './renderWhen.hoc'
import { withLoadingCreator, ILoadingOptions } from './withLoading.hoc'
import { withUpdatingCreator, IUpdateOptions } from './withUpdating.hoc'

interface IWithAppCreator {
  LoadingComponent: SFC<any>
  loadingPredicate(): boolean
}
interface IWithApp {
  updates?: string[]
  renderWhen?: IRenderBranch[]
}

const withAppCreator = ({
  LoadingComponent,
  loadingPredicate
}: IWithAppCreator) => ({
  updates = [],
  renderWhen: renderBranches = []
}: IWithApp = {}) => (WrappedComponent: SFC<any>) => {
  const loadingOptions: ILoadingOptions = {
    predicate: loadingPredicate,
    component: LoadingComponent
  }
  const updateOptions: IUpdateOptions = {
    updates,
    component: LoadingComponent
  }
  const enhancers = [
    ...insertIf(
      !isNilOrEmpty(loadingOptions),
      withLoadingCreator(loadingOptions)
    ),
    ...insertIf(isNonEmptyArray(updates), withUpdatingCreator(updateOptions)),
    ...insertIf(isNonEmptyArray(renderBranches), renderWhen(renderBranches))
  ]

  return compose(...enhancers)(WrappedComponent)
}

export { withAppCreator }
