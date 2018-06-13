import React, { Component } from 'react'
import styled from 'styled-components'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

import PlaylistEntry from '../../components/PlaylistEntry'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const TopBar = styled.div`
  display: flex;
  color: white;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.1);
`

const BodyContainer = styled.div`
  display: flex;
  height: 100%;
`

const Playlist = styled.div`
  background-color: ${props => (props.isDragging ? '#626467' : '#8E9093')};
  transition: background-color 100ms ease-out;
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

export default class Dashboard extends Component {
  state = {
    queue: [
      { id: 0, title: '1' },
      { id: 1, title: '2' },
      { id: 2, title: '3' },
    ],
  }

  handleDragEnd = result => {
    if (!result.destination) return

    const queue = reorder(
      this.state.queue,
      result.source.index,
      result.destination.index
    )
    this.setState({ queue })
  }

  render() {
    return (
      <Container>
        <TopBar>I'm gay</TopBar>
        <BodyContainer>
          <DragDropContext onDragEnd={this.handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <Playlist
                  innerRef={provided.innerRef}
                  isDragging={snapshot.isDraggingOver}
                >
                  {this.state.queue.map((item, index) => (
                    <PlaylistEntry key={item.id} index={index} song={item} />
                  ))}
                  {provided.placeholder}
                  {!this.state.queue.length && 'Playlist is empty'}
                </Playlist>
              )}
            </Droppable>
          </DragDropContext>
        </BodyContainer>
      </Container>
    )
  }
}
