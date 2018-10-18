# React Native HOCs

A collection of small, reusable Higher Order Components (HOCs) for building React Native apps

Table of Contents
=================

* [Getting started](#getting-started)
* [APIs](#apis)
   * [renderWhen](#renderwhen)
   * [withLoadingCreator](#withloadingcreator)
   * [withUpdatingCreator](#withupdatingcreator)
   * [withApp](#withapp)

## Getting started

```sh
$ npm install react-native-hocs
```

## APIs

### renderWhen

Render related components conditionally

```ts
interface IRenderBranch {
  when(obj: any): boolean
  render: SFC<any> | 'NOTHING'
}
```

* A common implementation to render a component

```ts
const MyComponent = props => {
  if (props.loading) {
    return <Loading />
  }
  if (props.errors) {
    return <Text>Something went wrong</Text>
  }
  if (equals(conditionA, true)) {
    return <ComponentA {...props} />
  }
  if (equals(conditionB, true)) {
    return <ComponentB {...props} />
  }
  ...

  return <View><MainComponent /></View>
}
```
* Use `renderWhen` to keep only the main render and apply a pattern matching for sub-renders

```ts
import { renderWhen } from 'react-native-hocs'

const MyComponent = props => <View><MainComponent /></View>
const isLoading = props => {}
const hasErrror = props => {}
const isSomethingA = props => {}
const isSomethingB = props => {}
const enhance = renderWhen([
  {
    when: isLoading,
    render: Loading
  },
  {
    when: hasError,
    render: ErrorComponent
  },
  {
    when: isSomethingA,
    render: ComponentA
  },
  {
    when: isSomethingB,
    render: ComponentB
  }
])

export default enhance(MyComponent)
```

### withLoadingCreator

Show a spinner conditionally as a replacement for the wrapped component (i.e while loading server data)

```ts
interface ILoadingOptions {
  predicate(obj: any): boolean
  component: SFC<any>
}
```

* Create a higher order component `withLoading`

```ts
import { withLoadingCreator } from 'react-native-hocs'

import LoadingMask from '../../LoadingMask/LoadingMask.component'

const loadingPredicate = props => props.loading
const withLoading = withLoadingCreator({
  predicate: loadingPredicate,
  component: LoadingMask
})
```

* Apply the HOC

```ts
const MyComponent = () => {...}

export default withLoading(MyComponent)
```

### withUpdatingCreator

Show a spinner conditionally as an overlay over the wrapped component (i.e while updating server data)

```ts
interface IUpdateOptions {
  updates: string[]
  component: SFC<any>
  updatingStyle?: CSSProperties
}
```

* Create a higher order component `withUpdating`

```ts
import { withUpdatingCreator } from 'react-native-hocs'

import LoadingMask from '../../LoadingMask/LoadingMask.component'

const withUpdating = withLoadingCreator({
  updates: ['updateUserPassword', 'logout'],
  component: LoadingMask
})
```

Whenever you call asynchronously a prop (i.e `logout`) that belongs to the update list `updates`, it'll show a spinner

* Apply the HOC

```ts
const MyComponent = () => {...}

export default withUpdating(MyComponent)
```

### withApp

```ts
interface IWithAppCreator {
  loadingComponent: SFC<any>
  loadingPredicate(obj: any): boolean
  updatingStyle?: CSSProperties
}
```

```ts
interface IWithApp {
  updates?: string[]
  renderWhen?: IRenderBranch[]
}
```

* Create a higher order component `withApp`

```ts
import { withApp } from 'react-native-hocs'

import LoadingMask from '../../LoadingMask/LoadingMask.component'

const loadingPredicate = props => props.loading
const withApp = withAppCreator({
  loadingPredicate,
  loadingComponent: LoadingMask
})
```

* Apply the HOC

```ts
const MyComponent = () => {...}

export default withApp({
  updates: ['logout'],
  renderWhen: [{
    when: hasError,
    render: ErrorComponent
  }]
})(MyComponent)
```
