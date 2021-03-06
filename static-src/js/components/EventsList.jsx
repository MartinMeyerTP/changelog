import React from 'react'
import PropTypes from 'prop-types'
import leftPad from 'left-pad'

import {Table, Column, Cell} from 'fixed-data-table-2'
import 'fixed-data-table-2/dist/fixed-data-table.css'

const formatDate = (ts) => {
  const d = new Date(ts)
  return (1900 + d.getYear()) + '-' + leftPad(1 + d.getMonth(), 2, '0') + '-' + leftPad(d.getDate(), 2, '0') +
         ' ' + leftPad(d.getHours(), 2, '0') + ':' + leftPad(d.getMinutes(), 2, '0') + ':' + leftPad(d.getSeconds(), 2, '0')
}

const EventsList = ({events, height}) => {
  const fullWidth = (Math.max(document.documentElement.clientWidth, (window.innerWidth || 0)) || 800) - 15
  const criticalityWidth = 50
  const categoryWidth = 200
  const timeWidth = 200
  const descriptionWidth = fullWidth - criticalityWidth - categoryWidth - timeWidth
  const rowHeightGetter = (rowIndex) => {
    if (!events[rowIndex]) {
      return 30
    }
    // This might have markup, so let's strip it out
    const description = events[rowIndex].description
    const div = document.createElement('div')
    div.innerHTML = description
    const strippedDescription = div.textContent || div.innerText || ''
    // This is.. uhh... mostly guess-work.
    // 10 is a good margin. 19 is roughly the height of one line
    // the rest is "how many lines does this text need?", and 9 seems like an OK constant.
    return 10 + 19 * Math.max(1, Math.ceil(strippedDescription.length * 9 / descriptionWidth))
  }
  return (
    <Table
      rowsCount={events.length}
      width={fullWidth}
      height={height}
      rowHeight={30}
      rowHeightGetter={rowHeightGetter}
      headerHeight={30}
      className='events-table'
      rowClassNameGetter={n => 'events-table-row'}
    >
      <Column
        width={criticalityWidth}
        header={<Cell>Crit</Cell>}
        cell={({rowIndex, width, height}) => <Cell width={width} height={height}>{events[rowIndex].criticality}</Cell>}
      />
      <Column
        width={categoryWidth}
        header={<Cell>Category</Cell>}
        cell={({rowIndex, width, height}) => <Cell width={width} height={height}>{events[rowIndex].category}</Cell>}
      />
      <Column
        width={timeWidth}
        header={<Cell>Time</Cell>}
        cell={({rowIndex, width, height}) => <Cell width={width} height={height}>{formatDate(events[rowIndex].unix_timestamp * 1000)}</Cell>}
      />
      <Column
        width={descriptionWidth}
        header={<Cell>Description</Cell>}
        cell={({rowIndex, width, height}) =>
          <Cell width={width} height={height}>
            <span dangerouslySetInnerHTML={{__html: events[rowIndex].description}} />
          </Cell>}
      />
    </Table>
  )
}

EventsList.propTypes = {
  events: PropTypes.arrayOf(PropTypes.shape({
    criticality: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    unix_timestamp: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired
  })).isRequired,
  height: PropTypes.number.isRequired
}

export default EventsList
