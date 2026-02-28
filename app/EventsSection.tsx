import {getAllEvents} from '../src/utils/events'
import {AllEvents} from '../src/AllEvents'

export async function EventsSection() {
  const events = await getAllEvents().catch(() => [])
  return <AllEvents events={events} />
}
