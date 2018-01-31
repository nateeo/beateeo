import React, { Component } from 'react'
import styled from 'styled-components'
import { ipcRenderer } from 'electron'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import PlaylistEntry from '../components/PlaylistEntry'

import connect from '../state/connect'

import {
  QUEUE_ADD,
  QUEUE_REMOVE,
  QUEUE_SKIP,
  QUEUE_PAUSE,
  QUEUE_RESUME,
  UPDATE_VOLUME,
} from '../state/actions'

const Layout = styled.div`
  background-color: black;
  width: 100vw;
  height: 100vh;
  color: white;
`

const PlaylistContainer = styled.div`
  border: 1px solid black;
  padding: 10px;
  transition: background-color 200ms ease-out;
`

const Playlist = styled.div`
  background-color: ${props => (props.isDragging ? 'lightblue' : 'grey')};
  padding: 10px;
  width: 250px;
`

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

class Dashboard extends Component {
  state = {
    queue: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
  }

  componentDidUpdate = () => {
    console.log(this.state)
  }

  handleMessages = () => {
    ipcRenderer.send('start')
  }

  handleDragEnd = result => {
    if (!result.destination) return

    const queue = reorder(
      this.state.queue,
      result.source.index,
      result.destination.index
    )

    this.setState({
      queue,
    })
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
                  {this.state.queue.map((item, index) => (
                    <PlaylistEntry
                      id={item.id}
                      draggableId={item.id}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
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

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
