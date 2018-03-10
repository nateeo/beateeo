import React, { Component } from 'react'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import PlaylistEntry from '../components/PlaylistEntry'

import connect from '../state/connect'

import { queueAdd, queueReorder } from '../state/actions'

const Layout = styled.div`
  background-color: black;
  width: 100vw;
  height: 100vh;
  color: white;
`

const PlaylistContainer = styled.div``

const Playlist = styled.div`
  background-color: ${props => (props.isDragging ? '#626467' : '#8E9093')};
  transition: background-color 100ms ease-out;
  border-radius: 4px;
  padding: 10px;
  width: 250px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

class Dashboard extends Component {
  handleMessages = () => {
    ipcRenderer.send('start')
  }

  handleDragEnd = result => {
    if (!result.destination) return

    const queue = reorder(
      this.props.queue,
      result.source.index,
      result.destination.index
    )
    console.log('re-ordering the queue')
    console.log(this.props.queueReorder)
    this.props.queueReorder(queue)
  }

  render() {
    return (
      <Layout>
        <PlaylistContainer>
          <DragDropContext onDragEnd={this.handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <Playlist
                  innerRef={provided.innerRef}
                  isDragging={snapshot.isDraggingOver}
                >
                  {this.props.queue.map((item, index) => (
                    <PlaylistEntry index={index} song={item} />
                  ))}
                  {provided.placeholder}
                  {!this.props.queue.length && 'Playlist is empty'}
                </Playlist>
              )}
            </Droppable>
          </DragDropContext>
        </PlaylistContainer>
        <div onClick={this.handleMessages}>SOME</div>
        <div>current volume: {this.props.volume}</div>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  volume: state.volume,
  queue: state.queue,
  isPlaying: state.isPlaying,
})

const mapDispatchToProps = dispatch => ({
  queueAdd,
  queueReorder,
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
