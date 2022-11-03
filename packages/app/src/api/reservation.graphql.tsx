import { gql } from '@apollo/client'

export const GET_RESERVATION_LIST = gql`
  query ($params: QueryParams) {
    reservations(params: $params) {
      id
      firstName
      lastName
      guestId
      arrivalTime
      tableSize
      status
    }
  }
`

export const GET_RESERVATION = gql`
  query ($reservationId: ID!) {
    reservation(id: $reservationId) {
      id
      guestId
      arrivalTime
      tableSize
    }
  }
`

export const CREATE_RESERVATION = gql`
  mutation ($guestId: String!, $arrivalTime: String!, $tableSize: Int!) {
    addReservation(guestId: $guestId, arrivalTime: $arrivalTime, tableSize: $tableSize) {
      id
      ctime
    }
  }
`

export const UPDATE_RESERVATION = gql`
  mutation ($reservation: UpdateParams) {
    updateReservation(reservation: $reservation) {
      id
      mtime
    }
  }
`
