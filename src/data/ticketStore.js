// Ticket yönetim sistemi

export const TICKET_TYPES = {
  NEW_MATERIAL: 'new_material',
  EXTEND_MATERIAL: 'extend_material',
  CHANGE_DESCRIPTION: 'change_description',
  ADD_UNIT: 'add_unit',
  DEACTIVATE: 'deactivate',
}

export const TICKET_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  RETURNED: 'returned',
  COMPLETED: 'completed',
}

let ticketCounter = 1000

export const generateTicketNumber = () => {
  const year = new Date().getFullYear()
  const month = String(new Date().getMonth() + 1).padStart(2, '0')
  const num = String(ticketCounter++).padStart(4, '0')
  return `TKT-${year}${month}-${num}`
}

export const INITIAL_TICKETS = []

export const createTicket = (type, items, createdBy, note = '') => {
  const ticket = {
    id: Date.now(),
    ticketNumber: generateTicketNumber(),
    type,
    items, // Array of material requests
    status: TICKET_STATUS.PENDING,
    createdBy,
    createdAt: new Date().toISOString(),
    note,
    history: [
      {
        action: 'created',
        user: createdBy,
        timestamp: new Date().toISOString(),
        comment: note || 'Ticket oluşturuldu',
      }
    ]
  }
  return ticket
}

export const updateTicketStatus = (ticket, status, user, comment) => {
  return {
    ...ticket,
    status,
    returnedTo: status === TICKET_STATUS.RETURNED ? ticket.createdBy : null,
    history: [
      ...ticket.history,
      {
        action: status,
        user,
        timestamp: new Date().toISOString(),
        comment,
      }
    ]
  }
}

export const returnTicket = (ticket, user, comment, rejectedItems = []) => {
  return {
    ...ticket,
    status: TICKET_STATUS.RETURNED,
    returnedTo: ticket.createdBy,
    rejectedItems, // Hangi malzemeler uygun değil
    history: [
      ...ticket.history,
      {
        action: 'returned',
        user,
        timestamp: new Date().toISOString(),
        comment,
        rejectedItems,
      }
    ]
  }
}
