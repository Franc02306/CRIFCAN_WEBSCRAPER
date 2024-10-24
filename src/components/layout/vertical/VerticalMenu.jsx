import React from 'react'

// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Component Imports
import { useSession } from 'next-auth/react'

import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'
import CustomChip from '@core/components/mui/Chip'

// Hook Imports
import { useSettings } from '@core/hooks/useSettings'
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// verticalMenuData Imports
import verticalMenuData from '../../../data/navigation/verticalMenuData';

const RenderExpandIcon = ({ open, transitionDuration }) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='tabler-chevron-right' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const { settings } = useSettings()
  const params = useParams()
  const { isBreakpointReached } = useVerticalNav()
  const { data: session, status } = useSession()

  const menuData = verticalMenuData(dictionary, params, session); // DATOS DEL MENU

  // Definir ScrollWrapper
  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  // Variables
  const { transitionDuration } = verticalNavOptions
  const { lang: locale, id } = params

  // Determinar roles del usuario
  const isAdmin = session?.user?.system_role?.[0]?.id === 1 // Administrador del Sistema
  const isCommitteeDirector = session?.user?.system_role?.[0]?.id === 2
  const isRegularUser = session?.user?.system_role?.[0]?.id >= 3

  return (
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false),
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true),
        })}
    >
      <Menu
        popoutMenuOffset={{ mainAxis: 23 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme, settings)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={verticalNavOptions.transitionDuration} />}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        {menuData
          .filter(section => section.permission ? section.permission() : true)
          .map((section, index) => (
            <MenuSection key={index} label={section.label}>
              {section.children && Array.isArray(section.children) ? (
                section.children.map((item, idx) => (
                  <MenuItem key={idx} href={item.href} icon={<i className={item.icon} />}>
                    {item.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem href={section.href} icon={<i className={section.icon} />}>
                  {section.label}
                </MenuItem>
              )}
            </MenuSection>
          ))}
      </Menu>
    </ScrollWrapper>
  );
}

export default VerticalMenu;
