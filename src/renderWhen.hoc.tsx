import { SFC } from 'react'
import { branch, compose, renderComponent, renderNothing } from 'recompose'

interface IRenderBranch {
  when(): boolean
  render: SFC<any> | 'NOTHING'
}

const renderWhen = (branches: IRenderBranch[]) =>
  compose(
    ...branches.map(({ when, render }: IRenderBranch) => {
      const component =
        render === 'NOTHING' ? renderNothing : renderComponent(render)

      return branch(when, component)
    })
  )

export { IRenderBranch, renderWhen }
