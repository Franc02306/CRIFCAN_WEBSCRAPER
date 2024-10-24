import React, { useCallback, useEffect, useState } from 'react'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, InputAdornment, IconButton, Checkbox, Snackbar, Alert, TablePagination, Autocomplete } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Visibility, VisibilityOff } from '@mui/icons-material';

import Swal from 'sweetalert2'

import { UserPlus } from 'tabler-icons-react'

import { useTheme } from '@emotion/react'

import DialogCloseButton from '@components/dialogs/DialogCloseButton'

import {
  addUser,
  getIdentification,
  getSystemRoles,
  getCountry,
  updateUserById,
  getUserById,
  updateUserByIdPatch
} from '../../../../service/userService'

import { getInstitutions } from '../../../../service/institutionService'

import { getCustomGroups } from '../../../../service/groupService'

const TabPanel = ({ children, value, index }) => {
  return (
    <div role='tabpanel' hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  )
}

// ESTA DATA TIENE QUE ESTAR CONFORME CON LO QUE ESPERA EL JSON DE LA API POST
const initialData = {
  groups: [],
  system_role: '',
  password: '',
  username: '',
  last_name: '',
  email: '',
  number_identification: '',
  is_active: true,
  identification_type: '',
  country: '',
  institution: ''
}

const countryInstitutionMap = {
  14: [1, 5], // Bolivia (SGCAN, SENASA)
  15: [2, 6], // Colombia (SENASAG, MINCETUR)
  16: [3, 7], // Ecuador (ICA, VCEeL)
  17: [4, 8]  // Perú (AGROCALIDA, MINCIT)
};

