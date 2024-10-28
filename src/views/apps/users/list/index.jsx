import { Grid } from '@mui/material'

import UserList from './UserList'

const UsersListIndex = ({ users, onUserAdded }) => {
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <UserList users={users} onUserAdded={onUserAdded} />
      </Grid>
    </Grid>
  )
}

export default UsersListIndex;