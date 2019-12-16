export default (theme) => ({
  /**
   * Not for mui, used for own styling customizations
   */
  custom: {
    padding: theme.padding,
    borderRadius: theme.borderRadius,
    palette: theme.palette
  },
  props: { //https://material-ui.com/customization/themes/#properties
    MuiTypography: {
      color: 'inherit' //typography component will default to inheriting color if color prop is not passed
    },
    MuiIconButton: {
      color: 'inherit'
    },
    MuiIcon: {
      color: 'inherit'
    }
  },
  typography: {
    fontFamily: theme.fontFamily,
    h1: {
      fontSize: '4.8rem',
      fontWeight: 300,
      lineHeight: '1.14286em',
      color: theme.palette.fontDark
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 400,
      lineHeight: '1.30357em',
      color: theme.palette.fontDark
    },
    h3: {
      fontSize: '2.8rem',
      fontWeight: 400,
      lineHeight: '1.13333em',
      color: theme.palette.fontDark
    },
    h4: {
      fontSize: '2.4rem',
      fontWeight: 400,
      lineHeight: '1.20588em',
      color: theme.palette.fontDark
    },
    h5: {
      fontSize: '2.1rem',
      fontWeight: 500,
      lineHeight: '1.35417em',
      color: theme.palette.fontDark
    },
    h6: {
      fontSize: '1.92rem',
      fontWeight: 500,
      lineHeight: '1.16667em',
      color: theme.palette.fontDark
    },
    subtitle1: {
      fontSize: '1.76rem',
      fontWeight: 400,
      lineHeight: '1.2em',
      color: theme.palette.fontDark
    },
    body2: {
      fontSize: '1.4rem',
      fontWeight: 400,
      lineHeight: '1.71429em',
      color: theme.palette.fontDark
    },
    body1: {
      fontSize: '1.4rem',
      fontWeight: 400,
      lineHeight: '1.46429em',
      color: theme.palette.fontDark
    },
    caption: {
      fontSize: '1.2rem',
      fontWeight: 400,
      lineHeight: '1.375em',
      color: theme.palette.fontNeutral
    },
    button: {
      fontSize: '1.4rem',
      textTransform: 'uppercase',
      fontWeight: 600,
      color: theme.palette.fontDark
    }
  },
  palette: {
    text: {
      primary: theme.palette.fontDark,
      secondary: theme.palette.fontNeutral
    },
    primary: {
      main: theme.palette.primary,
      contrastText: theme.palette.fontLight
    },
    secondary: {
      main: theme.palette.secondary,
      contrastText: theme.palette.fontDark
    },
    background: {
      default: theme.palette.canvas,
      paper: theme.palette.tertiary,
      contrastText: theme.palette.fontDark
    }
  },
  overrides: {
    MuiPaper: {
      rounded: {
        borderRadius: theme.borderRadius
      }
    },
    MuiSvgIcon: {
      colorAction: {
        color: theme.palette.actionSuccess
      }
    },
    MuiIcon: {
      colorAction: {
        color: theme.palette.actionSuccess
      }
    },
    MuiButton: {
      root: {
        borderRadius: theme.borderRadius,
        transition: `background-color ${theme.transition}s`
      }
    },
    MuiSelect: {
      root: {
        padding: `${theme.padding.base} 25px ${theme.padding.base} 15px`,
        fontSize: '1.6rem',
        lineHeight: '1.9rem',
      }
    },
    MuiToggleButtonGroup: {
      root: {
        borderRadius: theme.borderRadius
      }
    },
    MuiToggleButton: {
      root: {
        padding: '2px 10px',
        height: 'initial',
        transition: `background-color ${theme.transition}s`
      }
    },
    MuiInput: {
      root: {
        backgroundColor: theme.inputBackground
      },
      input: {
        marginTop: 10,
        borderRadius: theme.borderRadius,
        background: theme.inputBackground,
        border: `1px solid ${theme.palette.inputBorder}`,
        fontSize: '1.4rem',
        padding: '.8rem',
        width: 'calc(100% - 24px)',
        '&:focus': {
          borderColor: theme.palette.primary,
          boxShadow: 'none'
        },
        '&::placeholder': {
          color: theme.palette.fontNeutral
        }
      }
    },
    MuiInputLabel: {
      root: {
        color: theme.palette.fontDark,
        fontSize: '1.3em'
      }
    },
    MuiTableCell: {
      root: {
        color: 'inherit',
        padding: `${theme.padding.base} ${theme.padding.base} ${theme.padding.base} ${theme.padding.small}`
      },
      body: {
        color: 'inherit',
      },
      head: {
        color: theme.palette.fontNeutral,
        fontSize: '1.2rem'
      }
    },
    MuiTableSortLabel: {
      root: {
        color: 'inherit',
        '&:hover, &:focus': {
          color: 'inherit'
        }
      },
      active: {
        color: 'inherit'
      }
    },
    MuiCircularProgress: {
      colorPrimary: {
        color: theme.palette.actionDefault
      }
    },
    MuiExpansionPanelSummary: {
      root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
          minHeight: 56,
        },
      },
      content: {
        '&$expanded': {
          margin: '12px 0',
        },
      },
      expanded: {},
    },
    MuiExpansionPanel: {
      root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
          borderBottom: 0,
        },
        '&:before': {
          display: 'none',
        },
        '&$expanded': {
          margin: 'auto',
        },
      },
      expanded: {},
    },
    MuiExpansionPanelDetails: {
      root: {
        padding: '4px 0px 4px 20px',
      },
    }
  }
})
