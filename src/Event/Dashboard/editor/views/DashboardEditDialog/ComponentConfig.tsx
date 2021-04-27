import React from 'react'
import {SidebarContainerConfig} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer/SidebarContainerConfig'
import {EmojiListConfig} from 'Event/Dashboard/components/EmojiList/EmojiListConfig'
import {TicketRibbonConfig} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbonConfig'
import {MAIN_NAV_BUTTON} from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton'
import {MainNavButtonConfig} from 'Event/template/SimpleBlog/Dashboard/MainNav/MainNavButton/MainNavButtonConfig'
import {WELCOME_TEXT} from 'Event/template/SimpleBlog/Dashboard/WelcomeText'
import {WelcomeTextConfig} from 'Event/template/SimpleBlog/Dashboard/WelcomeText/WelcomeTextConfig'
import {SimpleBlogConfig} from 'Event/template/SimpleBlog/Dashboard/SimpleBlogConfig'
import {SIDEBAR_CONTAINER} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarContainer'
import {EMOJI_LIST} from 'Event/Dashboard/components/EmojiList'
import {TICKET_RIBBON} from 'Event/Dashboard/components/TicketRibbonList/TicketRibbon'
import {AGENDA} from 'Event/Dashboard/components/AgendaList'
import {AgendaConfig} from 'Event/Dashboard/components/AgendaList/AgendaConfig'
import {POINTS_SUMMARY} from 'Event/Dashboard/components/PointsSummary'
import {PointsSummaryConfig} from 'Event/Dashboard/components/PointsSummary/PointsSummaryConfig'
import {
  RESOURCE_ITEM,
  RESOURCE_LIST,
} from 'Event/Dashboard/components/ResourceList'
import {ResourceListConfig} from 'Event/Dashboard/components/ResourceList/ResourceListConfig'
import {ResourceItemConfig} from 'Event/Dashboard/components/ResourceList/ResourceItemConfig'
import {SidebarNavButtonConfig} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNavButtonConfig'
import {SIDEBAR_NAV_BUTTON} from 'Event/template/SimpleBlog/Dashboard/Sidebar/SidebarNav'
import {FOOTER} from 'Event/template/SimpleBlog/Dashboard/Footer'
import {FooterConfig} from 'Event/template/SimpleBlog/Dashboard/Footer/FooterConfig'
import {BLOG_POST} from 'Event/Dashboard/components/BlogPost'
import {BlogPostConfig} from 'Event/Dashboard/components/BlogPost/BlogPostConfig'
import {SIMPLE_BLOG} from 'Event/template/SimpleBlog'
import {SPEAKERS_TITLE} from 'Event/template/SimpleBlog/Speakers/MainTitle'
import {SpeakersTitleConfig} from 'Event/template/SimpleBlog/Speakers/MainTitle/SpeakersTitleConfig'
import {SpeakerConfig} from 'Event/Speakers/components/SpeakerList/SpeakerConfig'
import {SPEAKER} from 'Event/Speakers/components/SpeakerList'

// Must register config types here. This ensures wherever
// various component types are handled, that all possible
// components are accounted for.
export type ComponentConfig =
  | SimpleBlogConfig
  | MainNavButtonConfig
  | WelcomeTextConfig
  | SidebarContainerConfig
  | EmojiListConfig
  | TicketRibbonConfig
  | AgendaConfig
  | PointsSummaryConfig
  | ResourceListConfig
  | ResourceItemConfig
  | SidebarNavButtonConfig
  | FooterConfig
  | BlogPostConfig
  | SpeakersTitleConfig
  | SpeakerConfig

export function ComponentConfig(props: {config: ComponentConfig | null}) {
  if (!props.config) {
    return null
  }

  switch (props.config.type) {
    case MAIN_NAV_BUTTON:
      return <MainNavButtonConfig id={props.config.id} />
    case WELCOME_TEXT:
      return <WelcomeTextConfig />
    case SIMPLE_BLOG:
      return <SimpleBlogConfig />
    case SIDEBAR_CONTAINER:
      return <SidebarContainerConfig />
    case EMOJI_LIST:
      return <EmojiListConfig />
    case TICKET_RIBBON:
      return <TicketRibbonConfig index={props.config.index} />
    case AGENDA:
      return <AgendaConfig id={props.config.id} />
    case POINTS_SUMMARY:
      return <PointsSummaryConfig />
    case RESOURCE_LIST:
      return <ResourceListConfig />
    case RESOURCE_ITEM:
      return <ResourceItemConfig id={props.config.id} />
    case SIDEBAR_NAV_BUTTON:
      return <SidebarNavButtonConfig id={props.config.id} />
    case FOOTER:
      return <FooterConfig />
    case BLOG_POST:
      return <BlogPostConfig id={props.config.id} />
    case SPEAKERS_TITLE:
      return <SpeakersTitleConfig />
    case SPEAKER:
      return <SpeakerConfig id={props.config.id} />
    default:
      // @ts-ignore
      throw new Error(`Missing config component for type: ${props.config.type}`)
  }
}
