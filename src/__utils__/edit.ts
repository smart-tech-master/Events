import {fireEvent} from '@testing-library/react'
import {
  EDIT_COMPONENT_BUTTON_CLASS,
  EDIT_COMPONENT_CLASS,
} from 'Event/Dashboard/editor/views/EditComponent'

/**
 * Test helper to click the 'edit' button
 * for a given component element.
 *
 * @param el
 */
export function clickEdit(el: HTMLElement) {
  const editButton = el
    .closest(`.${EDIT_COMPONENT_CLASS}`) // parent edit component div
    ?.querySelector(`.${EDIT_COMPONENT_BUTTON_CLASS}`) //  edit button

  if (!editButton) {
    throw new Error('Could not find edit button; is edit mode on?')
  }

  fireEvent.click(editButton)
}
