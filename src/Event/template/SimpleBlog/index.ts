import {ResourceList} from 'Event/Dashboard/components/ResourceList'
import {Points} from 'Event/Dashboard/components/PointsSummary'
import {Agenda} from 'Event/Dashboard/components/AgendaList'
import {BlogPost} from 'Event/Dashboard/components/BlogPost'
import {EmojiList} from 'Event/Dashboard/components/EmojiList'
import {TicketRibbon} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbon'
import NavButton, {
  NavButtonWithSize,
} from 'Event/Dashboard/components/NavButton'
import {EntityList} from 'lib/list'

export const SIMPLE_BLOG = 'Simple Blog'

export interface SimpleBlog {
  version: number
  name: typeof SIMPLE_BLOG
  title: string
  mainNav: EntityList<NavButtonWithSize>
  primaryColor: string
  ticketRibbons: TicketRibbon[]
  logo: string
  welcomeText: string
  emojiList: EmojiList
  sidebar: {
    background: string
    textColor: string
  }
  sidebarNav: EntityList<NavButton>
  blogPosts: EntityList<BlogPost>
  agendas: Agenda[]
  points: Points | null
  resourceList: ResourceList
  footer: {
    background: string
    textColor: string
    termsLink: string | null
    privacyLink: string | null
    copyrightText: string | null
  }
}

export const createSimpleBlog = (): SimpleBlog => ({
  version: 1,
  name: SIMPLE_BLOG,
  title: '',
  mainNav: {
    entities: {},
    ids: [],
  },
  primaryColor: '#000000',
  ticketRibbons: [],
  logo: '',
  welcomeText: 'WELCOME TO YOUR DASHBOARD',
  emojiList: {
    emojis: [],
  },
  sidebar: {
    background: 'blue',
    textColor: '#ffffff',
  },
  sidebarNav: {
    entities: {},
    ids: [],
  },
  blogPosts: {
    entities: {},
    ids: [],
  },
  agendas: [],
  points: null,
  resourceList: {
    description: '',
    resources: [],
  },
  footer: {
    background: '#000000',
    textColor: '#FFFFFF',
    termsLink: null,
    privacyLink: null,
    copyrightText: null,
  },
})
