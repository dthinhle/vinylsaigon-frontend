import { RefinementList } from 'react-instantsearch'

import { FLAGS_TRANSLATIONS, FlagValue, SHARED_CLASSES } from './static-list-product'

interface FeatureToggleProps {
  attribute: string,
  hideCount?: boolean,
}

export const FeatureToggle = ({ attribute, hideCount }: FeatureToggleProps) => {
  const classNames = SHARED_CLASSES.refinementList
  if (hideCount) {
    classNames.count = 'hidden'
  }
  return (
    <RefinementList
      attribute={attribute}
      operator='or'
      title={attribute}
      sortBy={['name:asc']}
      transformItems={(items) => {
        return items.map((item) => {
          const label: FlagValue = item.value as FlagValue
          return {
            ...item,
            label: FLAGS_TRANSLATIONS[label],
          }
        })
      }}
      classNames={classNames}
    />
  )
}
