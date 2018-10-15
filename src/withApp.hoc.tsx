import { SFC, CSSProperties } from 'react'
import insertIf from 'insert-if'
import { isNonEmptyArray, isNilOrEmpty } from 'ramda-adjunct'
import { compose } from 'recompose'

import { IRenderBranch, renderWhen } from './renderWhen.hoc'
import { withLoadingCreator, ILoadingOptions } from './withLoading.hoc'
import { withUpdatingCreator, IUpdateOptions } from './withUpdating.hoc'

interface IWithAppCreator {
  loadingComponent: SFC<any>
  loadingPredicate(): boolean
  updatingStyle?: CSSProperties
}
interface IWithApp {
  updates?: string[]
  renderWhen?: IRenderBranch[]
}

const withAppCreator = ({
  loadingComponent,
  loadingPredicate,
  updatingStyle
}: IWithAppCreator) => ({
  updates = [],
  renderWhen: renderBranches = []
}: IWithApp = {}) => (WrappedComponent: SFC<any>) => {
  const loadingOptions: ILoadingOptions = {
    predicate: loadingPredicate,
    component: loadingComponent
  }
  const updateOptions: IUpdateOptions = {
    updates,
    updatingStyle,
    component: loadingComponent
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
