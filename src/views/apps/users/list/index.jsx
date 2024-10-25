import { Grid } from '@mui/material'

import UserList from './UserList'

const UsersListIndex = ({ users, handleUserAdded }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserList users={users} handleUserAdded={handleUserAdded} />
      </Grid>
    </Grid>
  )
}

export default UsersListIndex;