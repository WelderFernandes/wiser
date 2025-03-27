import { Home, SquareTerminal, TestTube } from 'lucide-react'

export const mainItems = [
  {
    groupName: 'Main',
    items: [
      {
        title: 'Teste',
        url: '/teste',
        icon: TestTube,
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
