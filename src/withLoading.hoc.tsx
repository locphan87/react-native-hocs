import { SFC } from 'react'
import { branch, renderComponent } from 'recompose'

interface ILoadingOptions {
  predicate(obj: any): boolean
  component: SFC<any>
}

const withLoadingCreator = (options: ILoadingOptions) => {
  const { predicate, component } = options
  return branch(predicate, renderComponent(component))
}

export { withLoadingCreator, ILoadingOptions }
