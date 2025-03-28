import { Calendar, Home, SquareTerminal } from 'lucide-react'

export const mainItems = [
  {
    groupName: 'Main',
    items: [
      {
        title: 'Agenda',
        url: '/calendar',
        icon: Calendar,
      },
      {
        title: 'Playground',
        url: '#',
        icon: Home,
        items: [
          {
            title: 'History',
            url: '#',
          },
          {
            title: 'Starred',
            url: '#',
          },
          {
            title: 'Settings',
            url: '#',
          },
        ],
      },
    ],
  },
  {
    groupName: 'Secondary',
    items: [
      {
        title: 'Playground',
        url: '#',
        icon: SquareTerminal,
        items: [
          {
            title: 'History',
            url: '#',
          },
          {
            title: 'Starred',
            url: '#',
          },
          {
            title: 'Settings',
            url: '#',
          },
        ],
      },
    ],
  },
]
