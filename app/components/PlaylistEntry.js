import React from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div``

const Item = styled.div`
  transition: background-color 100ms ease-out;
  color: black;
  background-color: ${props => (props.isDragging ? 'white' : '#E6E8EB')};
  padding: 10px;
  border-radius: 4px;
  margin: 5px 0;
`

const PlaylistEntry = props => (
  <Draggable key={props.id} draggableId={props.id} index={props.index}>
    {(provided, snapshot) => (
      <Container>
        <Item
          innerRef={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          isDragging={snapshot.isDragging}
        >
          {props.id} Playlist content goes here
        </Item>
        {provided.placeholder}
      </Container>
    )}
  </Draggable>
)

export default PlaylistEntry
