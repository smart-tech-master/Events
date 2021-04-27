import React, {useState} from 'react'
import styled from 'styled-components'
import Layout from 'organization/user/Layout'
import Page from 'organization/user/Layout/Page'
import Typography from '@material-ui/core/Typography'
import {spacing} from 'lib/ui/theme'
import withStyles from '@material-ui/core/styles/withStyles'
import {Attendee} from 'Event/attendee'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import {formatDate} from 'lib/date-time'
import AttendeeImport from 'organization/Event/AttendeeList/AttendeeImport'
import {
  useAttendees,
  useCheckIn,
} from 'organization/Event/AttendeeList/attendees'
import Alert from '@material-ui/lab/Alert'
import {useExportAttendees} from 'organization/Event/AttendeeList/attendee-csv'

export default function AttendeeList() {
  const {
    attendees,
    update: updateAttendee,
    insert: insertAttendees,
  } = useAttendees()
  const checkIn = useCheckIn()
  const [error, setError] = useState<string | null>(null)
  const exportAttendees = useExportAttendees({onError: setError})

  const clearError = () => setError(null)

  const completeCheckIn = (attendee: Attendee) => () => {
    clearError()

    checkIn(attendee)
      .then(updateAttendee)
      .catch((e) => setError(e.message))
  }

  const handleImportedAttendees = (attendees: Attendee[]) => {
    insertAttendees(attendees)
  }

  return (
    <Layout>
      <Page>
        <Title variant="h5">Attendee Management</Title>
        <ExportButton
          variant="outlined"
          color="primary"
          aria-label="export attendees"
          onClick={exportAttendees}
        >
          Export
        </ExportButton>
        <AttendeeImport
          onSuccess={handleImportedAttendees}
          onError={setError}
          button={(inputId, submitting) => (
            <Button
              variant="outlined"
              color="primary"
              aria-label="import attendees"
              onClick={clearError}
              disabled={submitting}
            >
              <ImportButtonLabel htmlFor={inputId}>Import</ImportButtonLabel>
            </Button>
          )}
          successAlert={(numImported, onClose) => (
            <StyledAlert severity="info" onClose={onClose}>
              Successfully imported {numImported} attendees
            </StyledAlert>
          )}
        />

        <Error onClose={clearError}>{error}</Error>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Email</TableCell>
              <TableCell align="right">Checked-In On</TableCell>
              <TableCell align="right">Check In</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendees.map((attendee: Attendee) => (
              <TableRow key={attendee.id}>
                <TableCell component="th" scope="row" aria-label="name">
                  {`${attendee.first_name} ${attendee.last_name}`}
                </TableCell>
                <TableCell align="right" aria-label="email">
                  {attendee.email}
                </TableCell>
                <TableCell align="right">
                  <CheckedInAt>{attendee.tech_check_completed_at}</CheckedInAt>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color="primary"
                    aria-label="mark as completed tech check"
                    onClick={completeCheckIn(attendee)}
                  >
                    Check-In
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Page>
    </Layout>
  )
}

function CheckedInAt(props: {children: Attendee['tech_check_completed_at']}) {
  const label = 'date of completing tech check'

  if (!props.children) {
    return <span aria-label={label}>Not Checked-In</span>
  }

  return <span aria-label={label}>{formatDate(props.children)}</span>
}

function Error(props: {children: string | null; onClose: () => void}) {
  if (!props.children) {
    return null
  }

  return (
    <StyledAlert severity="error" onClose={props.onClose}>
      {props.children}
    </StyledAlert>
  )
}

const Title = withStyles({
  root: {
    marginBottom: spacing[4],
  },
})(Typography)

const ExportButton = withStyles({
  root: {
    marginRight: spacing[2],
  },
})(Button)

const ImportButtonLabel = styled.label`
  cursor: pointer;
`

const StyledAlert = withStyles({
  root: {
    marginBottom: spacing[2],
  },
})(Alert)
