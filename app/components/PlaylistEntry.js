import React from 'react'
import styled from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const Container = styled.div``

const Item = styled.div``

const PlaylistEntry = props => (
  <Draggable key={props.id} draggableId={props.id} index={props.index}>
    {(provided, snapshot) => (
      <Container>
        <Item
          innerRef={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {props.id} Playlist content goes here
        </Item>
        {provided.placeholder}
      </Container>
    )}
  </Draggable>
)

export default PlaylistEntry
