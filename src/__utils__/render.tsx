import React from 'react'
import {
  render as rtlRender,
  RenderOptions as RtlRenderOptions,
} from '@testing-library/react'
import AttendeeProfileProvider from 'Event/Dashboard/component-rules/AttendeeProfileProvider'
import MockStoreProvider from 'store/__utils__/MockStoreProvider'
import Providers from 'Providers'
import StaticEventProvider from 'Event/__utils__/StaticEventProvider'
import {fakeEvent} from 'Event/__utils__/factory'
import {ObvioEvent} from 'Event'
import {Organization} from 'organization'
import StaticOrganizationProvider from 'organization/__utils__/StaticOrganizationProvider'
import {Attendee} from 'Event/attendee'

type Options = Omit<RtlRenderOptions, 'queries'> & {
  event?: ObvioEvent
  organization?: Organization
  attendee?: Attendee
}

export const render = (component: React.ReactElement, options?: Options) => {
  const wrapped = (target: React.ReactElement, options?: Options) => {
    const groups = options?.attendee ? options.attendee.groups : {}
    const tags = options?.attendee ? options.attendee.tags : []

    return (
      <Providers storeProvider={MockStoreProvider}>
        <WithOrganization organization={options?.organization}>
          <WithEvent event={options?.event}>
            <AttendeeProfileProvider tags={tags} groups={groups}>
              {target}
            </AttendeeProfileProvider>
          </WithEvent>
        </WithOrganization>
      </Providers>
    )
  }

  const {rerender: rtlRerender, ...renderResult} = rtlRender(
    wrapped(component, options),
    options,
  )

  const rerender = (component: React.ReactElement, options?: Options) => {
    return rtlRerender(wrapped(component, options))
  }

  return {
    rerender,
    ...renderResult,
  }
}

function WithEvent(props: {event?: ObvioEvent; children: React.ReactElement}) {
  if (!props.event) {
    return props.children
  }

  return (
    <StaticEventProvider event={props.event}>
      {props.children}
    </StaticEventProvider>
  )
}

function WithOrganization(props: {
  organization?: Organization
  children: React.ReactElement
}) {
  if (!props.organization) {
    return props.children
  }

  return (
    <StaticOrganizationProvider organization={props.organization}>
      {props.children}
    </StaticOrganizationProvider>
  )
}

export function renderWithEvent(
  component: React.ReactElement,
  event: ObvioEvent = fakeEvent(),
) {
  const {rerender: rtlRerender, ...renderResult} = render(
    <StaticEventProvider event={event}>{component}</StaticEventProvider>,
  )

  const rerender = (
    component: React.ReactElement,
    newEvent: ObvioEvent = fakeEvent(),
  ) => {
    return rtlRerender(
      <StaticEventProvider event={newEvent || event}>
        {component}
      </StaticEventProvider>,
    )
  }

  return {...renderResult, rerender}
}

// Need to use nextSibling because of material UI bug not adding label to input
// https://github.com/mui-org/material-ui/issues/22950
export const inputElementFor = (select: HTMLElement) =>
  select.nextSibling as HTMLInputElement
