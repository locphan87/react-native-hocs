import { SFC } from 'react'
import { StyleSheet, View } from 'react-native'
import { compose, withProps, withState } from 'recompose'

interface IUpdateOptions {
  updates: string[]
  component: SFC<any>
}

const withUpdating = LoadingComponent => WrappedComponent => ({
  isUpdating,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      <WrappedComponent {...rest} />
      {isUpdating && <LoadingComponent style={styles.updating} />}
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  updating: {
    backgroundColor: 'white',
    opacity: 0.7
  }
})

const simulatePending = updates => props =>
  updates.reduce((acc, updatePropName) => {
    acc[updatePropName] = async (...args) => {
      try {
        props.setUpdating(true)
        const response = await props[updatePropName](...args)
        props.setUpdating(false)

        return response
      } catch (err) {
        props.setUpdating(false)
        // catch should only process errors that
        // it knows and `rethrow` all others.
        throw err
      }
    }

    return acc
  }, {})

const withUpdatingCreator = ({ updates, component }: IUpdateOptions) =>
  compose(
    withState('isUpdating', 'setUpdating', false),
    withProps(simulatePending(updates)),
    withUpdating(component)
  )

export { withUpdatingCreator, IUpdateOptions }