const AddUserDrawer = ({ open, setOpen, handleUserAdded, id, user, mode }) => {
  const [error, setError] = useState(null)
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [identifications, setIdentifications] = useState([])
  const [institutions, setInstitutions] = useState([]) // LISTA DE LOS VALORES DE INSTITUCION
  const [filteredInstitutions, setFilteredInstitutions] = useState([]); // ESTADO PARA ALMACENAR INSTITUCIONES FILTRADAs
  const [countries, setCountries] = useState([]) // LISTA DE LOS VALORES DE PAISES
  const [formData, setFormData] = useState(initialData)
  const [filteredIdentifications, setFilteredIdentifications] = useState([])
  const [maxDocLength, setMaxDocLength] = useState(Infinity)
  const [tabIndex, setTabIndex] = useState(0) // Estado para manejar la pestaña activa
  const [options, setOptions] = useState([])
  const [groups, setGroups] = useState([])
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [page, setPage] = useState(0)
  const [infoMessage, setInfoMessage] = useState('')
  const [openInfoSnackbar, setOpenInfoSnackbar] = useState(false)

  const [userData, setUserData] = useState(user) // DATOS DE USUARIO

  // ROLES DE SISTEMA
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');

  //  ESTADOS PARA CONTROLAR LA VISIBILIDAD DE LA CONTRASEÑA
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // ALERTAS SNACKBAR
  const [errorUsername, setErrorUsername] = useState(false);
  const [errorLastName, setErrorLastName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);

  const theme = useTheme()

  const handleClickShowPassword = () => setShowPassword((show) => !show)
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show)

  const updateUser = useCallback(async () => {
    if (id) {
      const response = await getUserById(id)

      console.log(response.data)
      setUserData(response.data)
    }
  }, [id])

  useEffect(() => {
    if (id) {
      updateUser()
    }
  }, [id, updateUser])

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 5))
    setPage(0)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue)
  }

  const handleGroupSelection = (groupId) => {
    setFormData((prevFormData) => ({
      ...prevFormData,

      // Aquí asegúrate de que solo se asignan los IDs de los grupos
      groups: prevFormData.groups.includes(groupId)
        ? prevFormData.groups.filter((id) => id !== groupId)
        : [...prevFormData.groups, groupId]
    }));

    console.log(groups)
  };

  const fetchGroups = async () => {
    try {
      const response = await getCustomGroups();

      console.log('Respuesta de la API getGroups:', response.data.results);

      setGroups(response.data.results);
    } catch (error) {
      console.error('Error al obtener los grupos de trabajo:', error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const getIdentifications = async () => {
    try {
      const response = await getIdentification();

      console.log("identificaciones: ", response.data.results)

      setIdentifications(response.data.results);
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const listInstitutions = async () => {
    try {
      const response = await getInstitutions()

      console.log(response.data.results)

      setInstitutions(response.data.results)
    } catch (error) {
      console.error('Error en la solicitud:', error)
    }
  }

  const getCountries = async () => {
    try {
      const response = await getCountry();

      setCountries(response.data.results);
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await getSystemRoles()

      setRoles(response.data.results)
    } catch (error) {
      console.error('Error al obtener los roles:', error)
    }
  }

  useEffect(() => {
    getIdentifications()
    listInstitutions()
    getCountries()
    fetchRoles()
  }, [])

  useEffect(() => {
    if (formData.country) {
      const filtered = identifications.filter(ident => {
        return [26, 27].includes(ident.id);  // Aplica la lógica de filtrado para todos
      });

      setFilteredIdentifications(filtered);
    }
  }, [formData.country, identifications]);

  useEffect(() => {
    if (formData.country) {
      const allowedInstitutionIds = countryInstitutionMap[formData.country] || [];

      const filtered = institutions.filter(inst =>
        allowedInstitutionIds.includes(inst.id)
      );

      setFilteredInstitutions(filtered);
    }
  }, [formData.country, institutions]);


  useEffect(() => {
    if (open && mode === 'edit' && userData) {
      setFormData({
        username: userData?.username || '',
        last_name: userData?.last_name || '',
        email: userData?.email || '',
        password: '',
        number_identification: userData?.number_identification || '',
        identification_type: userData?.identification_type?.id || '',
        institution: userData?.institution?.id || '',
        country: userData?.country?.id || '',
        system_role: userData?.system_role?.id || '',
        groups: userData?.assigned_group?.map(group_info => group_info.group_id) || []
      })
      setSelectedRole(userData?.system_role?.id || '')
    } else if (open && mode !== 'edit') {
      setFormData(initialData)
      setSelectedRole('')
    }
  }, [open, mode, userData])

  const handleSubmit = async (event) => {
    event.preventDefault();

    const titleColor = theme.palette.mode === 'dark' ? '#FFFFFF' : '#000000'
    const backgroundColor = theme.palette.background.paper
    const confirmButtonColor = theme.palette.primary.main

    // Reiniciar todos los errores
    setErrorUsername(false);
    setErrorLastName(false);
    setErrorEmail(false);

    // Validar campos requeridos y mostrar mensajes específicos
    if (!formData.username) {
      setErrorUsername(true);

      return;
    }

    if (!formData.last_name) {
      setErrorLastName(true);

      return;
    }

    if (!formData.email) {
      setErrorEmail(true);

      return;
    }

    if (!selectedRole) {
      setError('Debe seleccionar un rol del sistema');
      setOpenSnackbar(true);

      return;
    }

    if (mode === 'edit' && formData.password && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setOpenSnackbar(true);

      return;
    }

    try {
      const updatedFormData = {
        ...formData,
        system_role: selectedRole
      }

      if (formData.groups.length > 0) {
        updatedFormData.groups = formData.groups;
      }

      if (formData.password.trim()) {
        updatedFormData.password = formData.password;
      } else if (mode === 'edit') {
        delete updatedFormData.password;  // Eliminar campo solo si está en modo edición
      }

      console.log(updatedFormData)

      if (mode === 'edit') {
        await updateUserById(id, updatedFormData);
      } else {
        await addUser(updatedFormData);
        simulateEmailSend(formData.email)
      }

      setOpen(false);

      await Swal.fire({
        html: `<span style="font-family: Arial, sans-serif; font-size: 28px; color: ${titleColor};">Usuario ${mode === 'edit' ? 'actualizado' : 'creado'} exitosamente</span>`,
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: confirmButtonColor,
        background: backgroundColor,
        timer: 4000,
      }).then(() => {
        handleUserAdded();
      });

      setFormData(initialData);
    } catch (error) {
      if (error.response && error.response.data.email) {
        const emailErrors = error.response.data.email;

        if (emailErrors.includes("user with this email already exists.")) {
          setError('El correo electrónico ya está en uso.');
          setOpenSnackbar(true);
        }
      } else if (error.response && error.response.data.password) {
        const passwordErrors = error.response.data.password;

        if (passwordErrors.includes("This password is too short. It must contain at least 8 characters.")) {
          setError('La contraseña es demasiado corta. Debe tener al menos 8 caracteres.');
          setOpenSnackbar(true);
        }

        if (passwordErrors.includes("This password is too common.")) {
          setTimeout(() => {
            setError('La contraseña es demasiado común. Elige una contraseña más segura.');
            setOpenSnackbar(true);
          }, 3500);
        }

        if (passwordErrors.includes("The password is too similar to the username.")) {
          setError('La contraseña es demasiado similar al campo Nombres');
          setOpenSnackbar(true);
        }

      } else {
        setError('Error en la solicitud');
        setOpenSnackbar(true);
      }
    }
  };

  const simulateEmailSend = (email) => {
    new Promise((resolve) => {
      console.log(`Enviando correo a ${email}...`);

      // Simulación de tarea asíncrona en segundo plano
      setTimeout(() => {
        console.log('Correo enviado exitosamente');
        resolve();
      }, 0); // Ejecuta sin bloquear el flujo
    }).catch((error) => {
      console.error('Error al enviar el correo:', error);
    });
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value)
  }

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  }

  const validateUsername = (value) => {
    const maxLength = 60;

    if (value.length > maxLength) {
      setInfoMessage('Longitud máxima alcanzada: 60 caracteres en el campo Nombres');
      setOpenInfoSnackbar(true);

      return false;
    }

    return true;
  };

  const validateLastName = (value) => {
    const maxLength = 60;

    if (value.length > maxLength) {
      setInfoMessage('Longitud máxima alcanzada: 60 caracteres en el campo Apellidos');
      setOpenInfoSnackbar(true);

      return false;
    }

    return true;
  };

  const validateIdentification = (value) => {
    const maxLength = 12;

    if (value.length > maxLength) {
      setInfoMessage('Longitud máxima alcanzada: 12 caracteres en el campo Número de Identificación');
      setOpenInfoSnackbar(true);

      return false;
    }

    return true;
  };

  const validateEmail = (value) => {
    const maxLength = 100;

    if (value.length > maxLength) {
      setInfoMessage('Longitud máxima alcanzada: 100 caracteres en el campo Correo Electrónico');
      setOpenInfoSnackbar(true);

      return false;
    }

    return true;
  }

  const handleUsernameChange = (e) => {
    const value = e.target.value;

    if (validateUsername(value)) {
      setFormData({ ...formData, username: value });
    }
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;

    if (validateLastName(value)) {
      setFormData({ ...formData, last_name: value });
    }
  };

  const handleIdentificationChange = (e) => {
    const value = e.target.value;

    if (validateIdentification(value)) {
      setFormData({ ...formData, number_identification: value });
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;

    if (validateEmail(value)) {
      setFormData({ ...formData, email: value });
    }
  };

  const handleCloseInfoSnackbar = () => {
    setOpenInfoSnackbar(false);
  }

  const handleClose = () => {
    if (mode === 'edit' && userData) {
      setFormData({
        username: userData?.username || '',
        last_name: userData?.last_name || '',
        email: userData?.email || '',
        password: '',
        number_identification: userData?.number_identification || '',
        identification_type: userData?.identification_type?.id || '',
        institution: userData?.institution?.id || '',
        country: userData?.country?.id || '',
        system_role: userData?.system_role?.id || '',
        groups: userData?.groups?.map(group_info => group_info.id) || []
      });
      setSelectedRole(userData?.system_role?.id || '');
    } else {
      setFormData(initialData);
      setSelectedRole('');
    }

    setOpen(false);
  };


  useEffect(() => {
    if (open && mode === 'edit' && id) {
      updateUser(); // Esto obtiene los datos más recientes del usuario
    }
  }, [open, mode, id]);

  const handleReset = () => {
    if (mode === 'edit') {
      setFormData({
        username: userData?.username || '',
        last_name: userData?.last_name || '',
        email: userData?.email || '',
        password: userData?.password || '',
        number_identification: userData?.number_identification || '',
        identification_type: userData?.identification_type.id || '',
        institution: userData?.institution.id || '',
        country: userData?.country?.id,
        system_role: userData?.system_role?.id || [],
      })
    } else {
      setFormData(initialData)
      setSelectedRole('');
    }
  }

  return (
    <Dialog
      fullWidth
      open={open}
      onClose={handleClose}
      maxWidth='md'
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      {/* TITULO SEGUN DEL MODAL EL MODO */}
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center'>
        {mode === 'edit' ? 'Editar Usuario' : 'Agregar Usuario'}
      </DialogTitle>

      <Grid container spacing={2}>
        {/* Columna para las pestañas */}
        <Grid item xs={3}>
          <Box sx={{ width: '100%' }}>
            <Tabs orientation='vertical' value={tabIndex} onChange={handleTabChange} aria-label='Vertical tabs example'>
              <Tab label={mode === 'edit' ? 'Editar Datos' : 'Agregar Usuario'} />
              <Tab label={mode === 'edit' ? 'Editar Rol del Sistema' : 'Asignar Rol del Sistema '} />
              <Tab label={mode === 'edit' ? 'Editar Grupo de Trabajo' : 'Asignar Grupo de Trabajo'} />
              {mode === 'edit' && <Tab label="Seguridad" />}
            </Tabs>
          </Box>
        </Grid>

        {/* Columna para el contenido */}
        <Grid item xs={9}>
          <TabPanel value={tabIndex} index={0}>
            <form onSubmit={handleSubmit}>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant='outlined'>
                      <TextField
                        label='Nombres'
                        value={formData.username}
                        onChange={handleUsernameChange}
                        inputProps={{ maxLength: 61 }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth variant='outlined'>
                      <TextField
                        label='Apellidos'
                        value={formData.last_name}
                        onChange={handleLastNameChange}
                        inputProps={{ maxLength: 61 }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant='outlined'>
                      <InputLabel>País</InputLabel>
                      <Select
                        value={formData.country}
                        onChange={e => setFormData({ ...formData, country: e.target.value })}
                        label='País'
                      >
                        {countries.map(country => (
                          <MenuItem key={country.id} value={country.id}>
                            {country.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      options={filteredInstitutions} // Opciones pre-cargadas
                      getOptionLabel={(option) => option.name || ''} // Mostrar el nombre de la institución
                      value={filteredInstitutions.find(inst => inst.id === formData.institution) || null} // Muestra la institución seleccionada
                      onChange={(event, newValue) => {
                        setFormData({ ...formData, institution: newValue ? newValue.id : '' });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Institución"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: <></>,
                          }}
                        />
                      )}
                      isOptionEqualToValue={(option, value) => option.id === value.id} // Compara opciones por ID
                      noOptionsText="Sin coincidencias"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Identificación</InputLabel>
                      <Select
                        value={formData.identification_type}
                        disabled={!formData.country}
                        onChange={e =>
                          setFormData({ ...formData, identification_type: e.target.value })
                        }
                        label="Identificación"
                      >
                        {identifications.map(ident => (
                          <MenuItem key={ident.id} value={ident.id}>
                            {ident.description}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant='outlined'>
                      <TextField
                        label='Número de Identificación'
                        value={formData.number_identification}
                        onChange={handleIdentificationChange}
                        disabled={!formData.identification_type}
                        inputProps={{ inputMode: 'numeric', maxLength: 13 }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant='outlined'>
                      <TextField
                        label='Correo Electrónico'
                        value={formData.email}
                        onChange={handleEmailChange}
                        type='email'
                        autoComplete='off'
                        inputProps={{ maxLength: 101 }}
                      />
                    </FormControl>
                  </Grid>
                  {mode !== 'edit' && (
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth variant='outlined'>
                        <TextField
                          label="Contraseña"
                          value={formData.password}
                          onChange={e => setFormData({ ...formData, password: e.target.value })}
                          type={showPassword ? 'text' : 'password'}
                          autoComplete='new-password'
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={handleClickShowPassword}
                                  edge="end"
                                >
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }}
                        />
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
            </form>
          </TabPanel>

          <TabPanel value={tabIndex} index={1}>
            <DialogContent dividers>
              <FormControl fullWidth>
                <Box>
                  {roles.map((role) => (
                    <ListItem key={role.id} button onClick={() => setSelectedRole(role.id)}>
                      <ListItemAvatar>
                        <Avatar>{role.description.charAt(0)}</Avatar> {/* Primera letra del rol */}
                      </ListItemAvatar>
                      <ListItemText
                        primary={role.description}
                      />
                      <IconButton>
                        {selectedRole === role.id ? (
                          <CheckCircleIcon
                            style={{
                              color: theme.palette.mode === 'dark' ? 'lightgreen' : 'green'  // Cambia el color según el tema
                            }}
                          />
                        ) : (
                          <RadioButtonUncheckedIcon />
                        )}
                      </IconButton>
                    </ListItem>
                  ))}
                </Box>
              </FormControl>
            </DialogContent>
          </TabPanel>

          <TabPanel value={tabIndex} index={2}>
            <DialogContent dividers>
              <Box>
                <List>
                  {groups.length === 0 ? (
                    <p>No se encontraron grupos de trabajo.</p>
                  ) : (
                    groups.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((groupWrapper) => (
                      <ListItem key={groupWrapper.group_info.id}>
                        <ListItemAvatar>
                          <Avatar>{groupWrapper.group_info.name.charAt(0)}</Avatar> {/* Usar group.group.name */}
                        </ListItemAvatar>
                        <ListItemText
                          primary={groupWrapper.group_info.name} // Mostrar el nombre del grupo
                        // secondary={groupWrapper.description} // Mostrar la descripción del grupo
                        />
                        <Checkbox
                          checked={formData.groups?.includes(groupWrapper.group_info.id)}
                          onChange={() => handleGroupSelection(groupWrapper.group_info.id)}
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </Box>
            </DialogContent>

            <TablePagination
              component="div"
              count={groups.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[]}
            />
          </TabPanel>

          {mode === "edit" && (
            <TabPanel value={tabIndex} index={3}>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant='outlined'>
                      <TextField
                        label="Nueva Contraseña"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        type={showPassword ? 'text' : 'password'} // Alternar entre texto y password
                        autoComplete='new-password'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant='outlined'>
                      <TextField
                        label="Confirmar Contraseña"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleClickShowConfirmPassword}
                                edge="end"
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
            </TabPanel>
          )}
        </Grid>
      </Grid>

      {/* Snackbar para mostrar campos faltantes */}
      <Snackbar open={errorUsername} autoHideDuration={4000} onClose={() => setErrorUsername(false)}>
        <Alert onClose={() => setErrorUsername(false)} severity="error" sx={{ width: '100%' }}>
          El campo de Nombres es obligatorio.
        </Alert>
      </Snackbar>

      <Snackbar open={errorLastName} autoHideDuration={4000} onClose={() => setErrorLastName(false)}>
        <Alert onClose={() => setErrorLastName(false)} severity="error" sx={{ width: '100%' }}>
          El campo de Apellidos es obligatorio.
        </Alert>
      </Snackbar>

      <Snackbar open={errorEmail} autoHideDuration={4000} onClose={() => setErrorEmail(false)}>
        <Alert onClose={() => setErrorEmail(false)} severity="error" sx={{ width: '100%' }}>
          El campo de Correo Electrónico es obligatorio.
        </Alert>
      </Snackbar>

      {/* Snackbar para mostrar el error cuando las contraseñas no coinciden */}
      <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Snackbar para mostrar la información de límite de caracteres */}
      <Snackbar open={openInfoSnackbar} autoHideDuration={4000} onClose={handleCloseInfoSnackbar}>
        <Alert onClose={handleCloseInfoSnackbar} severity="info" sx={{ width: '100%' }}>
          {infoMessage}
        </Alert>
      </Snackbar>

      {/* BOTONES FUERA DEL TABPANEL */}
      <DialogActions>
        <Button onClick={handleClose} color='secondary'>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant='contained' color='primary'>
          {mode === 'edit' ? 'Actualizar' : 'Agregar'}
        </Button>
      </DialogActions>
    </Dialog>

  )
}

export default AddUserDrawer
